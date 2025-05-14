export const javascriptCode = `class PriorityTaskQueue {
  constructor() {
    this.queue = new Map();
    this.highPriority = [];
    this.normalPriority = [];
    this.lowPriority = [];
  }

  addTask(id, task, priority = 'normal') {
    this.queue.set(id, {
      task,
      priority,
      timestamp: Date.now()
    });

    switch(priority) {
      case 'high':
        this.highPriority.push(id);
        break;
      case 'normal':
        this.normalPriority.push(id);
        break;
      case 'low':
        this.lowPriority.push(id);
        break;
    }
  }

  async executeNext() {
    const nextId = this.highPriority.length > 0 
      ? this.highPriority.shift()
      : this.normalPriority.length > 0
        ? this.normalPriority.shift()
        : this.lowPriority.shift();

    if (!nextId) return null;

    const taskData = this.queue.get(nextId);
    if (!taskData) return null;

    try {
      const result = await taskData.task();
      this.queue.delete(nextId);
      return { id: nextId, result, status: 'completed' };
    } catch (error) {
      return { id: nextId, error, status: 'failed' };
    }
  }
}

// Example usage
const taskQueue = new PriorityTaskQueue();

taskQueue.addTask('task1', async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return 'High priority task completed';
}, 'high');

taskQueue.addTask('task2', async () => {
  const data = { name: 'John', age: 30 };
  return JSON.stringify(data);
}, 'normal');

// Execute tasks
async function runTasks() {
  const result1 = await taskQueue.executeNext();
  console.log(result1);
  const result2 = await taskQueue.executeNext();
  console.log(result2);
}

runTasks();`

