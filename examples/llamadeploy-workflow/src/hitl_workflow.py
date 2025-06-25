from llama_index.core.workflow import (
    Workflow,
    StartEvent,
    StopEvent,
    step,
    Event,
    HumanResponseEvent,
    InputRequiredEvent,
    Context,
)


class ContinueEvent(HumanResponseEvent):
    user_response: str


class UIEvent(Event):
    data: dict


class HITLWorkflow(Workflow):
    def __init__(self, *args, **kwargs):
        if "timeout" not in kwargs:
            kwargs["timeout"] = None
        super().__init__(*args, **kwargs)

    @step
    async def step1(self, ev: StartEvent) -> InputRequiredEvent:
        return InputRequiredEvent(prefix="Please confirm whether to continue or not: ")

    @step
    async def step2(self, ctx: Context, ev: ContinueEvent) -> StopEvent:
        user_response: str = ev.user_response
        ctx.write_event_to_stream(UIEvent(data={"user_response": user_response}))
        return StopEvent(result=user_response)


workflow = HITLWorkflow()
