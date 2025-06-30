import { LlamaIndexServer } from '@llamaindex/server'

new LlamaIndexServer({
  uiConfig: {
    starterQuestions: ['What can you do?', 'what is the weather in tokyo?'],
    componentsDir: 'components',
    layoutDir: 'layout',
    llamaDeploy: {
      deployment: 'chat',
      workflow: 'workflow',
    },
    // devMode: false, // TODO: disable dev mode because workflow is in python
    // enableFileUpload: true, // TODO: support file upload in nextjs
    // llamaCloudIndexSelector: true, // TODO: support llamacloud
  },
  port: 3000,
}).start()