export const pythonCode =
  'import re\nimport time\nfrom typing import Any, Literal, Optional, Union\n\nfrom pydantic import BaseModel\n\nfrom llama_index.core.chat_engine.types import ChatMessage\nfrom llama_index.core.llms import LLM\nfrom llama_index.core.memory import ChatMemoryBuffer\nfrom llama_index.core.prompts import PromptTemplate\nfrom llama_index.core.workflow import (\n    Context,\n    Event,\n    StartEvent,\n    StopEvent,\n    Workflow,\n    step,\n)\nfrom llama_index.server.api.models import (\n    Artifact,\n    ArtifactEvent,\n    ArtifactType,\n    ChatRequest,\n    CodeArtifactData,\n    UIEvent,\n)\nfrom llama_index.server.api.utils import get_last_artifact\n\n\nclass Requirement(BaseModel):\n    next_step: Literal["answering", "coding"]\n    language: Optional[str] = None\n    file_name: Optional[str] = None\n    requirement: str\n\n\nclass PlanEvent(Event):\n    user_msg: str\n    context: Optional[str] = None\n\n\nclass GenerateArtifactEvent(Event):\n    requirement: Requirement\n\n\nclass SynthesizeAnswerEvent(Event):\n    pass\n\n\nclass UIEventData(BaseModel):\n    state: Literal["plan", "generate", "completed"]\n    requirement: Optional[str] = None\n\n\nclass ArtifactWorkflow(Workflow):\n    """\n    A simple workflo123213w12321 tha123112312t help generate/update the chat artifact (code, document)\n    e.g: Help create a NextJS app.\n         Update the generated code with the user\'s feedback.\n         Generate a guideline for the app,...\n    """\n\n    def __init__(\n        self,\n        llm: LLM,\n        chat_request: ChatRequest,\n        **kwargs: Any,\n    ):\n        """\n        Args:\n            llm: The LLM to use.\n            chat_request: The chat request from the chat app to use.\n        """\n        super().__init__(**kwargs)\n        self.llm = llm\n        self.chat_request = chat_request\n        self.last_artifact = get_last_artifact(chat_request)\n\n    @step\n    async def prepare_chat_history(self, ctx: Context, ev: StartEvent) -> PlanEvent:\n        user_msg = ev.user_msg\n        if user_msg is None:\n            raise ValueError("user_msg is required to run the workflow")\n        await ctx.set("user_msg", user_msg)\n        chat_history = ev.chat_history or []\n        chat_history.append(\n            ChatMessage(\n                role="user",\n                content=user_msg,\n            )\n        )\n        memory = ChatMemoryBuffer.from_defaults(\n            chat_history=chat_history,\n            llm=self.llm,\n        )\n        await ctx.set("memory", memory)\n        return PlanEvent(\n            user_msg=user_msg,\n            context=str(self.last_artifact.model_dump_json())\n            if self.last_artifact\n            else "",\n        )\n\n    @step\n    async def planning(\n        self, ctx: Context, event: PlanEvent\n    ) -> Union[GenerateArtifactEvent, SynthesizeAnswerEvent]:\n        """\n        Based on the conversation history and the user\'s request\n        this step will help to provide a good next step for the code or document generation.\n        """\n        ctx.write_event_to_stream(\n            UIEvent(\n                type="ui_event",\n                data=UIEventData(\n                    state="plan",\n                    requirement=None,\n                ),\n            )\n        )\n        prompt = PromptTemplate("""\n        You are a product analyst responsible for analyzing the user\'s request and providing the next step for code or document generation.\n        You are helping user with their code artifact. To update the code, you need to plan a coding step.\n    \n        Follow these instructions:\n        1. Carefully analyze the conversation history and the user\'s request to determine what has been done and what the next step should be.\n        2. The next step must be one of the following two options:\n           - "coding": To make the changes to the current code.\n           - "answering": If you don\'t need to update the current code or need clarification from the user.\n        Important: Avoid telling the user to update the code themselves, you are the one who will update the code (by planning a coding step).\n        3. If the next step is "coding", you may specify the language ("typescript" or "python") and file_name if known, otherwise set them to null. \n        4. The requirement must be provided clearly what is the user request and what need to be done for the next step in details\n           as precise and specific as possible, don\'t be stingy with in the requirement.\n        5. If the next step is "answering", set language and file_name to null, and the requirement should describe what to answer or explain to the user.\n        6. Be concise; only return the requirements for the next step.\n        7. The requirements must be in the following format:\n           ```json\n           {\n               "next_step": "answering" | "coding",\n               "language": "typescript" | "python" | null,\n               "file_name": string | null,\n               "requirement": string\n           }\n           ```\n\n        ## Example 1:\n        User request: Create a calculator app.\n        You should return:\n        ```json\n        {\n            "next_step": "coding",\n            "language": "typescript",\n            "file_name": "calculator.tsx",\n            "requirement": "Generate code for a calculator app that has a simple UI with a display and button layout. The display should show the current input and the result. The buttons should include basic operators, numbers, clear, and equals. The calculation should work correctly."\n        }\n        ```\n\n        ## Example 2:\n        User request: Explain how the game loop works.\n        Context: You have already generated the code for a snake game.\n        You should return:\n        ```json\n        {\n            "next_step": "answering",\n            "language": null,\n            "file_name": null,\n            "requirement": "The user is asking about the game loop. Explain how the game loop works."\n        }\n        ```\n\n        {context}\n\n        Now, plan the user\'s next step for this request:\n        {user_msg}\n        """).format(\n            context=""\n            if event.context is None\n            else f"## The context is: \\n{event.context}\\n",\n            user_msg=event.user_msg,\n        )\n        response = await self.llm.acomplete(\n            prompt=prompt,\n            formatted=True,\n        )\n        # parse the response to Requirement\n        # 1. use regex to find the json block\n        json_block = re.search(\n            r"```(?:json)?\\s*([\\s\\S]*?)\\s*```", response.text, re.IGNORECASE\n        )\n        if json_block is None:\n            raise ValueError("No JSON block found in the response.")\n        # 2. parse the json block to Requirement\n        requirement = Requirement.model_validate_json(json_block.group(1).strip())\n        ctx.write_event_to_stream(\n            UIEvent(\n                type="ui_event",\n                data=UIEventData(\n                    state="generate",\n                    requirement=requirement.requirement,\n                ),\n            )\n        )\n        # Put the planning result to the memory\n        # useful for answering step\n        memory: ChatMemoryBuffer = await ctx.get("memory")\n        memory.put(\n            ChatMessage(\n                role="assistant",\n                content=f"The plan for next step: \\n{response.text}",\n            )\n        )\n        await ctx.set("memory", memory)\n        if requirement.next_step == "coding":\n            return GenerateArtifactEvent(\n                requirement=requirement,\n            )\n        else:\n            return SynthesizeAnswerEvent()\n\n    @step\n    async def generate_artifact(\n        self, ctx: Context, event: GenerateArtifactEvent\n    ) -> SynthesizeAnswerEvent:\n        """\n        Generate the code based on the user\'s request.\n        """\n        ctx.write_event_to_stream(\n            UIEvent(\n                type="ui_event",\n                data=UIEventData(\n                    state="generate",\n                    requirement=event.requirement.requirement,\n                ),\n            )\n        )\n        prompt = PromptTemplate("""\n         You are a skilled developer who can help user with coding.\n         You are given a task to generate or update a code for a given requirement.\n\n         ## Follow these instructions:\n         **1. Carefully read the user\'s requirements.** \n            If any details are ambiguous or missing, make reasonable assumptions and clearly reflect those in your output.\n            If the previous code is provided:\n            + Carefully analyze the code with the request to make the right changes.\n            + Avoid making a lot of changes from the previous code if the request is not to write the code from scratch again.\n         **2. For code requests:**\n            - If the user does not specify a framework or language, default to a React component using the Next.js framework.\n            - For Next.js, use Shadcn UI components, Typescript, @types/node, @types/react, @types/react-dom, PostCSS, and TailwindCSS.\n            The import pattern should be:\n            ```\n            import { ComponentName } from "@/components/ui/component-name"\n            import { Markdown } from "@llamaindex/chat-ui"\n            import { cn } from "@/lib/utils"\n            ```\n            - Ensure the code is idiomatic, production-ready, and includes necessary imports.\n            - Only generate code relevant to the user\'s requestâ€”do not add extra boilerplate.\n         **3. Don\'t be verbose on response**\n            - No other text or comments only return the code which wrapped by ```language``` block.\n            - If the user\'s request is to update the code, only return the updated code.\n         **4. Only the following languages are allowed: "typescript", "python".**\n         **5. If there is no code to update, return the reason without any code block.**\n            \n         ## Example:\n         ```typescript\n         import React from "react";\n         import { Button } from "@/components/ui/button";\n         import { cn } from "@/lib/utils";\n\n         export default function MyComponent() {\n         return (\n            <div className="flex flex-col items-center justify-center h-screen">\n               <Button>Click me</Button>\n            </div>\n         );\n         }\n\n         The previous code is:\n         {previous_artifact}\n\n         Now, i have to generate the code for the following requirement:\n         {requirement}\n         ```\n        """).format(\n            previous_artifact=self.last_artifact.model_dump_json()\n            if self.last_artifact\n            else "",\n            requirement=event.requirement,\n        )\n        response = await self.llm.acomplete(\n            prompt=prompt,\n            formatted=True,\n        )\n        # Extract the code from the response\n        language_pattern = r"```(\\w+)([\\s\\S]*)```"\n        code_match = re.search(language_pattern, response.text)\n        if code_match is None:\n            return SynthesizeAnswerEvent()\n        else:\n            code = code_match.group(2).strip()\n        # Put the generated code to the memory\n        memory: ChatMemoryBuffer = await ctx.get("memory")\n        memory.put(\n            ChatMessage(\n                role="assistant",\n                content=f"Updated the code: \\n{response.text}",\n            )\n        )\n        # To show the Canvas panel for the artifact\n        ctx.write_event_to_stream(\n            ArtifactEvent(\n                data=Artifact(\n                    type=ArtifactType.CODE,\n                    created_at=int(time.time()),\n                    data=CodeArtifactData(\n                        language=event.requirement.language or "",\n                        file_name=event.requirement.file_name or "",\n                        code=code,\n                    ),\n                ),\n            )\n        )\n        return SynthesizeAnswerEvent()\n\n    @step\n    async def synthesize_answer(\n        self, ctx: Context, event: SynthesizeAnswerEvent\n    ) -> StopEvent:\n        """\n        Synthesize the answer.\n        """\n        memory: ChatMemoryBuffer = await ctx.get("memory")\n        chat_history = memory.get()\n        chat_history.append(\n            ChatMessage(\n                role="system",\n                content="""\n                You are a helpful assistant who is responsible for explaining the work to the user.\n                Based on the conversation history, provide an answer to the user\'s question. \n                The user has access to the code so avoid mentioning the whole code again in your response.\n                """,\n            )\n        )\n        response_stream = await self.llm.astream_chat(\n            messages=chat_history,\n        )\n        ctx.write_event_to_stream(\n            UIEvent(\n                type="ui_event",\n                data=UIEventData(\n                    state="completed",\n                ),\n            )\n        )\n        return StopEvent(result=response_stream)\n'

