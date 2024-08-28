"use server";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const backendUrl = process.env.BACKEND_URL;

let stompClient: Client | null = null;

export async function listenOnSocket(
  chatId: number,
  onMessageReceived: () => void
) {
  if (!stompClient || !stompClient.connected) {
    stompClient = new Client({
      webSocketFactory: () => new SockJS(`${backendUrl}/ws`),

      onConnect: () => {
        console.log("Connected to STOMP");
        stompClient!.subscribe(
          `/user/${chatId.toString()}/private`,
          (message) => {
            console.log(message);
            onMessageReceived();
          }
        );
      },

      onStompError: (frame) => {
        console.error("STOMP error", frame);
      },
    });

    stompClient.activate();
  }
}

export async function broadcastToSocket(chatId: number | null | undefined) {
  if ((!stompClient || !stompClient.connected) && chatId) {
    stompClient = new Client({
      webSocketFactory: () => new SockJS(`${backendUrl}/ws`),

      onConnect: () => {
        console.log("Connected to STOMP");
        stompClient!.publish({
          destination: `/app/chat/${chatId.toString()}`,
          body: JSON.stringify({ message: "hello" }),
        });
      },

      onStompError: (frame) => {
        console.error("STOMP error", frame);
      },
    });

    stompClient.activate();
  } else if (chatId) {
   stompClient!.publish(
     {
       destination: `/app/chat/${chatId.toString()}`,
       body: JSON.stringify({ message: "hello" }),
       headers: {},
     },
   );
  }
}

export async function disconnectWebSocket() {
  if (stompClient && stompClient.connected) {
    await stompClient.deactivate();
  }
}
