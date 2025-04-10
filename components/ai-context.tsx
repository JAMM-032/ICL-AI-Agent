import type { CoreMessage } from "ai/rsc";
import { createAI, getMutableAIState } from "ai/rsc";
// import "server-only";
import { AmazonProductList } from "./AmazonProductList";
import MarkdownText from "./markdown-text";
import { CardList } from "./CardList";

interface CardItem {
  title: string;
  id?: string;
  metadata?: any;
}



export async function onSubmit(message: string) {
  "use server";

  const aiState = getMutableAIState();
  
  // Try to parse the message as JSON to check if it's a card press
  let cardData = null;
  try {
    if (message.startsWith('{') && message.endsWith('}')) {
      cardData = JSON.parse(message);
    }
  } catch (e) {
    // Not JSON, treat as regular message
  }
  
  console.log(`Received message: ${message}`);
  

  
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
  let apiEndpoint;
  let response;
  let msg;
  // Manually defined result without using OpenAI
  const content = "Here are some recommended options:";
  try {
  //   if (message.includes("https://")) {
  //     apiEndpoint = `http://127.0.0.1:8000/api/youtube-rag?url=${message}`;
  //     try {
  //       response = await fetch(apiEndpoint, {
  //         method: "GET",
  //       });
  //       msg = await response.json();
  //       console.log("msg", msg);
        
  //       // Ensure msg["response"] exists and is an array
  //       const products = Array.isArray(msg["response"]) ? msg["response"] : [];
  //       console.log("products", products);
  //       aiState.done({
  //         ...aiState.get(),
  //         messages: [
  //           ...aiState.get().messages,
  //           {
  //             id: nanoid(),
  //             role: "assistant",
  //             content,
  //           },
  //         ],
  //       });
        
  //       return {
  //         id: nanoid(),
  //         display: (
  //           <>
  //             <MarkdownText>Products Suggested for your DIY</MarkdownText>
  //             {products.length > 0 ? (
  //               <AmazonProductList title="recommendation" urls={products}/>
  //             ) : (
  //               <MarkdownText>No products found. Please try a different search.</MarkdownText>
  //             )}
  //           </>
  //         ),
  //       };
  //     } catch (error) {
  //       console.error("Error fetching YouTube data:", error);
  //       return {
  //         id: nanoid(),
  //         display: (
  //           <MarkdownText>
  //             Sorry, there was an error processing your YouTube link. Please try again.
  //           </MarkdownText>
  //         ),
  //       };
  //     }
  //   }
  //   else {
  //     console.log("message", message);
  //     apiEndpoint = 'http://127.0.0.1:8000/submit';
  //     response = await fetch(apiEndpoint, {
  //       method: "POST",
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({content: message}),
  //     });
  //     console.log("response", response);
  //     msg = await response.json();
  //     console.log("msg", msg);
  //     aiState.done({
  //       ...aiState.get(),
  //       messages: [
  //         ...aiState.get().messages,
  //         {
  //           id: nanoid(),
  //           role: "assistant",
  //           content,
  //         },
  //       ],
  //     });
  //     return {
  //       id: nanoid(),
  //       display: (
  //         <>
  //           <MarkdownText>{msg["response"]}</MarkdownText>
  //         </>
  //       ),
  //     };
  //   }
    if (cardData && cardData.action === 'card_press'){
 
    } else {
      // If it's a card press, use a different endpoint or add a parameter
      console.log("card press", cardData);
      apiEndpoint = `http://127.0.0.1:8000/api/get-repairs?request=${message}`;
      // Make a single fetch request
      response = await fetch(apiEndpoint, {
        method: "GET",
      });
      msg = await response.json();
    }
    
    

    console.log("response", (msg["response"].replace(/['"]/g, '')));
    console.log(msg);
    if (cardData && cardData.action === 'card_press') {
    } else {
      // If it's a card press, use a different endpoint or add a parameter
      // console.log("card press", cardData.title);
      //apiEndpoint = `http://127.0.0.1:8000/api/get-repairs/recommendations?request=${message}&aspect=${cardData.title}`;
      // Process the response
      let responseItems = msg["response"].replace(/['"]/g, '').split(',');
      responseItems[0] = responseItems[0].replace("[", "");
      responseItems[responseItems.length - 1] = responseItems[responseItems.length - 1].replace("]", "");
      const cardItems: CardItem[] = responseItems.map((item, index) => ({
        id: `card_${index}`,
        title: typeof item === 'string' ? item.trim() : JSON.stringify(item),
        metadata: {
          originalIndex: index,
          category: 'repair_option',
          timestamp: new Date().toISOString()
        }
      }));
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
      console.log("AI response", msg["response"].replace(/['"]/g, ''));
      return {
        id: nanoid(),
        display: (
          <>
            <MarkdownText done={true}>Which one of these would you care about?</MarkdownText>
            <CardList 
              title="Recommended Options" 
              items={cardItems}
            />
          </>
        ),
      };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // Provide a fallback response
    msg = { response: "Sorry, there was an error processing your request." };
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
  
  // // Return appropriate UI based on whether it was a card press or not
  // if (cardData && cardData.action === 'card_press') {
    //   return {
    //     id: nanoid(),
    //     display: (
    //       <>
    //         <MarkdownText>{`Here are details about "${cardData.title}":`}</MarkdownText>
    //         <MarkdownText>{msg["response"]}</MarkdownText>
    //       </>
    //     ),
    //   };
    // } else {
      
  //   // Your existing card list display
  // }
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
