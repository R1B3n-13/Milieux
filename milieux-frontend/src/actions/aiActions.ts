"use server";

import { createStreamableValue } from "ai/rsc";
import { getBackendUrl } from "./getEnvVarActions";
import getAuthToken from "./authActions";

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

export async function getVisualSearchResponse(data: {
  query: string;
  image_url: string;
}) {
  try {
    const url = new URL("/visual-search", backendUrl);

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
    console.error("Getting visual search response resulted in error:", error);
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

export async function askCustomChatbot(formData: FormData) {
  try {
    const requestData = formData.get("request");

    if (!requestData) {
      throw new Error("Invalid request data.");
    }

    const data = JSON.parse(requestData.toString());
    if (!data.userId) throw new Error("Invalid user id.");

    const url = new URL("/ask", backendUrl);

    const stream = createStreamableValue("");
    let responseOk = true;

    (async () => {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        cache: "no-cache",
      });

      if (!response.ok) {
        responseOk = false;
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

    if (!responseOk) {
      throw new Error("Failed to fetch the response from the server.");
    } else {
      return {
        status: 200,
        success: true,
        message: "Streaming finished.",
        result: stream.value,
      };
    }
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

export async function chatWithSentiaAi(data: {
  text: string | null;
  media_url: string | null;
  history: {
    role: string;
    text: string | null;
    media_url: string | null;
  }[];
  personality: string | undefined;
}) {
  try {
    const url = new URL("/chat-sentia", backendUrl);

    const stream = createStreamableValue("");
    let responseOk = true;

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
        responseOk = false;
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

    if (!responseOk) {
      throw new Error("Failed to fetch the response from the server.");
    } else {
      return {
        status: 200,
        success: true,
        message: "Streaming finished.",
        result: stream.value,
      };
    }
  } catch (error) {
    console.error(
      "Getting response from chatbot Sentia resulted in error:",
      error
    );
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
    let responseOk = true;

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
        responseOk = false;
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

    if (!responseOk) {
      throw new Error("Failed to fetch the response from the server.");
    } else {
      return {
        status: 200,
        success: true,
        message: "Streaming finished.",
        result: stream.value,
      };
    }
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
    let responseOk = true;

    (async () => {
      const response = await fetch(url, {
        method: "POST",
        body: data,
        cache: "no-cache",
      });

      if (!response.ok) {
        responseOk = false;
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

    if (!responseOk) {
      throw new Error("Failed to fetch the response from the server.");
    } else {
      return {
        status: 200,
        success: true,
        message: "Streaming finished.",
        result: stream.value,
      };
    }
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

export async function createAiChatParams(data: {
  currentPdfName: string | null | undefined;
  temperature: number;
  topP: number;
  topK: number;
  systemInstruction: string;
}) {
  const authToken = await getAuthToken();

  try {
    const url = new URL(`/ai-chat/params/create`, await getBackendUrl());

    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Jwt auth token is missing",
      };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
      cache: "no-cache",
      next: {
        tags: ["createAiChatParams"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Creating ai chat params resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function createAiTool(data: FormData) {
  const authToken = await getAuthToken();

  try {
    const url = new URL(`/ai-chat/tools/create`, await getBackendUrl());

    console.log(data);

    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Jwt auth token is missing",
      };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: data,
      cache: "no-cache",
      next: {
        tags: ["createAiTool"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Creating ai tool resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function updateAiTool(data: FormData) {
  const authToken = await getAuthToken();

  try {
    const url = new URL(`/ai-chat/tools/update`, await getBackendUrl());

    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Jwt auth token is missing",
      };

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: data,
      cache: "no-cache",
      next: {
        tags: ["updateAiTool"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Updating ai tool resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
