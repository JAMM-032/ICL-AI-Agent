import type { CoreMessage } from "ai/rsc";
import { createAI, getMutableAIState } from "ai/rsc";
import "server-only";
import { AmazonProductList } from "./AmazonProductList";

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

  const response = await fetch(`http://127.0.0.1:8000/api/youtube-rag?url=${message}`, {
    method: "GET"
  });
  console.log("response", response);
  const msg = await response.json();
  console.log(msg);
  // Manually defined result without using OpenAI
  const content = "Here are some recommended products for your project:";

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
  console.log("AI response", );
  
  // Return multiple products
  return {
    id: nanoid(),
    display: (
      <AmazonProductList 
        title="Recommended Products for Your Project" 
        urls={msg["response"]} 
      />
    ),
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
