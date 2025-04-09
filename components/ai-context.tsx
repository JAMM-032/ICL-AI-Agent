import type { CoreMessage } from "ai/rsc";
import { createAI, getMutableAIState } from "ai/rsc";
import "server-only";
import MarkdownText from "./markdown-text";
import AmazonLink from "./AmazonLink";
import { AmazonProduct } from "./AmazonProduct";
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

  // const response = await fetch("http://127.0.0.1:8000/submit", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ content: message }), // Use actual variable 'message'
  // });
  // const msg = await response.json();
  // console.log(msg);
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
  console.log("AI response", );
  return {
    id: nanoid(),
    display: <AmazonProduct url="https://www.amazon.com/gp/product/B0058KFUHA/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B0058KFUHA&linkCode=as2&tag=fashionattack-20&linkId=b0e2ac01a23aea8e408f9c8c83aa0aa7" />,
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
