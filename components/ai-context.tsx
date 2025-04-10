import type { CoreMessage } from "ai/rsc";
import { createAI, getMutableAIState } from "ai/rsc";
// import "server-only";
import { CardList } from './CardList';
import MarkdownText from "./markdown-text";

interface CardItem {
  title: string;
}

export async function onSubmit(message: string) {
  "use server";

  const aiState = getMutableAIState();

  // Check if this is a card press (you can add a prefix to identify card presses)
  const isCardPress = !message.startsWith('/');
  
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

  // Different API endpoints based on whether it's a card press or regular message
  let apiEndpoint = `http://127.0.0.1:8000/api/get-repairs?request=`;
  
  if (isCardPress) {
    // If it's a card press, use a different endpoint or add a parameter
    apiEndpoint = `http://127.0.0.1:8000/api/get-details?item=${encodeURIComponent(message)}`
    const response = await fetch(apiEndpoint, {
      method: "GET",
    });
    const msg = await response.json();
    console.log("response", (msg["response"].replace(/['"]/g, '')));
    console.log(msg);
    
  };
  
  const response = await fetch(apiEndpoint, {
    method: "GET",
  });
  
  const msg = await response.json();
  console.log("response", (msg["response"].replace(/['"]/g, '')));
  console.log(msg);
  
  // Manually defined result without using OpenAI
  const content = "Here are some recommended options:";

  const responseItems = msg["response"].replace(/['"]/g, '').split(',');
  const cardItems: CardItem[] = [];
  let count = 0;
  for (const item of responseItems) {
    if (count === 0) {
      cardItems.push({
        title: item.replace('[', ''),
      });
    }
    else if (count === responseItems.length - 1) {
      cardItems.push({
        title: item.replace(']', ''),
      });
    }
    else {
      cardItems.push({
        title: item,
      });
    }
    count += 1;
  }
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
  
  // Return appropriate UI based on whether it was a card press or not
  if (isCardPress) {
    return {
      id: nanoid(),
      display: (
        <>
          <MarkdownText>{`Here are details about "${message}":`}</MarkdownText>
          <MarkdownText>{msg["response"]}</MarkdownText>
        </>
      ),
    };
  } else {
    // Your existing card list display
    return {
      id: nanoid(),
      display: (
        <>
          <MarkdownText>{msg["response"]}</MarkdownText>
          <CardList 
            title="Recommended Options" 
            items={cardItems}
          />
        </>
      ),
    };
  }
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
