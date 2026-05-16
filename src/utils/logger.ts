import { TOKEN } from "../config";

export const Log = async (
  stack: string,
  level: string,
  pkg: string,
  message: string
) => {
  try {
    await fetch("http://4.224.186.213/evaluation-service/logs", {
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
    });
  } catch (err) {
    console.error(err);
  }
};