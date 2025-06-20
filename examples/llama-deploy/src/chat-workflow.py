from llama_index.core.workflow import (
    Workflow,
    StartEvent,
    StopEvent,
    step,
    Context,
    Event,
)
from llama_index.core.schema import (
    NodeWithScore,
)
from llama_index.llms.openai import OpenAI
from llama_index.core.agent.workflow.workflow_events import AgentStream
from llama_index.core.llms import ChatMessage
from typing import Any, List, Optional, Union
from llama_index.server.models import (
    SourceNodesEvent,
)
from llama_index.core.data_structs import Node


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

        ctx.write_event_to_stream(
            SourceNodesEvent(
                nodes=[
                    NodeWithScore(node=Node(text="text1"), score=0.7),
                    NodeWithScore(node=Node(text="text2"), score=0.8),
                ],
            )
        )

        return StopEvent(result=final_response)


workflow = ChatWorkflow()
