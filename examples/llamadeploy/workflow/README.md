# LlamaDeploy Workflow Example

This example demonstrates how to use the **chat-ui** library to create a custom interface for workflows deployed with [LlamaDeploy](https://github.com/run-llama/llama_deploy).

LlamaDeploy is a system for deploying and managing LlamaIndex workflows. This example shows how you can build a React-based interface that connects to and interacts with your deployed workflows using the `useWorkflow` hook.

## Key Features

- Start new workflows
- Send events to running workflows
- Stream real-time events from workflows

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
Deployment successful: workflow
```

### UI Interface

LlamaDeploy will serve the UI through via its apiserver.
Point the browser to [http://localhost:4501/deployments/workflow/ui](http://localhost:4501/deployments/workflow/ui) to interact with your workflow through a user-friendly interface.

## Learn More

- [useWorkflow Hook](../../docs/chat-ui/hooks.mdx#useworkflow)
- [LlamaDeploy GitHub Repository](https://github.com/run-llama/llama_deploy)
- [Chat-UI Documentation](../../docs/chat-ui/)
