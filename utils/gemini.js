import { ai } from "../config/gemini.config.js";

export async function generateReactCode(prompt, imageBuffer) {
const systemMessage = `
Generate a well-formatted React component that uses React.useState, React.useRef, and React.useEffect.

Requirements:
- Wrap all code inside a single function called App.
- Do NOT include any import, export, or require statements.
- Use React.useState, React.useRef, and React.useEffect directly (no ES6 imports).
- Use Tailwind CSS for styling.
- The code must run in a browser environment where React and ReactDOM are loaded via CDN.
- Use axios only if needed, no other external packages.
- Do NOT include markdown formatting, explanation, or any <a href="#"> links.
- Return ONLY the raw React component code.
- also add extra 2 new lines before  and  5 new line after the code
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
  return cleanCode;
}
