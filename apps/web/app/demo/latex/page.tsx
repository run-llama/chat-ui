'use client'

import { Message, useChat } from 'ai/react'
import { ChatSection } from '@llamaindex/chat-ui'
import { Code } from '@/components/code'

const code = `
import { ChatSection } from '@llamaindex/chat-ui'
import { useChat } from 'ai/react'

function DemoLatexChat() {
  const handler = useChat()
  return <ChatSection handler={handler} />
}
`

const initialMessages: Message[] = [
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
    id: 'aonMZaA22oU7lAj222',
    role: 'user',
    content: 'Implement calculate triangle area in js',
  },
  {
    id: 'a2nMZaA22oU7lAj222',
    role: 'assistant',
    content:
      'To calculate the area of a triangle in JavaScript, you can use the formula:\n\n\\[\n\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height}\n\\]\n\nHere\'s a simple implementation in JavaScript:\n\n```javascript\nfunction calculateTriangleArea(base, height) {\n    if (base <= 0 || height <= 0) {\n        throw new Error("Base and height must be positive numbers.");\n    }\n    return 0.5 * base * height;\n}\n\n// Example usage:\nconst base = 5; // Example base length\nconst height = 10; // Example height length\n\ntry {\n    const area = calculateTriangleArea(base, height);\n    console.log(`The area of the triangle is: ${area}`);\n} catch (error) {\n    console.error(error.message);\n}\n```\n\n### Explanation:\n1. **Function Definition**: The function `calculateTriangleArea` takes two parameters: `base` and `height`.\n2. **Input Validation**: It checks if the base and height are positive numbers. If not, it throws an error.\n3. **Area Calculation**: It calculates the area using the formula and returns the result.\n4. **Example Usage**: The example shows how to call the function and log the result to the console.\n\nYou can modify the `base` and `height` variables to test with different values.',
  },
  {
    id: 'aonMZaAcoU7lAjka',
    role: 'user',
    content: 'Popupar formulas in Math',
  },
  {
    id: 'aonMZaA22oU7lAjka',
    role: 'assistant',
    content:
      "Here are some popular mathematical formulas across various branches of mathematics:\n\n### Algebra\n1. **Quadratic Formula**: \n   \\[\n   x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n   \\]\n   (Used to find the roots of a quadratic equation \\( ax^2 + bx + c = 0 \\))\n\n2. **Difference of Squares**: \n   \\[\n   a^2 - b^2 = (a - b)(a + b)\n   \\]\n\n3. **Factoring a Perfect Square**: \n   \\[\n   a^2 + 2ab + b^2 = (a + b)^2\n   \\]\n   \\[\n   a^2 - 2ab + b^2 = (a - b)^2\n   \\]\n\n### Geometry\n1. **Area of a Circle**: \n   \\[\n   A = \\pi r^2\n   \\]\n\n2. **Circumference of a Circle**: \n   \\[\n   C = 2\\pi r\n   \\]\n\n3. **Pythagorean Theorem**: \n   \\[\n   a^2 + b^2 = c^2\n   \\]\n   (In a right triangle, where \\( c \\) is the hypotenuse)\n\n4. **Area of a Triangle**: \n   \\[\n   A = \\frac{1}{2} \\times \\text{base} \\times \\text{height}\n   \\]\n\n### Trigonometry\n1. **Sine, Cosine, and Tangent**: \n   \\[\n   \\sin(\\theta) = \\frac{\\text{opposite}}{\\text{hypotenuse}}, \\quad \\cos(\\theta) = \\frac{\\text{adjacent}}{\\text{hypotenuse}}, \\quad \\tan(\\theta) = \\frac{\\text{opposite}}{\\text{adjacent}}\n   \\]\n\n2. **Pythagorean Identity**: \n   \\[\n   \\sin^2(\\theta) + \\cos^2(\\theta) = 1\n   \\]\n\n### Calculus\n1. **Derivative of a Function**: \n   \\[\n   \\frac{d}{dx}(x^n) = nx^{n-1}\n   \\]\n\n2. **Integral of a Function**: \n   \\[\n   \\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)\n   \\]\n\n3. **Fundamental Theorem of Calculus**: \n   \\[\n   \\int_a^b f(x) \\, dx = F(b) - F(a)\n   \\]\n   (Where \\( F \\) is an antiderivative of \\( f \\))\n\n### Statistics\n1. **Mean**: \n   \\[\n   \\text{Mean} = \\frac{\\sum_{i=1}^{n} x_i}{n}\n   \\]\n\n2. **Variance**: \n   \\[\n   \\sigma^2 = \\frac{\\sum_{i=1}^{n} (x_i - \\mu)^2}{n}\n   \\]\n   (Where \\( \\mu \\) is the mean)\n\n3. **Standard Deviation**: \n   \\[\n   \\sigma = \\sqrt{\\sigma^2}\n   \\]\n\n### Probability\n1. **Probability of an Event**: \n   \\[\n   P(A) = \\frac{\\text{Number of favorable outcomes}}{\\text{Total number of outcomes}}\n   \\]\n\n2. **Bayes' Theorem**: \n   \\[\n   P(A|B) = \\frac{P(B|A)P(A)}{P(B)}\n   \\]\n\nThese formulas are foundational in their respective areas and are widely used in various applications of mathematics.",
  },
]

export default function Page(): JSX.Element {
  const handler = useChat({ initialMessages })
  return (
    <div className="flex gap-10">
      <div className="hidden w-1/3 justify-center space-y-10 self-center p-10 md:block">
        <h1 className="bg-gradient-to-r from-[#e711dd] to-[#b5f2fd] bg-clip-text text-6xl font-bold text-transparent">
          LlamaIndex ChatUI
        </h1>
        <h1 className="mb-4 text-2xl font-bold">Latex Chat Demo</h1>
        <Code content={code} language="jsx" />
      </div>
      <div className="w-full md:w-2/3 md:border-l">
        <ChatSection
          handler={handler}
          className="mx-auto h-screen max-w-3xl overflow-hidden p-0 md:p-5"
        />
      </div>
    </div>
  )
}
