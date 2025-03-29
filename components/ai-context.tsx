import type { CoreMessage } from "ai/rsc";
import { createAI, getMutableAIState } from "ai/rsc";
import "server-only";
import MarkdownText from "./markdown-text";
export async function onSubmit(message: string) {
  "use server";

  const aiState = getMutableAIState();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content: message,
      },
    ],
  });
  console.log("message", message);
  const response = await fetch("http://127.0.0.1:8000/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }), // Use actual variable 'message'
  });
  const msg = await response.json();
  console.log(msg);
  // Manually defined result without using OpenAI
  const content = "This is a manually defined response."

  aiState.done({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "assistant",
        content,
      },
    ],
  });
  return {
    id: nanoid(),
    display: <MarkdownText done={true}>{msg.response}</MarkdownText>,
  };
}

const nanoid = () => Math.random().toString(36).slice(2);

export type Message = CoreMessage & {
  id: string;
};

export type AIState = {
  chatId: string;
  messages: Message[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

const actions = {
  onSubmit,
} as const;

export const AI = createAI<AIState, UIState, typeof actions>({
  actions,
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
});
