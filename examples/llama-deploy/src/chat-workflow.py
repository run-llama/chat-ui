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
from typing import List, Optional
from llama_index.server.models import (
    SourceNodesEvent,
    ArtifactEvent,
    UIEvent,
)
from llama_index.core.data_structs import Node
import time


class UIEvent(Event):
    type: str
    data: dict


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

        # send a sample source nodes event
        ctx.write_event_to_stream(
            SourceNodesEvent(
                nodes=[
                    NodeWithScore(
                        node=Node(
                            text="sample node 1",
                            metadata={"URL": "https://pdfobject.com/pdf/sample.pdf"},
                        ),
                        score=0.7,
                    ),
                    NodeWithScore(
                        node=Node(
                            text="sample node 2",
                            metadata={"URL": "https://pdfobject.com/pdf/sample.pdf"},
                        ),
                        score=0.8,
                    ),
                ],
            )
        )

        # send a sample artifact event
        ctx.write_event_to_stream(
            ArtifactEvent(
                data={
                    "type": "code",
                    "created_at": int(time.time()),
                    "data": {
                        "language": "typescript",
                        "file_name": "sample-artifact.ts",
                        "code": 'console.log("Hello, world!");',
                    },
                }
            )
        )

        # send a sample UI event with weather data
        ctx.write_event_to_stream(
            UIEvent(
                type="weather",
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
