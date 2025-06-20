from llama_index.core.workflow import (
    Workflow,
    StartEvent,
    StopEvent,
    step,
    Context,
    Event,
)
from llama_index.llms.openai import OpenAI
from llama_index.core.agent.workflow.workflow_events import AgentStream
from llama_index.core.llms import ChatMessage
from typing import Any, List, Optional, Union


# You can render any information in the UI by sending a UIEvent
# ui_type is to identify the type of the annotation and render corresponding component
# data is the props of that UI component
class UIEvent(Event):
    ui_type: str
    data: Any


class ChatWorkflow(Workflow):

    llm: OpenAI = OpenAI(model="gpt-4.1")

    @step()
    async def run_step(self, ctx: Context, ev: StartEvent) -> StopEvent:
        user_msg: str = ev.get("user_msg")
        chat_history: Optional[List[ChatMessage]] = ev.get("chat_history", [])

        messages = [*chat_history, ChatMessage(role="user", content=user_msg)]

        # check messages length is 0
        if len(messages) == 0:
            return StopEvent(result="No messages provided")

        res = await self.llm.astream_chat(messages=messages)

        final_response = ""
        async for chunk in res:
            ctx.write_event_to_stream(
                AgentStream(
                    delta=chunk.delta or "",
                    response=final_response,
                    current_agent_name="assistant",
                    tool_calls=[],
                    raw=chunk.delta or "",
                )
            )
            final_response += chunk.delta or ""

        ctx.write_event_to_stream(
            AgentStream(
                delta="Tip 💡 You can also send an UIEvent to render information in the UI",
                response="",
                current_agent_name="assistant",
                tool_calls=[],
                raw="",
            )
        )

        # render sources on chat-ui
        ctx.write_event_to_stream(
            UIEvent(
                ui_type="sources",
                data={
                    "nodes": [
                        {"id": "1", "url": "/demo-source1.pdf"},
                        {"id": "2", "url": "/demo-source2.pdf"},
                    ],
                },
            )
        )

        # render weather on chat-ui
        ctx.write_event_to_stream(
            UIEvent(
                ui_type="weather",
                data={
                    "location": "San Francisco, CA",
                    "temperature": 22,
                    "condition": "sunny",
                    "humidity": 65,
                    "windSpeed": 12,
                },
            )
        )

        return StopEvent(result=final_response)


workflow = ChatWorkflow()
