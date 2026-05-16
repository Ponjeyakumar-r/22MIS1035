import { TOKEN } from "../config";
export const Log = async (
  stack: string,
  level: string,
  pkg: string,
  message: string
) => {
  try {
    console.log("Sending log:", { stack, level, pkg, message });

    const res = await fetch(
      "http://4.224.186.213/evaluation-service/logs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`
        },
        body: JSON.stringify({
          stack,
          level,
          package: pkg,
          message
        })
      }
    );

    const data = await res.json();

    console.log("Log response:", data);

  } catch (error) {
    console.error("Log failed:", error);
  }
};