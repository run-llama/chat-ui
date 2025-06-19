from llama_index.core.workflow import (
    Workflow,
    StartEvent,
    StopEvent,
    step,
    Context,
    Event,
)
from llama_index.llms.openai import OpenAI
from llama_index.core.llms import ChatMessage


class StreamEvent(Event):
    delta: str


class ChatWorkflow(Workflow):

    llm: OpenAI = OpenAI(model="gpt-4.1")

    @step()
    async def run_step(self, ctx: Context, ev: StartEvent) -> StopEvent:
        messages = ev.get("messages", [])

        # check messages length is 0
        if len(messages) == 0:
            return StopEvent(result="No messages provided")

        res = await self.llm.astream_chat(messages=[ChatMessage(**x) for x in messages])

        final_response = ""
        async for chunk in res:
            ctx.write_event_to_stream(
                StreamEvent(
                    delta=chunk.delta or "",
                )
            )
            final_response += chunk.delta or ""

        return StopEvent(result=final_response)


workflow = ChatWorkflow()
