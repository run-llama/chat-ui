# Installation

Both the SDK and the CLI are part of the LlamaDeploy Python package. To install, just run:

```bash
pip install -U llama-deploy
```

## Running the Deployment

At this point we have all we need to run this deployment. Ideally, we would have the API server already running
somewhere in the cloud, but to get started let's start an instance locally. Run the following python script
from a shell:

```
$ python -m llama_deploy.apiserver
INFO:     Started server process [10842]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:4501 (Press CTRL+C to quit)
```

From another shell, use the CLI, `llamactl`, to create the deployment:

```
$ llamactl deploy llama_deploy.yml
Deployment successful: QuickStart
```

### UI Interface

LlamaDeploy will serve the UI through the apiserver, at the address `http://localhost:4501/ui/<deployment name>`. In
this case, point the browser to [http://localhost:4501/deployments/QuickStart/ui](http://localhost:4501/deployments/QuickStart/ui) to interact
with your deployment through a user-friendly interface.
