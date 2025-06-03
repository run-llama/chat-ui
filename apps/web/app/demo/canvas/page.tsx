'use client'

import { useCopyToClipboard } from '@/app/use-copy-to-clipboard'
import {
  ChatCanvas,
  ChatInput,
  ChatMessages,
  ChatSection,
} from '@llamaindex/chat-ui'
import { Message, useChat } from 'ai/react'

const code = `
import {
  ChatCanvas,
  ChatInput,
  ChatMessages,
  ChatSection,
} from '@llamaindex/chat-ui'
import { useChat } from 'ai/react'

export function CustomChat() {
  const handler = useChat({ initialMessages: [] })

  return (
    <ChatSection
      handler={handler}
      className="block h-screen flex-row gap-4 p-0 md:flex md:p-5"
    >
      <div className="md:max-w-1/2 mx-auto flex h-full min-w-0 max-w-full flex-1 flex-col gap-4">
        <ChatMessages />
        <ChatInput />
      </div>
      <ChatCanvas className="w-full md:w-2/3" />
    </ChatSection>
  )
}
`

const initialMessages: Message[] = [
  {
    role: 'user',
    content: 'Write binary search algorithm in python',
    id: 'aeJ4ZOWlhUA2R4vg',
  },
  {
    id: 'Yqc9VoIR3ANyzTj3',
    role: 'assistant',
    content:
      'The artifact is a Python implementation of the binary search algorithm, which efficiently searches for a target value in a sorted list.' +
      `\n\`\`\`annotation\n${JSON.stringify({
        type: 'artifact',
        data: {
          type: 'code',
          data: {
            file_name: 'binary_search.py',
            code: 'def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\n# Example usage:\n# sorted_list = [1, 2, 3, 4, 5]\n# target = 3\n# result = binary_search(sorted_list, target)\n# print(result)  # Output: 2',
            language: 'python',
          },
          created_at: 1745480281756,
        },
      })}
      \n\`\`\`\n`,
    annotations: [
      {
        userInput: 'Write binary search algorithm in python',
        chatHistory: [],
      },
      {
        input: [
          {
            role: 'user',
            content: 'Write binary search algorithm in python',
          },
        ],
        currentAgentName: 'Agent',
      },
      {
        input: [
          {
            role: 'system',
            content:
              "You are a helpful assistant that generates code artifacts or document artifacts based on the user's request. Do NOT include installation instructions in the response. Please add a short summary about the artifact, don't include any other text or repeat the code or document",
          },
          {
            role: 'user',
            content: 'Write binary search algorithm in python',
          },
        ],
        currentAgentName: 'Agent',
      },
      {
        agentName: 'Agent',
        response: {
          role: 'assistant',
          content: '',
          options: {
            toolCall: [
              {
                name: 'code_artifact_generator',
                input: {
                  requirement:
                    'Binary search algorithm in Python that searches for a target value in a sorted list.',
                },
                id: 'call_2zAd9vJV9wFUDwEBf6aypLyc',
              },
            ],
          },
        },
        toolCalls: [
          {
            data: {
              agentName: 'Agent',
              toolName: 'code_artifact_generator',
              toolKwargs: {
                requirement:
                  'Binary search algorithm in Python that searches for a target value in a sorted list.',
              },
              toolId: 'call_2zAd9vJV9wFUDwEBf6aypLyc',
            },
            displayName: 'AgentToolCall',
          },
        ],
      },
      {
        response: {
          role: 'assistant',
          content: '',
          options: {
            toolCall: [
              {
                name: 'code_artifact_generator',
                input: {
                  requirement:
                    'Binary search algorithm in Python that searches for a target value in a sorted list.',
                },
                id: 'call_2zAd9vJV9wFUDwEBf6aypLyc',
              },
            ],
          },
        },
        toolCalls: [
          {
            data: {
              agentName: 'Agent',
              toolName: 'code_artifact_generator',
              toolKwargs: {
                requirement:
                  'Binary search algorithm in Python that searches for a target value in a sorted list.',
              },
              toolId: 'call_2zAd9vJV9wFUDwEBf6aypLyc',
            },
            displayName: 'AgentToolCall',
          },
        ],
        currentAgentName: 'Agent',
      },
      {
        agentName: 'Agent',
        toolCalls: [
          {
            data: {
              agentName: 'Agent',
              toolName: 'code_artifact_generator',
              toolKwargs: {
                requirement:
                  'Binary search algorithm in Python that searches for a target value in a sorted list.',
              },
              toolId: 'call_2zAd9vJV9wFUDwEBf6aypLyc',
            },
            displayName: 'AgentToolCall',
          },
        ],
      },
      {
        type: 'agent',
        data: {
          agent: 'Agent',
          text: 'Using tool: \'code_artifact_generator\' with inputs: \'{"requirement":"Binary search algorithm in Python that searches for a target value in a sorted list."}\'',
          type: 'text',
        },
      },
      {
        agentName: 'Agent',
        results: [
          {
            data: {
              toolName: 'code_artifact_generator',
              toolKwargs: {
                requirement:
                  'Binary search algorithm in Python that searches for a target value in a sorted list.',
              },
              toolId: 'call_2zAd9vJV9wFUDwEBf6aypLyc',
              toolOutput: {
                id: 'call_2zAd9vJV9wFUDwEBf6aypLyc',
                result:
                  '{\n  type: code,\n  data: {\n    file_name: binary_search.py,\n    code: def binary_search(arr, target):\\n    left, right = 0, len(arr) - 1\\n    while left <= right:\\n        mid = left + (right - left) // 2\\n        if arr[mid] == target:\\n            return mid\\n        elif arr[mid] < target:\\n            left = mid + 1\\n        else:\\n            right = mid - 1\\n    return -1\\n\\n# Example usage:\\n# sorted_list = [1, 2, 3, 4, 5]\\n# target = 3\\n# result = binary_search(sorted_list, target)\\n# print(result)  # Output: 2,\n    language: python\n  },\n  created_at: 1745480281756\n}',
                isError: false,
              },
              returnDirect: false,
              raw: {
                type: 'code',
                data: {
                  file_name: 'binary_search.py',
                  code: 'def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\n# Example usage:\n# sorted_list = [1, 2, 3, 4, 5]\n# target = 3\n# result = binary_search(sorted_list, target)\n# print(result)  # Output: 2',
                  language: 'python',
                },
                created_at: 1745480281756,
              },
            },
            displayName: 'AgentToolCallResult',
          },
        ],
      },
      {
        input: [
          {
            role: 'user',
            content: 'Write binary search algorithm in python',
          },
        ],
        currentAgentName: 'Agent',
      },
      {
        input: [
          {
            role: 'system',
            content:
              "You are a helpful assistant that generates code artifacts or document artifacts based on the user's request. Do NOT include installation instructions in the response. Please add a short summary about the artifact, don't include any other text or repeat the code or document",
          },
          {
            role: 'user',
            content: 'Write binary search algorithm in python',
          },
        ],
        currentAgentName: 'Agent',
      },
      {
        agentName: 'Agent',
        response: {
          role: 'assistant',
          content:
            'The artifact is a Python implementation of the binary search algorithm, which efficiently searches for a target value in a sorted list.',
        },
        toolCalls: [],
      },
      {
        response: {
          role: 'assistant',
          content:
            'The artifact is a Python implementation of the binary search algorithm, which efficiently searches for a target value in a sorted list.',
        },
        toolCalls: [],
        currentAgentName: 'Agent',
      },
      {
        result:
          'The artifact is a Python implementation of the binary search algorithm, which efficiently searches for a target value in a sorted list.',
      },
      {
        type: 'suggested_questions',
        data: [
          'How does the binary search algorithm work?',
          'Can you provide an example of how to implement binary search in Python?',
          'What are the time and space complexities of the binary search algorithm?',
        ],
      },
    ],
  },
  {
    role: 'user',
    content: 'Add some logs to the code',
    annotations: [],
    id: 'k2FkjYkhd44CC6xw',
  },
  {
    id: 'yWQHYXgn6WT0oE7J',
    role: 'assistant',
    content:
      'The artifact is a Python implementation of the binary search algorithm that includes logging statements to track the values of the left, right, and mid indices during each step of the search process.' +
      `\n\`\`\`annotation\n${JSON.stringify({
        type: 'artifact',
        data: {
          type: 'code',
          data: {
            file_name: 'binary_search.py',
            code: "import logging\n\nlogging.basicConfig(level=logging.INFO)\n\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        logging.info(f'Left: {left}, Right: {right}, Mid: {mid}, Mid Value: {arr[mid]}')\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\n# Example usage\nif __name__ == '__main__':\n    arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n    target = 7\n    result = binary_search(arr, target)\n    if result != -1:\n        logging.info(f'Target found at index: {result}')\n    else:\n        logging.info('Target not found')",
            language: 'python',
          },
          created_at: 1745480319651,
        },
      })}
      \n\`\`\`\n`,
    annotations: [
      {
        userInput: 'Add some logs to the code',
        chatHistory: [
          {
            content: 'Write binary search algorithm in python',
            role: 'user',
          },
          {
            content:
              'The artifact is a Python implementation of the binary search algorithm, which efficiently searches for a target value in a sorted list.',
            role: 'assistant',
          },
        ],
      },
      {
        input: [
          {
            content: 'Write binary search algorithm in python',
            role: 'user',
          },
          {
            content:
              'The artifact is a Python implementation of the binary search algorithm, which efficiently searches for a target value in a sorted list.',
            role: 'assistant',
          },
          {
            role: 'user',
            content: 'Add some logs to the code',
          },
        ],
        currentAgentName: 'Agent',
      },
      {
        input: [
          {
            role: 'system',
            content:
              "You are a helpful assistant that generates code artifacts or document artifacts based on the user's request. Do NOT include installation instructions in the response. Please add a short summary about the artifact, don't include any other text or repeat the code or document",
          },
          {
            content: 'Write binary search algorithm in python',
            role: 'user',
          },
          {
            content:
              'The artifact is a Python implementation of the binary search algorithm, which efficiently searches for a target value in a sorted list.',
            role: 'assistant',
          },
          {
            role: 'user',
            content: 'Add some logs to the code',
          },
        ],
        currentAgentName: 'Agent',
      },
      {
        agentName: 'Agent',
        response: {
          role: 'assistant',
          content: '',
          options: {
            toolCall: [
              {
                name: 'code_artifact_generator',
                input: {
                  requirement:
                    'Python implementation of the binary search algorithm with logging for each step of the search process.',
                },
                id: 'call_5vlAF3SDasVgtH3Wk0EgL2oX',
              },
            ],
          },
        },
        toolCalls: [
          {
            data: {
              agentName: 'Agent',
              toolName: 'code_artifact_generator',
              toolKwargs: {
                requirement:
                  'Python implementation of the binary search algorithm with logging for each step of the search process.',
              },
              toolId: 'call_5vlAF3SDasVgtH3Wk0EgL2oX',
            },
            displayName: 'AgentToolCall',
          },
        ],
      },
      {
        response: {
          role: 'assistant',
          content: '',
          options: {
            toolCall: [
              {
                name: 'code_artifact_generator',
                input: {
                  requirement:
                    'Python implementation of the binary search algorithm with logging for each step of the search process.',
                },
                id: 'call_5vlAF3SDasVgtH3Wk0EgL2oX',
              },
            ],
          },
        },
        toolCalls: [
          {
            data: {
              agentName: 'Agent',
              toolName: 'code_artifact_generator',
              toolKwargs: {
                requirement:
                  'Python implementation of the binary search algorithm with logging for each step of the search process.',
              },
              toolId: 'call_5vlAF3SDasVgtH3Wk0EgL2oX',
            },
            displayName: 'AgentToolCall',
          },
        ],
        currentAgentName: 'Agent',
      },
      {
        agentName: 'Agent',
        toolCalls: [
          {
            data: {
              agentName: 'Agent',
              toolName: 'code_artifact_generator',
              toolKwargs: {
                requirement:
                  'Python implementation of the binary search algorithm with logging for each step of the search process.',
              },
              toolId: 'call_5vlAF3SDasVgtH3Wk0EgL2oX',
            },
            displayName: 'AgentToolCall',
          },
        ],
      },
      {
        type: 'agent',
        data: {
          agent: 'Agent',
          text: 'Using tool: \'code_artifact_generator\' with inputs: \'{"requirement":"Python implementation of the binary search algorithm with logging for each step of the search process."}\'',
          type: 'text',
        },
      },
      {
        agentName: 'Agent',
        results: [
          {
            data: {
              toolName: 'code_artifact_generator',
              toolKwargs: {
                requirement:
                  'Python implementation of the binary search algorithm with logging for each step of the search process.',
              },
              toolId: 'call_5vlAF3SDasVgtH3Wk0EgL2oX',
              toolOutput: {
                id: 'call_5vlAF3SDasVgtH3Wk0EgL2oX',
                result:
                  "{\n  type: code,\n  data: {\n    file_name: binary_search.py,\n    code: import logging\\n\\nlogging.basicConfig(level=logging.INFO)\\n\\ndef binary_search(arr, target):\\n    left, right = 0, len(arr) - 1\\n    while left <= right:\\n        mid = left + (right - left) // 2\\n        logging.info(f'Left: {left}, Right: {right}, Mid: {mid}, Mid Value: {arr[mid]}')\\n        if arr[mid] == target:\\n            return mid\\n        elif arr[mid] < target:\\n            left = mid + 1\\n        else:\\n            right = mid - 1\\n    return -1\\n\\n# Example usage\\nif __name__ == '__main__':\\n    arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\\n    target = 7\\n    result = binary_search(arr, target)\\n    if result != -1:\\n        logging.info(f'Target found at index: {result}')\\n    else:\\n        logging.info('Target not found'),\n    language: python\n  },\n  created_at: 1745480319651\n}",
                isError: false,
              },
              returnDirect: false,
              raw: {
                type: 'code',
                data: {
                  file_name: 'binary_search.py',
                  code: "import logging\n\nlogging.basicConfig(level=logging.INFO)\n\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        logging.info(f'Left: {left}, Right: {right}, Mid: {mid}, Mid Value: {arr[mid]}')\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\n# Example usage\nif __name__ == '__main__':\n    arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n    target = 7\n    result = binary_search(arr, target)\n    if result != -1:\n        logging.info(f'Target found at index: {result}')\n    else:\n        logging.info('Target not found')",
                  language: 'python',
                },
                created_at: 1745480319651,
              },
            },
            displayName: 'AgentToolCallResult',
          },
        ],
      },
      {
        input: [
          {
            content: 'Write binary search algorithm in python',
            role: 'user',
          },
          {
            content:
              'The artifact is a Python implementation of the binary search algorithm, which efficiently searches for a target value in a sorted list.',
            role: 'assistant',
          },
          {
            role: 'user',
            content: 'Add some logs to the code',
          },
        ],
        currentAgentName: 'Agent',
      },
      {
        input: [
          {
            role: 'system',
            content:
              "You are a helpful assistant that generates code artifacts or document artifacts based on the user's request. Do NOT include installation instructions in the response. Please add a short summary about the artifact, don't include any other text or repeat the code or document",
          },
          {
            content: 'Write binary search algorithm in python',
            role: 'user',
          },
          {
            content:
              'The artifact is a Python implementation of the binary search algorithm, which efficiently searches for a target value in a sorted list.',
            role: 'assistant',
          },
          {
            role: 'user',
            content: 'Add some logs to the code',
          },
        ],
        currentAgentName: 'Agent',
      },
      {
        agentName: 'Agent',
        response: {
          role: 'assistant',
          content:
            'The artifact is a Python implementation of the binary search algorithm that includes logging statements to track the values of the left, right, and mid indices during each step of the search process.',
        },
        toolCalls: [],
      },
      {
        response: {
          role: 'assistant',
          content:
            'The artifact is a Python implementation of the binary search algorithm that includes logging statements to track the values of the left, right, and mid indices during each step of the search process.',
        },
        toolCalls: [],
        currentAgentName: 'Agent',
      },
      {
        result:
          'The artifact is a Python implementation of the binary search algorithm that includes logging statements to track the values of the left, right, and mid indices during each step of the search process.',
      },
      {
        type: 'suggested_questions',
        data: [
          'Can you explain how the binary search algorithm works?',
          'What are the time and space complexities of the binary search algorithm?',
          'How can I modify the binary search algorithm to return the index of the target value?',
        ],
      },
    ],
  },
]

export default function Page(): JSX.Element {
  return <CustomChat />
}

function CustomChat() {
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 })
  const handler = useChat({ initialMessages })

  return (
    <ChatSection
      handler={handler}
      className="block h-screen flex-row gap-4 p-0 md:flex md:p-5"
    >
      <div className="md:max-w-1/2 mx-auto flex h-full min-w-0 max-w-full flex-1 flex-col gap-4">
        <div className="flex justify-between gap-2 border-b p-4">
          <div>
            <h1 className="bg-gradient-to-r from-[#e711dd] to-[#0fc1e0] bg-clip-text text-lg font-bold text-transparent">
              LlamaIndex ChatUI - Canvas Demo
            </h1>
            <p className="text-sm text-zinc-400">
              Try click to a version to see how it works
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              copyToClipboard(code)
            }}
            className={`flex h-10 items-center gap-2 rounded-lg bg-zinc-700 px-2 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-600 ${
              isCopied ? 'bg-green-600 hover:bg-green-500' : ''
            }`}
          >
            {isCopied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
        <ChatMessages />
        <ChatInput />
      </div>
      <ChatCanvas className="w-full md:w-2/3" />
    </ChatSection>
  )
}
