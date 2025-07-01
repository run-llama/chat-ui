# LlamaDeploy + LlamaIndexServer Example

This example demonstrates how to use **LlamaIndexServer** as a frontend chat interface for workflows deployed with [LlamaDeploy](https://github.com/run-llama/llama_deploy).

LlamaDeploy is a system for deploying and managing LlamaIndex workflows, while LlamaIndexServer provides a pre-built TypeScript server with an integrated chat UI that can connect directly to LlamaDeploy deployments. This example shows how you can quickly set up a complete chat application by combining these two technologies without needing to build custom UI components.

## Key Features

- Multiple examples of workflows:
  - [Custom Chat Workflow](src/chat_workflow.py)
  - [Agent Workflow](src/agent_workflow.py)
  - [Human in the Loop Workflow](src/cli_workflow.py)

Test the workflows by selecting one of them in the UI. The custom chat workflow is most sophisticated, as it supports sending annotations to the chat messages by sending specific events.

## Installation

Both the SDK and the CLI are part of the LlamaDeploy Python package. To install, just run:

```bash
uv sync
```

## Running the Deployment

At this point we have all we need to run this deployment. Ideally, we would have the API server already running
somewhere in the cloud, but to get started let's start an instance locally. Run the following python script
from a shell:

```
$ uv run -m llama_deploy.apiserver
INFO:     Started server process [10842]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:4501 (Press CTRL+C to quit)
```

From another shell, use the CLI, `llamactl`, to create the deployment:

```
$ uv run llamactl deploy llama_deploy.yml
Deployment successful: chat
```

### UI Interface

LlamaDeploy will serve the UI through the apiserver. Point the browser to [http://localhost:4501/deployments/chat/ui](http://localhost:4501/deployments/chat/ui) to interact
with your deployment through a user-friendly interface.

## Learn More

- [useChatWorkflow Hook](../../docs/chat-ui/hooks.mdx#usechatworkflow)
- [useWorkflow Hook](../../docs/chat-ui/hooks.mdx#useworkflow)
- [LlamaDeploy GitHub Repository](https://github.com/run-llama/llama_deploy)
- [Chat-UI Documentation](../../docs/chat-ui/)
