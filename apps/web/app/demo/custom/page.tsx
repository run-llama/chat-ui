'use client'

import { Code } from '@/components/code'
import {
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection,
  useChatUI,
  useFile,
} from '@llamaindex/chat-ui'
import { Message, useChat } from 'ai/react'
import { motion, AnimatePresence } from 'framer-motion'

const code = `
import {
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection,
  useChatUI,
  useFile,
} from '@llamaindex/chat-ui'
import { useChat } from 'ai/react'
import { motion, AnimatePresence } from 'framer-motion'

export function CustomChat() {
  const handler = useChat()
  const { imageUrl, getAnnotations, uploadFile, reset } = useFile({
    uploadAPI: '/chat/upload',
  })
  const annotations = getAnnotations()
  const handleUpload = async (file: File) => {
    try {
      await uploadFile(file)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <ChatSection
      handler={handler}
      className="mx-auto h-screen max-w-3xl overflow-hidden"
    >
      <CustomChatMessages />
      <ChatInput annotations={annotations} resetUploadedFiles={reset}>
        <div>
          {imageUrl ? (
            <img
              className="max-h-[100px] object-contain"
              src={imageUrl}
              alt="uploaded"
            />
          ) : null}
        </div>
        <ChatInput.Form>
          <ChatInput.Field />
          <ChatInput.Upload
            allowedExtensions={['jpg', 'png', 'jpeg']}
            onUpload={handleUpload}
          />
          <ChatInput.Submit />
        </ChatInput.Form>
      </ChatInput>
    </ChatSection>
  )
}

function CustomChatMessages() {
  const { messages, isLoading, append } = useChatUI()
  return (
    <ChatMessages>
      <ChatMessages.List className="px-0 md:px-16">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ChatMessage
                message={message}
                isLast={index === messages.length - 1}
                className="items-start"
              >
                <ChatMessage.Avatar>
                  <img
                    className="border-1 rounded-full border-[#e711dd]"
                    alt="LlamaIndex"
                    src="/llama.png"
                  />
                </ChatMessage.Avatar>
                <ChatMessage.Content isLoading={isLoading} append={append}>
                  <ChatMessage.Content.Image />
                  <ChatMessage.Content.Markdown />
                  <ChatMessage.Content.DocumentFile />
                </ChatMessage.Content>
                <ChatMessage.Actions />
              </ChatMessage>
            </motion.div>
          ))}
        </AnimatePresence>
      </ChatMessages.List>
    </ChatMessages>
  )
}
`

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Generate a logo for LlamaIndex',
    role: 'user',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'Got it! Here is the logo for LlamaIndex. The logo features a friendly llama mascot that represents our AI-powered document indexing and chat capabilities.',
    annotations: [
      {
        type: 'image',
        data: {
          url: '/llama.png',
        },
      },
    ],
  },
  {
    id: '3',
    role: 'user',
    content: 'Show me a pdf file',
  },
  {
    id: '4',
    role: 'assistant',
    content:
      'Got it! Here is a sample PDF file that demonstrates PDF handling capabilities. This PDF contains some basic text and formatting examples that you can use to test PDF viewing functionality.',
    annotations: [
      {
        type: 'document_file',
        data: {
          files: [
            {
              id: '1',
              name: 'sample.pdf',
              url: 'https://pdfobject.com/pdf/sample.pdf',
            },
          ],
        },
      },
    ],
  },
  {
    role: 'user',
    content: 'The product costs $10 and the discount is $5',
    id: 'DQXPGjYiCEK1MlXg',
  },
  {
    id: '0wR35AGp8GEDoHZu',
    role: 'assistant',
    content:
      'If the product costs $10 and there is a discount of $5, you can calculate the final price by subtracting the discount from the original price:\n\nFinal Price = Original Price - Discount  \nFinal Price = $10 - $5  \nFinal Price = $5\n\nSo, after applying the discount, the product will cost $5.',
  },

  {
    role: 'user',
    content:
      'Write js code that accept a location and console log Hello from location',
    id: '2VH8xx07DxwibdFX',
  },
  {
    id: 'Jb1Xs8w8p2RBTdUQ',
    role: 'assistant',
    content:
      'You can create a simple JavaScript function that accepts a location as an argument and logs a message to the console. Here\'s an example of how you can do this:\n\n```javascript\nfunction greetFromLocation(location) {\n    console.log(`Hello from ${location}`);\n}\n\n// Example usage:\ngreetFromLocation("New York");\ngreetFromLocation("Tokyo");\ngreetFromLocation("Paris");\n```\n\nIn this code:\n\n- The `greetFromLocation` function takes one parameter, `location`.\n- It uses template literals (the backticks ``) to create a string that includes the location.\n- The `console.log` function is used to print the message to the console.\n\nYou can call the function with different locations to see the output.',
  },
  {
    role: 'user',
    content: 'Formula to caculate triangle',
    id: 'G7MEUgkjwqq0RDLk',
  },
  {
    id: 'aonMZaAcoUglAjka',
    role: 'assistant',
    content:
      "To calculate various properties of a triangle, you can use different formulas depending on what you want to find. Here are some common calculations:\n\n1. **Area of a Triangle**:\n   - Using base and height: \n     \\[\n     \\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height}\n     \\]\n   - Using Heron's formula (when you know all three sides \\(a\\), \\(b\\), and \\(c\\)):\n     \\[\n     s = \\frac{a + b + c}{2} \\quad \\text{(semi-perimeter)}\n     \\]\n     \\[\n     \\text{Area} = \\sqrt{s(s-a)(s-b)(s-c)}\n     \\]\n\n2. **Perimeter of a Triangle**:\n   - If you know the lengths of all three sides \\(a\\), \\(b\\), and \\(c\\):\n     \\[\n     \\text{Perimeter} = a + b + c\n     \\]\n\n3. **Pythagorean Theorem** (for right triangles):\n   - If \\(c\\) is the length of the hypotenuse and \\(a\\) and \\(b\\) are the lengths of the other two sides:\n     \\[\n     c^2 = a^2 + b^2\n     \\]\n\n4. **Angles**:\n   - To find angles using the sides (Law of Cosines):\n     \\[\n     c^2 = a^2 + b^2 - 2ab \\cdot \\cos(C)\n     \\]\n   - Rearranging gives:\n     \\[\n     \\cos(C) = \\frac{a^2 + b^2 - c^2}{2ab}\n     \\]\n\nThese formulas can help you calculate the area, perimeter, and angles of a triangle based on the information you have.",
  },
  {
    id: 'aonMZaAcoUg88jka',
    role: 'user',
    content: 'Popupar formulas in Physic',
  },
  {
    id: 'aonMZaAcoUg00jka',
    role: 'assistant',
    content:
      "Certainly! Here are some of the most popular and fundamental formulas in physics, categorized by topic:\n\n### Mechanics\n1. **Newton's Second Law**:  \n   \\[ F = ma \\]  \n   (Force equals mass times acceleration)\n\n2. **Kinematic Equations** (for uniformly accelerated motion):  \n   - \\( v = u + at \\)  \n   - \\( s = ut + \\frac{1}{2}at^2 \\)  \n   - \\( v^2 = u^2 + 2as \\)  \n   Where:\n   - \\( v \\) = final velocity\n   - \\( u \\) = initial velocity\n   - \\( a \\) = acceleration\n   - \\( s \\) = displacement\n   - \\( t \\) = time\n\n3. **Work Done**:  \n   \\[ W = Fd \\cos(\\theta) \\]  \n   (Work equals force times displacement times the cosine of the angle between them)\n\n4. **Kinetic Energy**:  \n   \\[ KE = \\frac{1}{2}mv^2 \\]  \n   (Kinetic energy equals one-half the mass times the velocity squared)\n\n5. **Potential Energy**:  \n   \\[ PE = mgh \\]  \n   (Potential energy equals mass times gravitational acceleration times height)\n\n### Thermodynamics\n1. **First Law of Thermodynamics**:  \n   \\[ \\Delta U = Q - W \\]  \n   (Change in internal energy equals heat added to the system minus work done by the system)\n\n2. **Ideal Gas Law**:  \n   \\[ PV = nRT \\]  \n   (Pressure times volume equals number of moles times the gas constant times temperature)\n\n### Electromagnetism\n1. **Coulomb's Law**:  \n   \\[ F = k \\frac{|q_1 q_2|}{r^2} \\]  \n   (Force between two charges is proportional to the product of the charges and inversely proportional to the square of the distance between them)\n\n2. **Ohm's Law**:  \n   \\[ V = IR \\]  \n   (Voltage equals current times resistance)\n\n3. **Faraday's Law of Electromagnetic Induction**:  \n   \\[ \\mathcal{E} = -\\frac{d\\Phi_B}{dt} \\]  \n   (Electromotive force equals the negative rate of change of magnetic flux)\n\n### Waves and Optics\n1. **Wave Speed**:  \n   \\[ v = f\\lambda \\]  \n   (Wave speed equals frequency times wavelength)\n\n2. **Snell's Law**:  \n   \\[ n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2) \\]  \n   (Describes the relationship between angles of incidence and refraction)\n\n### Modern Physics\n1. **Einstein's Mass-Energy Equivalence**:  \n   \\[ E = mc^2 \\]  \n   (Energy equals mass times the speed of light squared)\n\n2. **Planck's Equation**:  \n   \\[ E = hf \\]  \n   (Energy of a photon equals Planck's constant times frequency)\n\nThese formulas cover a wide range of topics in physics and are essential for understanding the principles of the subject. If you need more specific formulas or concepts, feel free to ask!",
  },
]

