import { LlamaIndexServer } from '@llamaindex/server'

new LlamaIndexServer({
  uiConfig: {
    // enable all config options except devmode
    starterQuestions: [
      'What can you do?',
      'Please write a paragraph about LlamaIndex.',
    ],
    componentsDir: 'components',
    layoutDir: 'layout',
    llamaDeploy: {
      deployment: 'chat',
      workflow: 'workflow',
    },
    enableFileUpload: true,
    llamaCloudIndexSelector: true,
  },
  port: 3000,
}).start()
