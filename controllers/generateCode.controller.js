import { generateReactCode } from "../utils/gemini.js";

export const generateCode = async function (req,res){
     try { 
       const {prompt} = req.body || "";
       let imageBuffer = null
      if(req && req.file)imageBuffer = req.file.buffer
    if (!prompt && !imageBuffer) return res.status(400).json({ error: "Bad request" });

    const code = await generateReactCode(prompt,imageBuffer);
    res.json({ code });
  } catch (err) {
    console.error("Gemini Error:", err); // Add this line
    res.status(400).json({ error: "Failed to generae" });
  }
}