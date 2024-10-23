"use client";

import { ChatSection, useVercelAiSdk } from "@llamaindex/chat-ui";

export default function ChatExample() {
  const handler = useVercelAiSdk();
  return <ChatSection handler={handler} />;
}
