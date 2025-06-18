import asyncio

from llama_index.core.workflow import (
    Context,
    Event,
    StartEvent,
    StopEvent,
    Workflow,
    step,
)


class UIEvent(Event):
    data: dict


class AdhocEvent(Event):
    pass


class EchoWorkflow(Workflow):
    """A dummy workflow with only one step sending back the input given."""

    def __init__(self, **kwargs):
        kwargs["timeout"] = None
        super().__init__(**kwargs)

    @step()
    async def run_step(
        self, ctx: Context, ev: StartEvent
    ) -> (
        AdhocEvent | StopEvent
    ):  # Specify AdhocEvent here just to by pass workflow validation

        message = str(ev.get("message", ""))
        ctx.write_event_to_stream(UIEvent(data={"request": message}))

        await ctx.set("counter", 0)

        # Loop, increase the counter and show it in UI
        while True:
            counter = int(await ctx.get("counter"))

            if counter > 100:
                return StopEvent(result="Counter reached 100, stopping workflow.")

            ctx.write_event_to_stream(UIEvent(data={"counter": counter}))
            await ctx.set("counter", counter + 1)
            await asyncio.sleep(1)

    @step()
    async def run_adhoc_step(self, ctx: Context, _: AdhocEvent) -> None:
        print("Adhoc step executed")
        counter = int(await ctx.get("counter"))
        ctx.write_event_to_stream(
            UIEvent(
                data={
                    "request": "User want to retrieve counter. Current value: "
                    + str(counter)
                }
            )
        )


echo_workflow = EchoWorkflow()
