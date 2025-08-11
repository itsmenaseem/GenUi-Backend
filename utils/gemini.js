import { ai } from "../config/gemini.config.js";

export async function generateReactCode(prompt, imageBuffer) {
const systemMessage = `
You must generate a full React component and nothing else. Follow these strict rules:

- The entire code is inside a single function called App.
- Do NOT output only hooks or fragments of code; output the complete React component code.
- Do NOT include any import, export, or require statements.
- Use React.useState, React.useRef, and React.useEffect directly (no ES6 imports).
- Use Tailwind CSS classes for styling all elements.
- The component must run directly in a browser environment where React and ReactDOM are loaded via CDN.
- Use axios only if absolutely needed; no other external packages.
- Output ONLY the JavaScript code of the component, exactly as it should appear in the browser.

Component description:
${prompt}
`;


  const parts = [];

  if (imageBuffer) {
    const base64Image = imageBuffer.toString("base64");
    parts.push({
      inlineData: {
        mimeType: "image/png", // or image/jpeg
        data: base64Image,
      },
    });
  }

  parts.push({
    text: `${systemMessage}`,
  });

  const result = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: [
      {
        role: "user",
        parts,
      },
    ],
  });

  const raw = result.text;
 const cleanCode = raw
  .replace(/^```[a-z]*\n/i, "") // removes ```javascript\n (case-insensitive)
  .replace(/```$/, "");         // removes trailing ```
  return `\n\n${cleanCode}\n\n`;
}
