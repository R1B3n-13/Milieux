"use server";

import { createStreamableValue } from "ai/rsc";

const backendUrl = process.env.AI_BACKEND_URL;

export async function getTidbits(data: {
  text: string;
  media_url: string | null;
}) {
  try {
    const url = new URL("/tidbits", backendUrl);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-cache",
    });

    return response.json();
  } catch (error) {
    console.error("Getting tidbits resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function addPostToCorpus(data: {
  text: string;
  media_url: string | null;
  postId: number;
}) {
  try {
    const url = new URL("/add-post", backendUrl);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-cache",
    });

    return response.json();
  } catch (error) {
    console.error("Adding post to corpus resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function getQueryResponse(data: { query: string }) {
  try {
    const url = new URL("/search", backendUrl);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-cache",
    });

    return response.json();
  } catch (error) {
    console.error("Getting query response resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function generateImage(data: { text: string; model: string }) {
  try {
    const url = new URL("/generate-image", backendUrl);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-cache",
    });

    return response.json();
  } catch (error) {
    console.error("Generating image resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function addPdfToCorpus(data: FormData) {
  try {
    const url = new URL("/add-pdf", backendUrl);

    const response = await fetch(url, {
      method: "POST",
      body: data,
      cache: "no-cache",
    });

    return response.json();
  } catch (error) {
    console.error("Adding pdf to corpus resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function askCustomChatbot(data: {
  query: string;
  userId: number | null | undefined;
  history: { role: "user" | "model"; parts: string }[];
}) {
  try {
    if (!data.userId) throw new Error("Invalid user id.");

    const url = new URL("/ask", backendUrl);

    const stream = createStreamableValue("");

    (async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the response from the server.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let decodedResult = "";

      while (true) {
        const { value, done } = await reader?.read()!;

        if (done) break;

        decodedResult += decoder.decode(value, { stream: true });
        const parts = decodedResult.split("|||");

        for (const jsonString of parts) {
          if (
            jsonString.trim().startsWith("{") &&
            jsonString.trim().endsWith("}")
          ) {
            try {
              const { result } = JSON.parse(jsonString.trim());
              stream.update(result);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }

        decodedResult = parts[parts.length - 1];
      }

      stream.done();
    })();

    return {
      status: 200,
      success: true,
      message: "Streaming finished.",
      result: stream.value,
    };
  } catch (error) {
    console.error("Getting query response resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
      result: createStreamableValue("").value,
    };
  }
}

export async function checkAndCorrectText(data: { text: string }) {
  try {
    const url = new URL("/proof-reading", backendUrl);

    const stream = createStreamableValue("");

    (async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the response from the server.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let decodedResult = "";

      while (true) {
        const { value, done } = await reader?.read()!;

        if (done) break;

        decodedResult += decoder.decode(value, { stream: true });
        const parts = decodedResult.split("|||");

        for (const jsonString of parts) {
          if (
            jsonString.trim().startsWith("{") &&
            jsonString.trim().endsWith("}")
          ) {
            try {
              const { result } = JSON.parse(jsonString.trim());
              stream.update(result);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }

        decodedResult = parts[parts.length - 1];
      }

      stream.done();
    })();

    return {
      status: 200,
      success: true,
      message: "Streaming finished.",
      result: stream.value,
    };
  } catch (error) {
    console.error("Proof reading resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
      result: createStreamableValue("").value,
    };
  }
}

export async function generateCaption(data: FormData) {
  try {
    const url = new URL("/caption", backendUrl);

    const stream = createStreamableValue("");

    (async () => {
      const response = await fetch(url, {
        method: "POST",
        body: data,
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the response from the server.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let decodedResult = "";

      while (true) {
        const { value, done } = await reader?.read()!;

        if (done) break;

        decodedResult += decoder.decode(value, { stream: true });
        const parts = decodedResult.split("|||");

        for (const jsonString of parts) {
          if (
            jsonString.trim().startsWith("{") &&
            jsonString.trim().endsWith("}")
          ) {
            try {
              const { result } = JSON.parse(jsonString.trim());
              stream.update(result);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }

        decodedResult = parts[parts.length - 1];
      }

      stream.done();
    })();

    return {
      status: 200,
      success: true,
      message: "Streaming finished.",
      result: stream.value,
    };
  } catch (error) {
    console.error("Generating caption resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
      result: createStreamableValue("").value,
    };
  }
}