export const tsxCode = `
'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
`

export const htmlCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complex HTML Example</title>
  <style>
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
    }
    .nav {
      background: #333;
      padding: 1rem;
    }
    .nav-link {
      color: white;
      text-decoration: none;
      margin-right: 15px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
  </style>
</head>
<body>
  <nav class="nav">
    <a href="#home" class="nav-link">Home</a>
    <a href="#about" class="nav-link">About</a>
    <a href="#contact" class="nav-link">Contact</a>
  </nav>

  <div class="container">
    <header>
      <h1>Welcome to Our Website</h1>
      <p>This is a complex HTML structure with multiple elements and styling</p>
    </header>

    <main>
      <section class="grid">
        <article class="card">
          <h2>Feature 1</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <button onclick="alert('Clicked!')">Learn More</button>
        </article>
        <article class="card">
          <h2>Feature 2</h2>
          <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <button onclick="alert('Clicked!')">Learn More</button>
        </article>
        <article class="card">
          <h2>Feature 3</h2>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
          <button onclick="alert('Clicked!')">Learn More</button>
        </article>
      </section>

      <form>
        <fieldset>
          <legend>Contact Form</legend>
          <div>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div>
            <label for="message">Message:</label>
            <textarea id="message" name="message" rows="4"></textarea>
          </div>
          <button type="submit">Send Message</button>
        </fieldset>
      </form>
    </main>

    <footer>
      <p>&copy; 2024 Complex HTML Example. All rights reserved.</p>
    </footer>
  </div>
</body>
</html>
`
export const cssCode = `
/* Base styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Grid layout */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 40px 0;
}

/* Card styling */
.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card h2 {
  color: #333;
  margin-bottom: 15px;
}

.card button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.card button:hover {
  background: #0056b3;
}

/* Form styling */
form {
  max-width: 600px;
  margin: 40px auto;
}

fieldset {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
}

legend {
  padding: 0 10px;
  font-weight: bold;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button[type="submit"] {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background: #218838;
}

/* Footer */
footer {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  margin-top: 40px;
}
`
