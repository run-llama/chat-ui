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
  {
    role: 'user',
    content: 'Generate a markdown document',
    id: 'a11J4ZOWlhUA2R4vg',
  },
  {
    id: 'x9CXy2oDcSMXYWTg',
    role: 'assistant',
    content:
      '# Research Report: Tesla Inc.\n\n## Executive Summary\n\nThis report provides a comprehensive overview of Tesla Inc., focusing on its intellectual property management, competitive landscape, sales and marketing strategies, ESG and human capital management, technological differentiation, business segments, and global operations. The analysis is based on recent research and official company disclosures, offering insights into Tesla’s strategies and market positioning as of 2024.\n\n---\n\n## 1. Intellectual Property Management and Patent Policy\n\nTesla emphasizes innovation and proprietary designs, protecting its intellectual property (IP) through patents, trademarks, copyrights, trade secrets, and contractual agreements. The company prioritizes obtaining patents to secure broad and strong protection for its technologies and designs, enabling operational freedom and defending its product portfolio.\n\nA notable aspect of Tesla’s IP strategy is its open patent policy: Tesla has pledged not to initiate lawsuits against any party for infringing its patents related to electric vehicles or related equipment, provided the party acts in good faith. This approach aims to foster industry-wide advancement in electric vehicle technology, benefiting both Tesla and the broader market [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\n\n---\n\n## 2. Competitive Landscape\n\n### Automotive Market\n\nTesla faces increasing competition from both established automakers and new entrants, particularly in areas such as self-driving technologies, charging solutions, and vehicle features. Tesla’s competitive edge lies in its ongoing development of Autopilot, Full Self-Driving (FSD), neural network capabilities, and its proprietary Supercharger network [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\n\n### Energy Market\n\nIn energy storage, Tesla competes with companies offering similar or alternative products, focusing on price, energy density, and efficiency. Its modular, scalable energy storage solutions and strong brand recognition provide a competitive advantage.\n\nFor solar energy systems, Tesla’s main competitors are traditional utility companies and other solar providers. Tesla competes on price, ease of adoption, and product integration, supported by a favorable regulatory environment for renewables [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\n\n---\n\n## 3. Sales, Marketing, and Customer Service\n\n| Aspect         | Tesla’s Approach                                                                                  |\n|----------------|--------------------------------------------------------------------------------------------------|\n| Sales          | Direct-to-consumer via website and company-owned stores; no traditional dealerships.              |\n| Marketing      | Minimal traditional advertising; focus on brand, customer education, and selective campaigns.     |\n| Customer Service | Company-owned service centers and mobile technicians; remote diagnostics and over-the-air updates. |\n\nTesla’s direct sales model allows for better inventory control, pricing, and customer feedback. The company integrates used vehicle sales and trade-ins into its business. For energy products, Tesla uses its website, stores, and channel partners to reach residential, commercial, and utility customers, emphasizing simplicity and standardization [citation:0e8472e1-de0d-420c-9273-73a927ef30e9][citation:e422d6ca-d57a-4c4a-860e-00f9977997d4].\n\n---\n\n## 4. Environmental, Social, and Governance (ESG) and Human Capital Management\n\nTesla’s ESG strategy centers on accelerating the transition to sustainable energy. The company designs efficient factories, reduces waste and resource consumption, and works to minimize its supply chain’s carbon footprint. Tesla enforces responsible sourcing, prohibits child or forced labor, and continually improves its processes based on international guidelines and stakeholder feedback.\n\nGovernance is overseen by an ESG Sustainability Council and the Board of Directors. Tesla invests in its workforce, offering career development programs, internal promotions, stock ownership, and industry-leading benefits. As of December 31, 2023, Tesla employed over 140,000 people globally [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2][citation:646ba9e3-714f-4c52-9a36-85456823971d].\n\n---\n\n## 5. Technological Differentiation\n\n### Automotive\n\n- Proprietary powertrain systems (dual/tri-motor)\n- In-house battery cell R&D and manufacturing (new lithium-ion cell design)\n- Advanced vehicle control and infotainment software with over-the-air updates\n- Vision-based self-driving technology (FSD, neural networks)\n- AI and robotics (e.g., Optimus humanoid robot)\n\n### Energy\n\n- Modular battery system design (Powerwall, Megapack)\n- Proprietary power electronics and software for grid integration\n- Solar Roof and in-house solar inverter technology\n- Seamless integration of solar and storage products\n\nTesla’s open patent policy and strong brand further reinforce its technological leadership [citation:7a52bb1b-3031-4a79-8c7a-23df587abcf8][citation:0e8472e1-de0d-420c-9273-73a927ef30e9][citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\n\n---\n\n## 6. Business Segments and Product Offerings\n\n| Segment         | Key Offerings                                                                                   |\n|-----------------|------------------------------------------------------------------------------------------------|\n| Automotive      | Electric vehicles (Model S, 3, X, Y, Cybertruck, Semi), Autopilot/FSD, used vehicles, ride-hailing (future) |\n| Energy          | Solar panels, Solar Roof, Powerwall, Megapack, solar inverters                                 |\n| Services/Other  | Supercharger network, home charging, software upgrades, insurance, vehicle servicing           |\n\nTesla’s integrated approach allows cross-segment synergies, such as using automotive battery technology in energy storage products [citation:7a52bb1b-3031-4a79-8c7a-23df587abcf8][citation:0e8472e1-de0d-420c-9273-73a927ef30e9][citation:e422d6ca-d57a-4c4a-860e-00f9977997d4].\n\n---\n\n## 7. Global Operations and Subsidiaries\n\nTesla operates through a vast network of subsidiaries worldwide, supporting manufacturing, sales, service, energy, insurance, and financial services. Key operational hubs include:\n\n- **United States**: Headquarters, manufacturing, energy, insurance\n- **Germany**: Manufacturing (Tesla Manufacturing Brandenburg SE)\n- **China**: Manufacturing, sales, service (Tesla Shanghai Co., Ltd., etc.)\n- **Mexico**: Manufacturing (Tesla Manufacturing Mexico, S. de R.L. de C.V.)\n- **Netherlands**: European operations and international holdings\n- **Australia, Canada, UK, France, Italy, Spain, Japan, Korea, India, and more**: Sales, service, energy, insurance, and financial services\n\nTesla’s global footprint enables it to serve diverse markets and scale its operations efficiently [citation:75a34096-b457-418f-8a40-f1c7c7623378][citation:3eaab116-f537-433f-b64f-9c5779ce33b7][citation:e0d8c80c-ae7f-4aaf-bb17-0526f7369358].\n\n---\n\n## Figures\n\n### Figure 1: Tesla’s Business Segments and Key Offerings\n\n| Segment         | Offerings                                                                                       |\n|-----------------|------------------------------------------------------------------------------------------------|\n| Automotive      | Electric vehicles, Autopilot/FSD, used vehicles, ride-hailing (future)                         |\n| Energy          | Solar panels, Solar Roof, Powerwall, Megapack, solar inverters                                 |\n| Services/Other  | Supercharger network, home charging, software upgrades, insurance, vehicle servicing           |\n\n### Figure 2: Tesla’s Global Operations (Selected Subsidiaries)\n\n| Region          | Key Subsidiaries/Entities                                                                      |\n|-----------------|------------------------------------------------------------------------------------------------|\n| USA             | Tesla, Inc., Tesla Energy Operations, Inc., Tesla Insurance                                    |\n| Germany         | Tesla Manufacturing Brandenburg SE                                                             |\n| China           | Tesla Shanghai Co., Ltd., Tesla (Shanghai) New Energy Co., Ltd.                               |\n| Mexico          | Tesla Manufacturing Mexico, S. de R.L. de C.V.                                                |\n| Netherlands     | Tesla Motors Netherlands B.V., Tesla International B.V.                                        |\n| Australia       | Tesla Motors Australia, Pty Ltd., Tesla Energy Ventures Australia Pty Ltd.                     |\n| Other Regions   | Numerous subsidiaries in Canada, UK, France, Italy, Spain, Japan, Korea, India, etc.           |\n\n---\n\n## Conclusion\n\nTesla’s integrated approach to technology, direct sales, and global operations, combined with its commitment to sustainability and innovation, positions it as a leader in both the automotive and energy sectors. The company’s strategies in IP management, ESG, and human capital further reinforce its competitive advantage and long-term growth prospects.\n```annotation\n{"type":"artifact","data":{"type":"document","created_at":1749099813536,"data":{"title":"DeepResearch Report","content":"# Research Report: Tesla Inc.\\n\\n## Executive Summary\\n\\nThis report provides a comprehensive overview of Tesla Inc., focusing on its intellectual property management, competitive landscape, sales and marketing strategies, ESG and human capital management, technological differentiation, business segments, and global operations. The analysis is based on recent research and official company disclosures, offering insights into Tesla’s strategies and market positioning as of 2024.\\n\\n---\\n\\n## 1. Intellectual Property Management and Patent Policy\\n\\nTesla emphasizes innovation and proprietary designs, protecting its intellectual property (IP) through patents, trademarks, copyrights, trade secrets, and contractual agreements. The company prioritizes obtaining patents to secure broad and strong protection for its technologies and designs, enabling operational freedom and defending its product portfolio.\\n\\nA notable aspect of Tesla’s IP strategy is its open patent policy: Tesla has pledged not to initiate lawsuits against any party for infringing its patents related to electric vehicles or related equipment, provided the party acts in good faith. This approach aims to foster industry-wide advancement in electric vehicle technology, benefiting both Tesla and the broader market [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\\n\\n---\\n\\n## 2. Competitive Landscape\\n\\n### Automotive Market\\n\\nTesla faces increasing competition from both established automakers and new entrants, particularly in areas such as self-driving technologies, charging solutions, and vehicle features. Tesla’s competitive edge lies in its ongoing development of Autopilot, Full Self-Driving (FSD), neural network capabilities, and its proprietary Supercharger network [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\\n\\n### Energy Market\\n\\nIn energy storage, Tesla competes with companies offering similar or alternative products, focusing on price, energy density, and efficiency. Its modular, scalable energy storage solutions and strong brand recognition provide a competitive advantage.\\n\\nFor solar energy systems, Tesla’s main competitors are traditional utility companies and other solar providers. Tesla competes on price, ease of adoption, and product integration, supported by a favorable regulatory environment for renewables [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\\n\\n---\\n\\n## 3. Sales, Marketing, and Customer Service\\n\\n| Aspect         | Tesla’s Approach                                                                                  |\\n|----------------|--------------------------------------------------------------------------------------------------|\\n| Sales          | Direct-to-consumer via website and company-owned stores; no traditional dealerships.              |\\n| Marketing      | Minimal traditional advertising; focus on brand, customer education, and selective campaigns.     |\\n| Customer Service | Company-owned service centers and mobile technicians; remote diagnostics and over-the-air updates. |\\n\\nTesla’s direct sales model allows for better inventory control, pricing, and customer feedback. The company integrates used vehicle sales and trade-ins into its business. For energy products, Tesla uses its website, stores, and channel partners to reach residential, commercial, and utility customers, emphasizing simplicity and standardization [citation:0e8472e1-de0d-420c-9273-73a927ef30e9][citation:e422d6ca-d57a-4c4a-860e-00f9977997d4].\\n\\n---\\n\\n## 4. Environmental, Social, and Governance (ESG) and Human Capital Management\\n\\nTesla’s ESG strategy centers on accelerating the transition to sustainable energy. The company designs efficient factories, reduces waste and resource consumption, and works to minimize its supply chain’s carbon footprint. Tesla enforces responsible sourcing, prohibits child or forced labor, and continually improves its processes based on international guidelines and stakeholder feedback.\\n\\nGovernance is overseen by an ESG Sustainability Council and the Board of Directors. Tesla invests in its workforce, offering career development programs, internal promotions, stock ownership, and industry-leading benefits. As of December 31, 2023, Tesla employed over 140,000 people globally [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2][citation:646ba9e3-714f-4c52-9a36-85456823971d].\\n\\n---\\n\\n## 5. Technological Differentiation\\n\\n### Automotive\\n\\n- Proprietary powertrain systems (dual/tri-motor)\\n- In-house battery cell R&D and manufacturing (new lithium-ion cell design)\\n- Advanced vehicle control and infotainment software with over-the-air updates\\n- Vision-based self-driving technology (FSD, neural networks)\\n- AI and robotics (e.g., Optimus humanoid robot)\\n\\n### Energy\\n\\n- Modular battery system design (Powerwall, Megapack)\\n- Proprietary power electronics and software for grid integration\\n- Solar Roof and in-house solar inverter technology\\n- Seamless integration of solar and storage products\\n\\nTesla’s open patent policy and strong brand further reinforce its technological leadership [citation:7a52bb1b-3031-4a79-8c7a-23df587abcf8][citation:0e8472e1-de0d-420c-9273-73a927ef30e9][citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\\n\\n---\\n\\n## 6. Business Segments and Product Offerings\\n\\n| Segment         | Key Offerings                                                                                   |\\n|-----------------|------------------------------------------------------------------------------------------------|\\n| Automotive      | Electric vehicles (Model S, 3, X, Y, Cybertruck, Semi), Autopilot/FSD, used vehicles, ride-hailing (future) |\\n| Energy          | Solar panels, Solar Roof, Powerwall, Megapack, solar inverters                                 |\\n| Services/Other  | Supercharger network, home charging, software upgrades, insurance, vehicle servicing           |\\n\\nTesla’s integrated approach allows cross-segment synergies, such as using automotive battery technology in energy storage products [citation:7a52bb1b-3031-4a79-8c7a-23df587abcf8][citation:0e8472e1-de0d-420c-9273-73a927ef30e9][citation:e422d6ca-d57a-4c4a-860e-00f9977997d4].\\n\\n---\\n\\n## 7. Global Operations and Subsidiaries\\n\\nTesla operates through a vast network of subsidiaries worldwide, supporting manufacturing, sales, service, energy, insurance, and financial services. Key operational hubs include:\\n\\n- **United States**: Headquarters, manufacturing, energy, insurance\\n- **Germany**: Manufacturing (Tesla Manufacturing Brandenburg SE)\\n- **China**: Manufacturing, sales, service (Tesla Shanghai Co., Ltd., etc.)\\n- **Mexico**: Manufacturing (Tesla Manufacturing Mexico, S. de R.L. de C.V.)\\n- **Netherlands**: European operations and international holdings\\n- **Australia, Canada, UK, France, Italy, Spain, Japan, Korea, India, and more**: Sales, service, energy, insurance, and financial services\\n\\nTesla’s global footprint enables it to serve diverse markets and scale its operations efficiently [citation:75a34096-b457-418f-8a40-f1c7c7623378][citation:3eaab116-f537-433f-b64f-9c5779ce33b7][citation:e0d8c80c-ae7f-4aaf-bb17-0526f7369358].\\n\\n---\\n\\n## Figures\\n\\n### Figure 1: Tesla’s Business Segments and Key Offerings\\n\\n| Segment         | Offerings                                                                                       |\\n|-----------------|------------------------------------------------------------------------------------------------|\\n| Automotive      | Electric vehicles, Autopilot/FSD, used vehicles, ride-hailing (future)                         |\\n| Energy          | Solar panels, Solar Roof, Powerwall, Megapack, solar inverters                                 |\\n| Services/Other  | Supercharger network, home charging, software upgrades, insurance, vehicle servicing           |\\n\\n### Figure 2: Tesla’s Global Operations (Selected Subsidiaries)\\n\\n| Region          | Key Subsidiaries/Entities                                                                      |\\n|-----------------|------------------------------------------------------------------------------------------------|\\n| USA             | Tesla, Inc., Tesla Energy Operations, Inc., Tesla Insurance                                    |\\n| Germany         | Tesla Manufacturing Brandenburg SE                                                             |\\n| China           | Tesla Shanghai Co., Ltd., Tesla (Shanghai) New Energy Co., Ltd.                               |\\n| Mexico          | Tesla Manufacturing Mexico, S. de R.L. de C.V.                                                |\\n| Netherlands     | Tesla Motors Netherlands B.V., Tesla International B.V.                                        |\\n| Australia       | Tesla Motors Australia, Pty Ltd., Tesla Energy Ventures Australia Pty Ltd.                     |\\n| Other Regions   | Numerous subsidiaries in Canada, UK, France, Italy, Spain, Japan, Korea, India, etc.           |\\n\\n---\\n\\n## Conclusion\\n\\nTesla’s integrated approach to technology, direct sales, and global operations, combined with its commitment to sustainability and innovation, positions it as a leader in both the automotive and energy sectors. The company’s strategies in IP management, ESG, and human capital further reinforce its competitive advantage and long-term growth prospects.","type":"markdown"}}}\n```\n',
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
