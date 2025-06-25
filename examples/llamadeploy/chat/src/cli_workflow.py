import subprocess
from typing import Any
from pydantic import Field

from llama_index.core.prompts import PromptTemplate
from llama_index.core.settings import Settings
from llama_index.core.workflow import (
    Context,
    InputRequiredEvent,
    HumanResponseEvent,
    StartEvent,
    StopEvent,
    Workflow,
    step,
)
from llama_index.core.llms import ChatMessage
from llama_index.core.agent.workflow.workflow_events import AgentStream


class CLIHumanInputEvent(InputRequiredEvent):
    command: str = Field(description="The command to execute.")


class CLIHumanResponseEvent(HumanResponseEvent):
    execute: bool = Field(description="Whether to execute the command or not.")
    command: str = Field(description="The command to execute.")


class CLIWorkflow(Workflow):

    default_prompt = PromptTemplate(
        template="""
        You are a helpful assistant who can write CLI commands to execute using bash.
        Your task is to analyze the user's request and write a CLI command to execute.

        ## User Request
        {user_request}

        Don't be verbose, only respond with the CLI command without any other text.
        """
    )

    def __init__(self, **kwargs: Any) -> None:
        # HITL Workflow should disable timeout otherwise, we will get a timeout error from callback
        kwargs["timeout"] = None
        super().__init__(**kwargs)

    @step
    async def start(self, ctx: Context, ev: StartEvent) -> CLIHumanInputEvent:
        user_msg: str = ev.get("user_msg")
        prompt = self.default_prompt.format(user_request=user_msg)

        response = await Settings.llm.acomplete(prompt, formatted=True)

        command = response.text.strip()
        if command == "":
            raise ValueError("Couldn't generate a command")

        return CLIHumanInputEvent(
            command=command,
        )

    @step
    async def handle_human_response(
        self,
        ctx: Context,
        ev: CLIHumanResponseEvent,
    ) -> StopEvent:
        should_execute = ev.execute

        if should_execute:
            res = subprocess.run(ev.command, shell=True, capture_output=True, text=True)
            command_result = res.stdout or res.stderr

            res = await Settings.llm.astream_chat(
                messages=[
                    ChatMessage(
                        role="user",
                        content=f"Show this command result {command_result} and summarize its output.",
                    ),
                ],
            )

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

            return StopEvent(result=final_response)
        else:
            return StopEvent(result=None)


workflow = CLIWorkflow()
