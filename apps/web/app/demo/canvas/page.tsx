'use client'

import { useCopyToClipboard } from '@/app/use-copy-to-clipboard'
import {
  ChatCanvas,
  ChatInput,
  ChatMessages,
  ChatSection,
} from '@llamaindex/chat-ui'
import { UIMessage as Message, useChat } from '@ai-sdk/react'
import { ArrowRightIcon, Code } from 'lucide-react'
import Link from 'next/link'

const code = `
import {
  ChatCanvas,
  ChatInput,
  ChatMessages,
  ChatSection,
} from '@llamaindex/chat-ui'
import { useChat } from '@ai-sdk/react'

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
    parts: [{ type: 'text', text: 'Write binary search algorithm in python' }],
    id: 'aeJ4ZOWlhUA2R4vg',
  },
  {
    id: 'Yqc9VoIR3ANyzTj3',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text:
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
      },
      {
        type: 'data-agent',
        data: {
          agent: 'Agent',
          text: 'Using tool: \'code_artifact_generator\' with inputs: \'{"requirement":"Binary search algorithm in Python that searches for a target value in a sorted list."}\'',
          type: 'text',
        },
      },
      {
        type: 'data-suggested-questions',
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
    parts: [{ type: 'text', text: 'Add some logs to the code' }],
    id: 'k2FkjYkhd44CC6xw',
  },
  {
    id: 'yWQHYXgn6WT0oE7J',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text:
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
      },
      {
        type: 'data-agent',
        data: {
          agent: 'Agent',
          text: 'Using tool: \'code_artifact_generator\' with inputs: \'{"requirement":"Python implementation of the binary search algorithm with logging for each step of the search process."}\'',
          type: 'text',
        },
      },
      {
        type: 'data-suggested-questions',
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
    parts: [
      {
        type: 'text',
        text: 'Analyze the report and provide a summary of the key findings and insights.',
      },
    ],
    id: 'a11J4ZOWlhUA2R4vg',
  },
  {
    id: 'x9CXy2oDcSMXYWTg',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: '# Research Report: Tesla Inc.\n\n## Executive Summary\n\nThis report provides a comprehensive overview of Tesla Inc., focusing on its intellectual property management, competitive landscape, sales and marketing strategies, ESG and human capital management, technological differentiation, business segments, and global operations. The analysis is based on recent research and official company disclosures, offering insights into Tesla’s strategies and market positioning as of 2024.\n\n---\n\n## 1. Intellectual Property Management and Patent Policy\n\nTesla emphasizes innovation and proprietary designs, protecting its intellectual property (IP) through patents, trademarks, copyrights, trade secrets, and contractual agreements. The company prioritizes obtaining patents to secure broad and strong protection for its technologies and designs, enabling operational freedom and defending its product portfolio.\n\nA notable aspect of Tesla’s IP strategy is its open patent policy: Tesla has pledged not to initiate lawsuits against any party for infringing its patents related to electric vehicles or related equipment, provided the party acts in good faith. This approach aims to foster industry-wide advancement in electric vehicle technology, benefiting both Tesla and the broader market [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\n\n---\n\n## 2. Competitive Landscape\n\n### Automotive Market\n\nTesla faces increasing competition from both established automakers and new entrants, particularly in areas such as self-driving technologies, charging solutions, and vehicle features. Tesla’s competitive edge lies in its ongoing development of Autopilot, Full Self-Driving (FSD), neural network capabilities, and its proprietary Supercharger network [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\n\n### Energy Market\n\nIn energy storage, Tesla competes with companies offering similar or alternative products, focusing on price, energy density, and efficiency. Its modular, scalable energy storage solutions and strong brand recognition provide a competitive advantage.\n\nFor solar energy systems, Tesla’s main competitors are traditional utility companies and other solar providers. Tesla competes on price, ease of adoption, and product integration, supported by a favorable regulatory environment for renewables [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\n\n---\n\n## 3. Sales, Marketing, and Customer Service\n\n| Aspect         | Tesla’s Approach                                                                                  |\n|----------------|--------------------------------------------------------------------------------------------------|\n| Sales          | Direct-to-consumer via website and company-owned stores; no traditional dealerships.              |\n| Marketing      | Minimal traditional advertising; focus on brand, customer education, and selective campaigns.     |\n| Customer Service | Company-owned service centers and mobile technicians; remote diagnostics and over-the-air updates. |\n\nTesla’s direct sales model allows for better inventory control, pricing, and customer feedback. The company integrates used vehicle sales and trade-ins into its business. For energy products, Tesla uses its website, stores, and channel partners to reach residential, commercial, and utility customers, emphasizing simplicity and standardization [citation:0e8472e1-de0d-420c-9273-73a927ef30e9][citation:e422d6ca-d57a-4c4a-860e-00f9977997d4].\n\n---\n\n## 4. Environmental, Social, and Governance (ESG) and Human Capital Management\n\nTesla’s ESG strategy centers on accelerating the transition to sustainable energy. The company designs efficient factories, reduces waste and resource consumption, and works to minimize its supply chain’s carbon footprint. Tesla enforces responsible sourcing, prohibits child or forced labor, and continually improves its processes based on international guidelines and stakeholder feedback.\n\nGovernance is overseen by an ESG Sustainability Council and the Board of Directors. Tesla invests in its workforce, offering career development programs, internal promotions, stock ownership, and industry-leading benefits. As of December 31, 2023, Tesla employed over 140,000 people globally [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2][citation:646ba9e3-714f-4c52-9a36-85456823971d].\n\n---\n\n## 5. Technological Differentiation\n\n### Automotive\n\n- Proprietary powertrain systems (dual/tri-motor)\n- In-house battery cell R&D and manufacturing (new lithium-ion cell design)\n- Advanced vehicle control and infotainment software with over-the-air updates\n- Vision-based self-driving technology (FSD, neural networks)\n- AI and robotics (e.g., Optimus humanoid robot)\n\n### Energy\n\n- Modular battery system design (Powerwall, Megapack)\n- Proprietary power electronics and software for grid integration\n- Solar Roof and in-house solar inverter technology\n- Seamless integration of solar and storage products\n\nTesla’s open patent policy and strong brand further reinforce its technological leadership [citation:7a52bb1b-3031-4a79-8c7a-23df587abcf8][citation:0e8472e1-de0d-420c-9273-73a927ef30e9][citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\n\n---\n\n## 6. Business Segments and Product Offerings\n\n| Segment         | Key Offerings                                                                                   |\n|-----------------|------------------------------------------------------------------------------------------------|\n| Automotive      | Electric vehicles (Model S, 3, X, Y, Cybertruck, Semi), Autopilot/FSD, used vehicles, ride-hailing (future) |\n| Energy          | Solar panels, Solar Roof, Powerwall, Megapack, solar inverters                                 |\n| Services/Other  | Supercharger network, home charging, software upgrades, insurance, vehicle servicing           |\n\nTesla’s integrated approach allows cross-segment synergies, such as using automotive battery technology in energy storage products [citation:7a52bb1b-3031-4a79-8c7a-23df587abcf8][citation:0e8472e1-de0d-420c-9273-73a927ef30e9][citation:e422d6ca-d57a-4c4a-860e-00f9977997d4].\n\n---\n\n## 7. Global Operations and Subsidiaries\n\nTesla operates through a vast network of subsidiaries worldwide, supporting manufacturing, sales, service, energy, insurance, and financial services. Key operational hubs include:\n\n- **United States**: Headquarters, manufacturing, energy, insurance\n- **Germany**: Manufacturing (Tesla Manufacturing Brandenburg SE)\n- **China**: Manufacturing, sales, service (Tesla Shanghai Co., Ltd., etc.)\n- **Mexico**: Manufacturing (Tesla Manufacturing Mexico, S. de R.L. de C.V.)\n- **Netherlands**: European operations and international holdings\n- **Australia, Canada, UK, France, Italy, Spain, Japan, Korea, India, and more**: Sales, service, energy, insurance, and financial services\n\nTesla’s global footprint enables it to serve diverse markets and scale its operations efficiently [citation:75a34096-b457-418f-8a40-f1c7c7623378][citation:3eaab116-f537-433f-b64f-9c5779ce33b7][citation:e0d8c80c-ae7f-4aaf-bb17-0526f7369358].\n\n---\n\n## Figures\n\n### Figure 1: Tesla’s Business Segments and Key Offerings\n\n| Segment         | Offerings                                                                                       |\n|-----------------|------------------------------------------------------------------------------------------------|\n| Automotive      | Electric vehicles, Autopilot/FSD, used vehicles, ride-hailing (future)                         |\n| Energy          | Solar panels, Solar Roof, Powerwall, Megapack, solar inverters                                 |\n| Services/Other  | Supercharger network, home charging, software upgrades, insurance, vehicle servicing           |\n\n### Figure 2: Tesla’s Global Operations (Selected Subsidiaries)\n\n| Region          | Key Subsidiaries/Entities                                                                      |\n|-----------------|------------------------------------------------------------------------------------------------|\n| USA             | Tesla, Inc., Tesla Energy Operations, Inc., Tesla Insurance                                    |\n| Germany         | Tesla Manufacturing Brandenburg SE                                                             |\n| China           | Tesla Shanghai Co., Ltd., Tesla (Shanghai) New Energy Co., Ltd.                               |\n| Mexico          | Tesla Manufacturing Mexico, S. de R.L. de C.V.                                                |\n| Netherlands     | Tesla Motors Netherlands B.V., Tesla International B.V.                                        |\n| Australia       | Tesla Motors Australia, Pty Ltd., Tesla Energy Ventures Australia Pty Ltd.                     |\n| Other Regions   | Numerous subsidiaries in Canada, UK, France, Italy, Spain, Japan, Korea, India, etc.           |\n\n---\n\n## Conclusion\n\nTesla’s integrated approach to technology, direct sales, and global operations, combined with its commitment to sustainability and innovation, positions it as a leader in both the automotive and energy sectors. The company’s strategies in IP management, ESG, and human capital further reinforce its competitive advantage and long-term growth prospects.\n```annotation\n{"type":"artifact","data":{"type":"document","created_at":1749099813536,"data":{"title":"DeepResearch Report","content":"# Research Report: Tesla Inc.\\n\\n## Executive Summary\\n\\nThis report provides a comprehensive overview of Tesla Inc., focusing on its intellectual property management, competitive landscape, sales and marketing strategies, ESG and human capital management, technological differentiation, business segments, and global operations. The analysis is based on recent research and official company disclosures, offering insights into Tesla’s strategies and market positioning as of 2024.\\n\\n---\\n\\n## 1. Intellectual Property Management and Patent Policy\\n\\nTesla emphasizes innovation and proprietary designs, protecting its intellectual property (IP) through patents, trademarks, copyrights, trade secrets, and contractual agreements. The company prioritizes obtaining patents to secure broad and strong protection for its technologies and designs, enabling operational freedom and defending its product portfolio.\\n\\nA notable aspect of Tesla’s IP strategy is its open patent policy: Tesla has pledged not to initiate lawsuits against any party for infringing its patents related to electric vehicles or related equipment, provided the party acts in good faith. This approach aims to foster industry-wide advancement in electric vehicle technology, benefiting both Tesla and the broader market [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\\n\\n---\\n\\n## 2. Competitive Landscape\\n\\n### Automotive Market\\n\\nTesla faces increasing competition from both established automakers and new entrants, particularly in areas such as self-driving technologies, charging solutions, and vehicle features. Tesla’s competitive edge lies in its ongoing development of Autopilot, Full Self-Driving (FSD), neural network capabilities, and its proprietary Supercharger network [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\\n\\n### Energy Market\\n\\nIn energy storage, Tesla competes with companies offering similar or alternative products, focusing on price, energy density, and efficiency. Its modular, scalable energy storage solutions and strong brand recognition provide a competitive advantage.\\n\\nFor solar energy systems, Tesla’s main competitors are traditional utility companies and other solar providers. Tesla competes on price, ease of adoption, and product integration, supported by a favorable regulatory environment for renewables [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\\n\\n---\\n\\n## 3. Sales, Marketing, and Customer Service\\n\\n| Aspect         | Tesla’s Approach                                                                                  |\\n|----------------|--------------------------------------------------------------------------------------------------|\\n| Sales          | Direct-to-consumer via website and company-owned stores; no traditional dealerships.              |\\n| Marketing      | Minimal traditional advertising; focus on brand, customer education, and selective campaigns.     |\\n| Customer Service | Company-owned service centers and mobile technicians; remote diagnostics and over-the-air updates. |\\n\\nTesla’s direct sales model allows for better inventory control, pricing, and customer feedback. The company integrates used vehicle sales and trade-ins into its business. For energy products, Tesla uses its website, stores, and channel partners to reach residential, commercial, and utility customers, emphasizing simplicity and standardization [citation:0e8472e1-de0d-420c-9273-73a927ef30e9][citation:e422d6ca-d57a-4c4a-860e-00f9977997d4].\\n\\n---\\n\\n## 4. Environmental, Social, and Governance (ESG) and Human Capital Management\\n\\nTesla’s ESG strategy centers on accelerating the transition to sustainable energy. The company designs efficient factories, reduces waste and resource consumption, and works to minimize its supply chain’s carbon footprint. Tesla enforces responsible sourcing, prohibits child or forced labor, and continually improves its processes based on international guidelines and stakeholder feedback.\\n\\nGovernance is overseen by an ESG Sustainability Council and the Board of Directors. Tesla invests in its workforce, offering career development programs, internal promotions, stock ownership, and industry-leading benefits. As of December 31, 2023, Tesla employed over 140,000 people globally [citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2][citation:646ba9e3-714f-4c52-9a36-85456823971d].\\n\\n---\\n\\n## 5. Technological Differentiation\\n\\n### Automotive\\n\\n- Proprietary powertrain systems (dual/tri-motor)\\n- In-house battery cell R&D and manufacturing (new lithium-ion cell design)\\n- Advanced vehicle control and infotainment software with over-the-air updates\\n- Vision-based self-driving technology (FSD, neural networks)\\n- AI and robotics (e.g., Optimus humanoid robot)\\n\\n### Energy\\n\\n- Modular battery system design (Powerwall, Megapack)\\n- Proprietary power electronics and software for grid integration\\n- Solar Roof and in-house solar inverter technology\\n- Seamless integration of solar and storage products\\n\\nTesla’s open patent policy and strong brand further reinforce its technological leadership [citation:7a52bb1b-3031-4a79-8c7a-23df587abcf8][citation:0e8472e1-de0d-420c-9273-73a927ef30e9][citation:01870ded-daa0-46fe-bebb-e8fb98a62ac2].\\n\\n---\\n\\n## 6. Business Segments and Product Offerings\\n\\n| Segment         | Key Offerings                                                                                   |\\n|-----------------|------------------------------------------------------------------------------------------------|\\n| Automotive      | Electric vehicles (Model S, 3, X, Y, Cybertruck, Semi), Autopilot/FSD, used vehicles, ride-hailing (future) |\\n| Energy          | Solar panels, Solar Roof, Powerwall, Megapack, solar inverters                                 |\\n| Services/Other  | Supercharger network, home charging, software upgrades, insurance, vehicle servicing           |\\n\\nTesla’s integrated approach allows cross-segment synergies, such as using automotive battery technology in energy storage products [citation:7a52bb1b-3031-4a79-8c7a-23df587abcf8][citation:0e8472e1-de0d-420c-9273-73a927ef30e9][citation:e422d6ca-d57a-4c4a-860e-00f9977997d4].\\n\\n---\\n\\n## 7. Global Operations and Subsidiaries\\n\\nTesla operates through a vast network of subsidiaries worldwide, supporting manufacturing, sales, service, energy, insurance, and financial services. Key operational hubs include:\\n\\n- **United States**: Headquarters, manufacturing, energy, insurance\\n- **Germany**: Manufacturing (Tesla Manufacturing Brandenburg SE)\\n- **China**: Manufacturing, sales, service (Tesla Shanghai Co., Ltd., etc.)\\n- **Mexico**: Manufacturing (Tesla Manufacturing Mexico, S. de R.L. de C.V.)\\n- **Netherlands**: European operations and international holdings\\n- **Australia, Canada, UK, France, Italy, Spain, Japan, Korea, India, and more**: Sales, service, energy, insurance, and financial services\\n\\nTesla’s global footprint enables it to serve diverse markets and scale its operations efficiently [citation:75a34096-b457-418f-8a40-f1c7c7623378][citation:3eaab116-f537-433f-b64f-9c5779ce33b7][citation:e0d8c80c-ae7f-4aaf-bb17-0526f7369358].\\n\\n---\\n\\n## Figures\\n\\n### Figure 1: Tesla’s Business Segments and Key Offerings\\n\\n| Segment         | Offerings                                                                                       |\\n|-----------------|------------------------------------------------------------------------------------------------|\\n| Automotive      | Electric vehicles, Autopilot/FSD, used vehicles, ride-hailing (future)                         |\\n| Energy          | Solar panels, Solar Roof, Powerwall, Megapack, solar inverters                                 |\\n| Services/Other  | Supercharger network, home charging, software upgrades, insurance, vehicle servicing           |\\n\\n### Figure 2: Tesla’s Global Operations (Selected Subsidiaries)\\n\\n| Region          | Key Subsidiaries/Entities                                                                      |\\n|-----------------|------------------------------------------------------------------------------------------------|\\n| USA             | Tesla, Inc., Tesla Energy Operations, Inc., Tesla Insurance                                    |\\n| Germany         | Tesla Manufacturing Brandenburg SE                                                             |\\n| China           | Tesla Shanghai Co., Ltd., Tesla (Shanghai) New Energy Co., Ltd.                               |\\n| Mexico          | Tesla Manufacturing Mexico, S. de R.L. de C.V.                                                |\\n| Netherlands     | Tesla Motors Netherlands B.V., Tesla International B.V.                                        |\\n| Australia       | Tesla Motors Australia, Pty Ltd., Tesla Energy Ventures Australia Pty Ltd.                     |\\n| Other Regions   | Numerous subsidiaries in Canada, UK, France, Italy, Spain, Japan, Korea, India, etc.           |\\n\\n---\\n\\n## Conclusion\\n\\nTesla’s integrated approach to technology, direct sales, and global operations, combined with its commitment to sustainability and innovation, positions it as a leader in both the automotive and energy sectors. The company’s strategies in IP management, ESG, and human capital further reinforce its competitive advantage and long-term growth prospects.","type":"markdown"}}}\n```\n',
      },

      {
        data: {
          nodes: [
            {
              id: '7a52bb1b-3031-4a79-8c7a-23df587abcf8',
              fileName: 'tesla_10k_report.pdf',
              filePath: 'data/tesla_10k_report.pdf',
              url: '/api/files/data/tesla_10k_report.pdf',
              metadata: {
                page_number: 6,
                total_pages: 130,
                file_path:
                  'C:\\Users\\thucpn\\Desktop\\next\\data\\tesla_10k_report.pdf',
                file_name: 'tesla_10k_report.pdf',
              },
              score: 0.5066580164050479,
              text: 'Table of Contents\nSolar Energy Offerings\nWe sell retrofit solar energy systems to customers and channel partners and also make them available through power purchase agreement (“PPA”)\narrangements. We purchase most of the components for our retrofit solar energy systems from multiple sources to ensure competitive pricing and\nadequate supply. We also design and manufacture certain components for our solar energy products.\nWe sell our Solar Roof, which combines premium glass roof tiles with energy generation, directly to customers, as well as through channel\ncustomers. We continue to improve our installation capability and efficiency, including through collaboration with real estate developers and builders on\nnew homes.\nTechnology\nAutomotive\nBattery and Powertrain\nOur core vehicle technology competencies include powertrain engineering and manufacturing and our ability to design vehicles that utilize the\nunique advantages of an electric powertrain. We have designed our proprietary powertrain systems to be adaptable, efficient, reliable and cost-effective\nwhile withstanding the rigors of an automotive environment. We offer dual motor powertrain vehicles, which use two electric motors to maximize traction\nand performance in an all-wheel drive configuration, as well as vehicle powertrain technology featuring three electric motors for further increased\nperformance in certain versions of Model S and Model X, Cybertruck and the Tesla Semi.\nWe maintain extensive testing and R&D capabilities for battery cells, packs and systems, and have built an expansive body of knowledge on lithium-\nion cell chemistry types and performance characteristics. In order to enable a greater supply of cells for our products with higher energy density at lower\ncosts, we have developed a new proprietary lithium-ion battery cell and improved manufacturing processes.\nVehicle Control and Infotainment Software\nThe performance and safety systems of our vehicles and their battery packs utilize sophisticated control software. Control systems in our vehicles\noptimize performance, customize vehicle behavior, manage charging and control all infotainment functions. We develop almost all of this software,\nincluding most of the user interfaces, internally and update our vehicles’ software regularly through over-the-air updates.\nSelf-Driving Development and Artificial Intelligence\nWe have expertise in developing technologies, systems and software to enable self-driving vehicles using primarily vision-based technologies. Our\nFSD Computer runs our neural networks in our vehicles, and we are also developing additional computer hardware to better enable the massive amounts\nof field data captured by our vehicles to continually train and improve these neural networks for real-world performance.\nCurrently, we offer in our vehicles certain advanced driver assist systems under our Autopilot and FSD Capability options. Although at present the\ndriver is ultimately responsible for controlling the vehicle, our systems provide safety and convenience functionality that relieves drivers of the most\ntedious and potentially dangerous aspects of road travel much like the system that airplane pilots use, when conditions permit. As with other vehicle\nsystems, we improve these functions in our vehicles over time through over-the-air updates.\nWe intend to establish in the future an autonomous Tesla ride-hailing network, which we expect would also allow us to access a new customer base\neven as modes of transportation evolve.\nWe are also applying our artificial intelligence learnings from self-driving technology to the field of robotics, such as through Optimus, a robotic\nhumanoid in development, which is controlled by the same AI system.\n5',
            },
            {
              id: '0e8472e1-de0d-420c-9273-73a927ef30e9',
              fileName: 'tesla_10k_report.pdf',
              filePath: 'data/tesla_10k_report.pdf',
              url: '/api/files/data/tesla_10k_report.pdf',
              metadata: {
                page_number: 7,
                total_pages: 130,
                file_path:
                  'C:\\Users\\thucpn\\Desktop\\next\\data\\tesla_10k_report.pdf',
                file_name: 'tesla_10k_report.pdf',
              },
              score: 0.4950719408246191,
              text: 'Table of Contents\nEnergy Generation and Storage\nEnergy Storage Products\nWe leverage many of the component-level technologies from our vehicles in our energy storage products. By taking a modular approach to the\ndesign of battery systems, we can optimize manufacturing capacity of our energy storage products. Additionally, our expertise in power electronics\nenables our battery systems to interconnect with electricity grids while providing fast-acting systems for power injection and absorption. We have also\ndeveloped software to remotely control and dispatch our energy storage systems.\nSolar Energy Systems\nWe have engineered Solar Roof over numerous iterations to combine aesthetic appeal and durability with power generation. The efficiency of our\nsolar energy products is aided by our own solar inverter, which incorporates our power electronics technologies. We designed both products to integrate\nwith Powerwall.\nDesign and Engineering\nAutomotive\nWe have established significant in-house capabilities in the design and test engineering of electric vehicles and their components and systems. Our\nteam has significant experience in computer-aided design as well as durability, strength and crash test simulations, which reduces the product\ndevelopment time of new models. We have also achieved complex engineering feats in stamping, casting and thermal systems, and developed a method\nto integrate batteries directly with vehicle body structures without separate battery packs to optimize manufacturability, weight, range and cost\ncharacteristics.\nWe are also expanding our manufacturing operations globally while taking action to localize our vehicle designs and production for particular\nmarkets, including country-specific market demands and factory optimizations for local workforces. As we increase our capabilities, particularly in the\nareas of automation, die-making and line-building, we are also making strides in the simulations modeling these capabilities prior to construction.\nEnergy Generation and Storage\nOur expertise in electrical, mechanical, civil and software engineering allows us to design, engineer, manufacture and install energy generating and\nstorage products and components, including at the residential through utility scale. For example, the modular design of our Megapack utility-scale battery\nline is intended to significantly reduce the amount of assembly required in the field. We also customize solutions including our energy storage products,\nsolar energy systems and/or Solar Roof for customers to meet their specific needs.\nSales and Marketing\nHistorically, we have been able to achieve sales without traditional advertising and at relatively low marketing costs. We continue to monitor our\npublic narrative and brand, and tailor our marketing efforts accordingly, including through investments in customer education and advertising as\nnecessary.\nAutomotive\nDirect Sales\nOur vehicle sales channels currently include our website and an international network of company-owned stores. In some jurisdictions, we also have\ngalleries to educate and inform customers about our products, but such locations do not transact in the sale of vehicles. We believe this infrastructure\nenables us to better control costs of inventory, manage warranty service and pricing, educate consumers about electric vehicles, make our vehicles more\naffordable, maintain and strengthen the Tesla brand and obtain rapid customer feedback.\nWe reevaluate our sales strategy both globally and at a location-by-location level from time to time to optimize our sales channels. However, sales\nof vehicles in the automobile industry tend to be cyclical in many markets, which may expose us to volatility from time to time.\n6',
            },
            {
              id: '646ba9e3-714f-4c52-9a36-85456823971d',
              fileName: 'tesla_10k_report.pdf',
              filePath: 'data/tesla_10k_report.pdf',
              url: '/api/files/data/tesla_10k_report.pdf',
              metadata: {
                page_number: 14,
                total_pages: 130,
                file_path:
                  'C:\\Users\\thucpn\\Desktop\\next\\data\\tesla_10k_report.pdf',
                file_name: 'tesla_10k_report.pdf',
              },
              score: 0.4924140266177858,
              text: "Table of Contents\nWe believe that sound corporate governance is critical to helping us achieve our goals, including with respect to ESG. We continue to evolve a\ngovernance framework that exercises appropriate oversight of responsibilities at all levels throughout the company and manages its affairs consistent\nwith high principles of business ethics. Our ESG Sustainability Council is made up of leaders from across our company, and regularly presents to our Board\nof Directors, which oversees our ESG impacts, initiatives and priorities.\nHuman Capital Resources\nA competitive edge for Tesla is its ability to attract and retain high quality employees. During the past year, Tesla made substantial investments in\nits workforce, further strengthening its standing as one of the most desirable and innovative companies to work for. As of December 31, 2023, our\nemployee headcount worldwide was 140,473.\nWe have created an environment that fosters growth opportunities, and as of this report, nearly two-thirds (65%) of our managers were promoted\nfrom an internal, non-manager position, and 43% of our management employees have been with Tesla for more than five years. Tesla’s growth of 35%\nover the past two years has offered internal career development to our employees as well as the ability to make a meaningful contribution to a\nsustainable future.\nWe are able to retain our employees, in part, not only because employees can enjoy ownership in Tesla through stock (of which 89% have been\ngiven the opportunity to), but because we also provide them with excellent health benefits such as free counseling, paid parental leave, paid time off and\nzero-premium medical plan options that are made available on the first day of employment.\nWe recognize the positive impact that leaders can have on their teams and offer fundamental skills training and continuous development to all\nleaders through various programs globally.\nWe don’t stop there. Tesla has several other programs strategically designed to increase paths for greater career opportunity such as:\n• Technician Trainee (Service) – The Tesla Technician Trainee Program provides on-the-job automotive maintenance training at Tesla,\nresulting in an industry certification. Targeted at individuals with limited experience, whether in industry or vocational schools, the program\nprepares trainees for employment as technicians. In 2023, we hired over 1,900 Technician Trainees across the U.S., Germany and China.\n• START (Manufacturing and Service) – Tesla START is an intensive training program that complements the Technician Trainee program and\nequips individuals with the skills needed for a successful technician role at Tesla. We have partnered with colleges and technical academies to\nlaunch Tesla START in the U.S., United Kingdom and Germany. In 2023, we hired over 350 trainees for manufacturing and service roles through\nthis program, providing an opportunity to transition into full-time employment.\n• Internships – Annually, Tesla hires over 6,000 university and college students from around the world. We recruit from diverse student\norganizations and campuses, seeking top talent passionate about our mission. Our interns engage in meaningful work from day one, and we\noften offer them full-time positions post-internship.\n• Military Fellowship and Transition Programs – The Military Fellowship and Transition Programs are designed to offer exiting military service\nmembers in the U.S. and Europe with career guidance on transitioning into the civil workforce. We partner with the career transition services of\nEuropean Defence Ministries across five countries, as well as the U.S. Chamber of Commerce’s Hire our Heroes. These programs aim to convert\nhigh-performing individuals to full-time roles and create a veteran talent pipeline.\n• Apprenticeships – Tesla Apprenticeships are offered globally, providing academic and on-the-job training to prepare specialists in skilled\ntrades. Apprentices will complete between one to four years of on-the-job training. Apprentice programs have seen skilled trade hires across the\nU.S., Australia, Hong Kong, Korea and Germany.\n• Manufacturing Development Program – Tesla's manufacturing pathway program is designed to provide graduating high school seniors with\nthe financial resources, coursework and experience they need to start a successful manufacturing career at Tesla. We hired 373 graduates\nthrough this program in 2023, and our goal in 2024 is grow this program to over 600 students annually across our Fremont Factory, Gigafactory\nNevada, Gigafactory Texas and Gigafactory New York.\n13",
            },
            {
              id: '01870ded-daa0-46fe-bebb-e8fb98a62ac2',
              fileName: 'tesla_10k_report.pdf',
              filePath: 'data/tesla_10k_report.pdf',
              url: '/api/files/data/tesla_10k_report.pdf',
              metadata: {
                page_number: 13,
                total_pages: 130,
                file_path:
                  'C:\\Users\\thucpn\\Desktop\\next\\data\\tesla_10k_report.pdf',
                file_name: 'tesla_10k_report.pdf',
              },
              score: 0.490769878675436,
              text: "Table of Contents\nWe believe that there is also increasing competition for our vehicle offerings as a platform for delivering self-driving technologies, charging solutions\nand other features and services, and we expect to compete in this developing market through continued progress on our Autopilot, FSD and neural\nnetwork capabilities, Supercharger network and our infotainment offerings.\nEnergy Generation and Storage\nEnergy Storage Systems\nThe market for energy storage products is also highly competitive, and both established and emerging companies have introduced products that are\nsimilar to our product portfolio or that are alternatives to the elements of our systems. We compete with these companies based on price, energy density\nand efficiency. We believe that the specifications and features of our products, our strong brand and the modular, scalable nature of our energy storage\nproducts give us a competitive advantage in our markets.\nSolar Energy Systems\nThe primary competitors to our solar energy business are the traditional local utility companies that supply energy to our potential customers. We\ncompete with these traditional utility companies primarily based on price and the ease by which customers can switch to electricity generated by our\nsolar energy systems. We also compete with solar energy companies that provide products and services similar to ours. Many solar energy companies\nonly install solar energy systems, while others only provide financing for these installations. We believe we have a significant expansion opportunity with\nour offerings and that the regulatory environment is increasingly conducive to the adoption of renewable energy systems.\nIntellectual Property\nWe place a strong emphasis on our innovative approach and proprietary designs which bring intrinsic value and uniqueness to our product portfolio.\nAs part of our business, we seek to protect the underlying intellectual property rights of these innovations and designs such as with respect to patents,\ntrademarks, copyrights, trade secrets, confidential information and other measures, including through employee and third-party nondisclosure\nagreements and other contractual arrangements. For example, we place a high priority on obtaining patents to provide the broadest and strongest\npossible protection to enable our freedom to operate our innovations and designs across all of our products and technologies as well as to protect and\ndefend our product portfolio. We have also adopted a patent policy in which we irrevocably pledged that we will not initiate a lawsuit against any party for\ninfringing our patents through activity relating to electric vehicles or related equipment for so long as such party is acting in good faith. We made this\npledge in order to encourage the advancement of a common, rapidly-evolving platform for electric vehicles, thereby benefiting ourselves, other\ncompanies making electric vehicles and the world.\nEnvironmental, Social and Governance (ESG) and Human Capital Resources\nESG\nThe very purpose of Tesla's existence is to accelerate the world's transition to sustainable energy. We believe the world cannot reduce carbon\nemissions without addressing both energy generation and consumption, and we are designing and manufacturing a complete energy and transportation\necosystem to achieve this goal. As we expand, we are building each new factory to be more efficient and sustainably designed than the previous one,\nincluding with respect to per-unit waste reduction and resource consumption, including water and energy usage. We are focused on further enhancing\nsustainability of operations outside of our direct control, including reducing the carbon footprint of our supply chain.\nWe are committed to sourcing only responsibly produced materials, and our suppliers are required to provide evidence of management systems that\nensure social, environmental and sustainability best practices in their own operations, as well as to demonstrate a commitment to responsible sourcing\ninto their supply chains. We have a zero-tolerance policy when it comes to child or forced labor and human trafficking by our suppliers and we look to the\nOrganization for Economic Co-operation and Development Due Diligence Guidelines to inform our process and use feedback from our internal and\nexternal stakeholders to find ways to continually improve. We are also driving safety in our own factories by focusing on worker engagement. Our\nincidents per vehicle continue to drop even as our production volumes increase. We also strive to be an employer of choice by offering compelling,\nimpactful jobs with best in-industry benefits.\n12",
            },
            {
              id: 'e422d6ca-d57a-4c4a-860e-00f9977997d4',
              fileName: 'tesla_10k_report.pdf',
              filePath: 'data/tesla_10k_report.pdf',
              url: '/api/files/data/tesla_10k_report.pdf',
              metadata: {
                page_number: 8,
                total_pages: 130,
                file_path:
                  'C:\\Users\\thucpn\\Desktop\\next\\data\\tesla_10k_report.pdf',
                file_name: 'tesla_10k_report.pdf',
              },
              score: 0.4836756469547931,
              text: 'Table of Contents\nUsed Vehicle Sales\nOur used vehicle business supports new vehicle sales by integrating the trade-in of a customer’s existing Tesla or non-Tesla vehicle with the sale of\na new or used Tesla vehicle. The Tesla and non-Tesla vehicles we acquire as trade-ins are subsequently remarketed, either directly by us or through third\nparties. We also remarket used Tesla vehicles acquired from other sources including lease returns.\nPublic Charging\nWe have a growing global network of Tesla Superchargers, which are our industrial-grade, high-speed vehicle chargers. Where possible, we co-\nlocate Superchargers with our solar and energy storage systems to reduce costs and promote renewable power. Supercharger stations are typically\nplaced along well-traveled routes and in and around dense city centers to allow vehicle owners the ability to enjoy quick, reliable charging along an\nextensive network with convenient stops. Use of the Supercharger network either requires payment of a fee or is free under certain sales programs. In\nNovember 2021, we began to offer Supercharger access to non-Tesla vehicles in certain locations in support of our mission to accelerate the world’s\ntransition to sustainable energy, and in November 2022, we opened up our previously proprietary charging connector as the North American Charging\nStandard (NACS). This enables all electric vehicles and charging stations to interoperate — which makes charging easier and more efficient for everyone\nand advances our mission to accelerate the world’s transition to sustainable energy. Following this, a number of major automotive companies announced\ntheir adoption of NACS, with their access to the Supercharger network beginning in phases in 2024 and their production of NACS vehicles beginning no\nlater than 2025. We also engaged SAE International to govern NACS as an industry standard, now named J3400. We continue to monitor and increase our\nnetwork of Tesla Superchargers in anticipation of future demand.\nWe also work with a wide variety of hospitality, retail and public destinations, as well as businesses with commuting employees, to offer additional\ncharging options for our customers, as well as single-family homeowners and multi-family residential entities, to deploy home charging solutions.\nIn-App Upgrades\nAs our vehicles are capable of being updated remotely over-the-air, our customers may purchase additional paid options and features through the\nTesla app or through the in-vehicle user interface. We expect that this functionality will also allow us to offer certain options and features on a\nsubscription basis in the future.\nEnergy Generation and Storage\nWe market and sell our solar and energy storage products to residential, commercial and industrial customers and utilities through a variety of\nchannels, including through our website, stores and galleries, as well as through our network of channel partners, and in the case of some commercial\ncustomers, through PPA transactions. We emphasize simplicity, standardization and accessibility to make it easy and cost-effective for customers to adopt\nclean energy, while reducing our customer acquisition costs.\nService and Warranty\nAutomotive\nService\nWe provide service for our electric vehicles at our company-owned service locations and through Tesla Mobile Service technicians who perform work\nremotely at customers’ homes or other locations. Servicing the vehicles ourselves allows us to identify problems and implement solutions and\nimprovements faster than traditional automobile manufacturers and their dealer networks. The connectivity of our vehicles also allows us to diagnose and\nremedy many problems remotely and proactively.\nVehicle Limited Warranties and Extended Service Plans\nWe provide a manufacturer’s limited warranty on all new and used Tesla vehicles we sell directly to consumers, which may include limited\nwarranties on certain components, specific types of damage or battery capacity retention. We also currently offer optional extended service plans that\nprovide coverage beyond the new vehicle limited warranties for certain models in specified regions.\n7',
            },
            {
              id: '3eaab116-f537-433f-b64f-9c5779ce33b7',
              fileName: 'tesla_10k_report.pdf',
              filePath: 'data/tesla_10k_report.pdf',
              url: '/api/files/data/tesla_10k_report.pdf',
              metadata: {
                page_number: 122,
                total_pages: 130,
                file_path:
                  'C:\\Users\\thucpn\\Desktop\\next\\data\\tesla_10k_report.pdf',
                file_name: 'tesla_10k_report.pdf',
              },
              score: 0.4808757594094449,
              text: 'Tesla Motors NL LLC Delaware\nTesla Motors NV, Inc. Nevada\nTesla Motors PA, Inc. Pennsylvania\nTesla Motors Romania S.R.L. Romania\nTesla Motors Sales and Service LLC Turkey\nTesla Motors Singapore Holdings Pte. Ltd. Singapore\nTesla Motors Singapore Private Limited Singapore\nTesla Motors Stichting Netherlands\nTesla Motors Taiwan Limited Taiwan\nTesla Motors TN, Inc. Tennessee\nTesla Motors TX, Inc. Texas\nTesla Motors UT, Inc. Utah\nTesla Nambe LLC Delaware\nTesla New Zealand ULC New Zealand\nTesla Norway AS Norway\nTesla Poland sp. z o.o. Poland\nTesla Property &Casualty, Inc. California\nTesla Portugal, Sociedade Unipessoal LDA Portugal\nTesla Puerto Rico LLC Puerto Rico\nTesla Qatar LLC Qatar\nTesla Sales, Inc. Delaware\nTesla Sdn. Bhd. Malaysia\nTesla Shanghai Co., Ltd China\nTesla (Shanghai) New Energy Co., LTD. China\nTesla Spain, S.L. Unipersonal Spain\nTesla Switzerland GmbH Switzerland\nTesla (Thailand) Ltd. Thailand\nTesla TH1 LLC Delaware\nTesla TH2 LLC Delaware\nTelsa Toronto Automation ULC Canada\nTesla Toronto International Holdings ULC Canada\nTesla Transport B.V. Netherlands\nThe Big Green Solar I, LLC Delaware\nThe Big Green Solar Manager I, LLC Delaware\nThree Rivers Solar 1, LLC Delaware\nThree Rivers Solar 2, LLC Delaware\nThree Rivers Solar 3, LLC Delaware\nThree Rivers Solar Manager 1, LLC Delaware\nThree Rivers Solar Manager 2, LLC Delaware\nThree Rivers Solar Manager 3, LLC Delaware\nTM International C.V. Netherlands\nTM Sweden AB Sweden\nUSB SolarCity Manager IV, LLC Delaware\nUSB SolarCity Master Tenant IV, LLC California\nUSB SolarCity Owner IV, LLC California\nVisigoth Solar 1, LLC Delaware\nVisigoth Solar Holdings, LLC Delaware\nVisigoth Solar Managing Member 1, LLC Delaware\nVPP Project 1 (SA) Pty Ltd. Australia\nWeisshorn Solar I, LLC Cayman Islands',
            },
            {
              id: '75a34096-b457-418f-8a40-f1c7c7623378',
              fileName: 'tesla_10k_report.pdf',
              filePath: 'data/tesla_10k_report.pdf',
              url: '/api/files/data/tesla_10k_report.pdf',
              metadata: {
                page_number: 121,
                total_pages: 130,
                file_path:
                  'C:\\Users\\thucpn\\Desktop\\next\\data\\tesla_10k_report.pdf',
                file_name: 'tesla_10k_report.pdf',
              },
              score: 0.4781932849641214,
              text: 'Tesla Energy Ventures Holdings B.V. Netherlands\nTesla Finance LLC Delaware\nTesla Financial Leasing (China) Co., Ltd. China\nTesla Financial Services GmbH Germany\nTesla Financial Services Holdings B.V. Netherlands\nTesla Financial Services Limited United Kingdom\nTesla France S.à r.l. France\nTesla Germany GmbH Germany\nTesla General Insurance, Inc. Arizona\nTesla Greece Single Member P.C. Greece\nTesla Hrvatska d.o.o. Croatia\nTesla Hungary Kft. Hungary\nTesla India Motors and Energy Private Limited India\nTesla Insurance Brokers Co., Ltd. China\nTesla Insurance Holdings, LLC Delaware\nTesla Insurance, Inc. Delaware\nTesla Insurance Ltd. Malta\nTesla Insurance Company California\nTesla Insurance Services, Inc. California\nTesla Insurance Services of Texas, Inc. Texas\nTesla International B.V. Netherlands\nTesla Investments LLC Delaware\nTesla Italy S.r.l. Italy\nTesla Jordan Car Trading LLC Jordan\nTesla Korea Limited Republic of Korea\nTesla Lease Trust Delaware\nTesla LLC Delaware\nTesla Manufacturing Brandenburg SE Germany\nTesla Manufacturing Mexico, S. de R.L. de C.V. Mexico\nTesla Manufacturing Mexico Holding, S. de R.L. de C.V. Mexico\nTesla Michigan, Inc. Michigan\nTesla Mississippi LLC Delaware\nTesla Motors Australia, Pty Ltd Australia\nTesla Motors Austria GmbH Austria\nTesla Motors (Beijing) Co., Ltd. China\nTesla Motors Canada ULC Canada\nTesla Motors Colombia S.A.S Colombia\nTesla Motors Holding B.V. Netherlands\nTesla Motors Denmark ApS Denmark\nTesla Motors FL, Inc. Florida\nTesla Motors HK Limited Hong Kong\nTesla Motors Iceland ehf. Iceland\nTesla Motors Ireland Limited Ireland\nTesla Motors Israel Ltd. Israel\nTesla Motors Japan GK Japan\nTesla Motors Limited United Kingdom\nTesla Motors Luxembourg S.à r.l. Luxembourg\nTesla Motors MA, Inc. Massachusetts\nTesla Motors Netherlands B.V. Netherlands\nTesla Motors New York LLC New York',
            },
            {
              id: 'e0d8c80c-ae7f-4aaf-bb17-0526f7369358',
              fileName: 'tesla_10k_report.pdf',
              filePath: 'data/tesla_10k_report.pdf',
              url: '/api/files/data/tesla_10k_report.pdf',
              metadata: {
                page_number: 120,
                total_pages: 130,
                file_path:
                  'C:\\Users\\thucpn\\Desktop\\next\\data\\tesla_10k_report.pdf',
                file_name: 'tesla_10k_report.pdf',
              },
              score: 0.47732510261794653,
              text: "Tesla Automobile Sales and Service (Chengdu) Co., Ltd. China\nTesla Automobile Sales and Service (Chongqing) Co., Ltd. China\nTesla Automobile Sales and Service (Dalian) Co., Ltd. China\nTesla Automobile Sales and Service (Fuzhou) Co., Ltd. China\nTesla Automobile Sales and Service (Guangzhou) Co., Ltd. China\nTesla Automobile Sales and Service (Guiyang) Co., Ltd. China\nTesla Automobile Sales and Service (Haerbin) Co., Ltd. China\nTesla Automobile Sales and Service (Hangzhou) Co., Ltd. China\nTesla Automobile Sales and Service (Hefei) Co., Ltd. China\nTesla Automobile Sales and Service (Hohhot) Co., Ltd. China\nTesla Automobile Sales and Service (Jinan) Co., Ltd. China\nTesla Automobile Sales and Service (Kunming) Co., Ltd. China\nTesla Automobile Sales and Service (Lanzhou) Co., Ltd. China\nTesla Automobile Sales and Service (Nanchang) Co., Ltd. China\nTesla Automobile Sales and Service (Nanjing) Co., Ltd. China\nTesla Automobile Sales and Service (Nanning) Co., Ltd. China\nTesla Automobile Sales and Service (Ningbo) Co., Ltd. China\nTesla Automobile Sales and Service (Qingdao) Co., Ltd. China\nTesla Automobile Sales and Service (Shanghai) Co., Ltd. China\nTesla Automobile Sales and Service (Shenyang) Co., Ltd. China\nTesla Automobile Sales and Service (Shijiazhuang) Co., Ltd. China\nTesla Automobile Sales and Service (Suzhou) Co. Ltd. China\nTesla Automobile Sales and Service (Taiyuan) Co., Ltd. China\nTesla Automobile Sales and Service (Tianjin) Co. Ltd. China\nTesla Automobile Sales and Service (Urumqi) Co. Ltd. China\nTesla Automobile Sales and Service (Wenzhou) Co., Ltd. China\nTesla Automobile Sales and Service (Wuhan) Co., Ltd. China\nTesla Automobile Sales and Service (Wuxi) Co., Ltd. China\nTesla Automobile Sales and Service (Xi'an) Co., Ltd. China\nTesla Automobile Sales and Service (Xiamen) Co., Ltd. China\nTesla Automobile Sales and Service (Xining) Co., Ltd. China\nTesla Automobile Sales and Service (Yinchuan) Co., Ltd. China\nTesla Automobile Sales and Service (Zhengzhou) Co. Ltd. China\nTesla Automobiles Sales and Service Mexico, S. de R.L. de C.V. Mexico\nTesla (Beijing) New Energy R&D Co., Ltd. China\nTesla Belgium BV Belgium\nTesla Canada Finance ULC Canada\nTesla Canada GP Inc. Canada\nTesla Canada LP Canada\nTesla Charging, LLC Delaware\nTesla Chile SpA Chile\nTesla Construction (Shanghai) Co., Ltd. China\nTesla Czech Republic s.r.o. Czech Republic\nTesla Energia Macau Limitada Macau\nTesla Engineering Germany GmbH Germany\nTesla Energy d.o.o. Slovenia\nTesla Energy Management LLC Delaware\nTesla Energy Operations, Inc. Delaware\nTesla Energy Ventures Australia Pty Ltd Australia\nTesla Energy Ventures Limited United Kingdom",
            },
            {
              id: '65617dc0-477e-42a1-962e-4a0b2b494210',
              fileName: 'tesla_10k_report.pdf',
              filePath: 'data/tesla_10k_report.pdf',
              url: '/api/files/data/tesla_10k_report.pdf',
              metadata: {
                page_number: 21,
                total_pages: 130,
                file_path:
                  'C:\\Users\\thucpn\\Desktop\\next\\data\\tesla_10k_report.pdf',
                file_name: 'tesla_10k_report.pdf',
              },
              score: 0.46551098447577827,
              text: 'Employees may leave Tesla or choose other employers over Tesla due to various factors, such as a very competitive labor market for talented\nindividuals with automotive or technology experience, or any negative publicity related to us.In regions where we have or will have operations,\nparticularly significant engineering and manufacturing centers, there is strong competition for individuals with skillsets needed for our business, including\nspecialized knowledge of electric vehicles, engineering and electrical and building construction expertise.We also compete with both mature and\nprosperous companies that have far greater financial resources than we do and start-ups and emerging companies that promise short-term growth\nopportunities.Finally, our compensation philosophy for all of our personnel reflects our startup origins, with an emphasis on equity-based awards and benefits in\norder to closely align their incentives with the long-term interests of our stockholders.We periodically seek and obtain approval from our stockholders for\nfuture increases to the number of awards available under our equity incentive and employee stock purchase plans.If we are unable to obtain the requisite\nstockholder approvals for such future increases, we may have to expend additional cash to compensate our employees and our ability to retain and hire\nqualified personnel may be harmed.20',
            },
            {
              id: '3d82e339-52b5-4e7b-a9c2-88771f3ed833',
              fileName: 'tesla_10k_report.pdf',
              filePath: 'data/tesla_10k_report.pdf',
              url: '/api/files/data/tesla_10k_report.pdf',
              metadata: {
                page_number: 111,
                total_pages: 130,
                file_path:
                  'C:\\Users\\thucpn\\Desktop\\next\\data\\tesla_10k_report.pdf',
                file_name: 'tesla_10k_report.pdf',
              },
              score: 0.46540140504034644,
              text: 'Exhibit\nNumber\nIncorporated by Reference Filed\nHerewithExhibit Description Form File No. Exhibit Filing Date\n10.52 Seventh Amendment to Amended and Restated\nAgreement For Research & Development Alliance\non Triex Module Technology, effective as of\nOctober 9, 2015, by and between The Research\nFoundation For The State University of New York,\non behalf of the College of Nanoscale Science and\nEngineering of the State University of New York,\nand Silevo, LLC.\n10-Q(1) 001-35758 10.16g October 30, 2015\n10.53 Eighth Amendment to Amended and Restated\nAgreement For Research & Development Alliance\non Triex Module Technology, effective as of\nOctober 26, 2015, by and between The Research\nFoundation For The State University of New York,\non behalf of the College of Nanoscale Science and\nEngineering of the State University of New York,\nand Silevo, LLC.\n10-Q(1) 001-35758 10.16h October 30, 2015\n10.54 Ninth Amendment to Amended and Restated\nAgreement For Research & Development Alliance\non Triex Module Technology, effective as of\nDecember 9, 2015, by and between The Research\nFoundation For The State University of New York,\non behalf of the College of Nanoscale Science and\nEngineering of the State University of New York,\nand Silevo, LLC.\n10-K(1) 001-35758 10.16i February 10, 2016\n10.55 Tenth Amendment to Amended and Restated\nAgreement For Research & Development Alliance\non Triex Module Technology, effective as of March\n31, 2017, by and between The Research\nFoundation For The State University of New York,\non behalf of the Colleges of Nanoscale Science\nand Engineering of the State University of New\nYork, and Silevo, LLC.\n10-Q 001-34756 10.8 May 10, 2017\n10.56 Eleventh Amendment to Amended and Restated\nAgreement for Research & Development Alliance\non Triex Module Technology, effective as of July\n22, 2020, among the Research Foundation for the\nState University of New York, Silevo, LLC and\nTesla Energy Operations, Inc.\n10-Q 001-34756 10.6 July 28, 2020\n10.57 Twelfth Amendment to Amended and Restated\nAgreement for Research & Development Alliance\non Triex Module Technology, effective as of May\n1, 2021, among the Research Foundation for the\nState University of New York, Silevo, LLC and\nTesla Energy Operations, Inc.\n10-Q 001-34756 10.1 October 25, 2021\n109',
            },
          ],
        },
        type: 'data-sources',
      },
      {
        type: 'data-suggested_questions',
        data: [
          'What are the major challenges and risks Tesla is currently facing in its business operations?',
          "How has Tesla's financial performance evolved over the past few years, and what are its key financial metrics?",
          "What are Tesla's future plans and upcoming projects in both the automotive and energy sectors?",
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
  const handler = useChat({ messages: initialMessages })

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
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                copyToClipboard(code)
              }}
              className={`flex h-10 items-center gap-2 rounded-lg bg-zinc-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-600 ${
                isCopied ? 'bg-green-600 hover:bg-green-500' : ''
              }`}
            >
              {isCopied ? 'Copied!' : 'Copy Code'}
            </button>
            <Link href="/demo/canvas/custom">
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              >
                Custom Viewer <ArrowRightIcon className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/demo/canvas/code-preview">
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-500"
              >
                Code Preview <Code className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
        <ChatMessages />
        <ChatInput />
      </div>
      <ChatCanvas className="w-full md:w-2/3" />
    </ChatSection>
  )
}