export default function Page(): JSX.Element {
  return (
    <div className="flex gap-10">
      <div className="hidden max-h-screen w-1/2 justify-center space-y-10 self-center overflow-y-auto p-10 md:block">
        <h1 className="bg-gradient-to-r from-[#e711dd] to-[#b5f2fd] bg-clip-text text-6xl font-bold text-transparent">
          LlamaIndex ChatUI
        </h1>
        <h1 className="mb-4 text-2xl font-bold">Custom Chat Demo</h1>
        <Code content={code} language="jsx" />
      </div>
      <div className="w-full md:w-1/2 md:border-l">
        <CustomChat />
      </div>
    </div>
  )
}

function CustomChat() {
  const handler = useChat({ initialMessages })
  const { imageUrl, getAnnotations, uploadFile, reset } = useFile({
    uploadAPI: '/chat/upload',
  })
  const annotations = getAnnotations()
  const handleUpload = async (file: File) => {
    try {
      await uploadFile(file)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <ChatSection
      handler={handler}
      className="h-screen overflow-hidden p-0 md:p-5"
    >
      <CustomChatMessages />
      <ChatInput annotations={annotations} resetUploadedFiles={reset}>
        <div>
          {imageUrl ? (
            <img
              className="max-h-[100px] object-contain"
              src={imageUrl}
              alt="uploaded"
            />
          ) : null}
        </div>
        <ChatInput.Form>
          <ChatInput.Field />
          <ChatInput.Upload
            allowedExtensions={['jpg', 'png', 'jpeg']}
            onUpload={handleUpload}
          />
          <ChatInput.Submit />
        </ChatInput.Form>
      </ChatInput>
    </ChatSection>
  )
}

function CustomChatMessages() {
  const { messages, isLoading, append } = useChatUI()
  return (
    <ChatMessages>
      <ChatMessages.List className="px-0 md:px-16">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ChatMessage
                message={message}
                isLast={index === messages.length - 1}
                className="items-start"
              >
                <ChatMessage.Avatar>
                  <img
                    className="border-1 rounded-full border-[#e711dd]"
                    alt="LlamaIndex"
                    src="/llama.png"
                  />
                </ChatMessage.Avatar>
                <ChatMessage.Content isLoading={isLoading} append={append}>
                  <ChatMessage.Content.Image />
                  <ChatMessage.Content.Markdown />
                  <ChatMessage.Content.DocumentFile />
                </ChatMessage.Content>
                <ChatMessage.Actions />
              </ChatMessage>
            </motion.div>
          ))}
        </AnimatePresence>
      </ChatMessages.List>
    </ChatMessages>
  )
}
