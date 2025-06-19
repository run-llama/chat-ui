import asyncio

from llama_index.core.workflow import (
    Workflow,
    StartEvent,
    StopEvent,
    step,
    Context,
    Event,
)


class UIEvent(Event):
    data: dict


class EchoWorkflow(Workflow):
    @step()
    async def run_step(self, ctx: Context, ev: StartEvent) -> StopEvent:
        message = str(ev.get("message", ""))

        # Loop, increase the counter to 10 and show it in UI
        for i in range(10):
            ctx.write_event_to_stream(UIEvent(data={"counter": i}))
            await ctx.set("counter", i + 1)
            await asyncio.sleep(1)

        return StopEvent(result=f"Message received: {message}")


workflow = EchoWorkflow()
