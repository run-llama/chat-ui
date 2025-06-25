from llama_index.llms.openai import OpenAI
from llama_index.core.agent.workflow import AgentWorkflow

workflow = AgentWorkflow.from_tools_or_functions(
    tools_or_functions=[],
    llm=OpenAI(model="gpt-4o-mini"),
    system_prompt="You are a helpful assistant",
)
