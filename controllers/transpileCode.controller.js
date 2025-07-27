
import babel from "@babel/core";
export const transpilCode = async function(req,res){
    const { code } = req.body;

  try {
    const transpiled = babel.transformSync(code, {
      presets: ["@babel/preset-env", ["@babel/preset-react",{module:false}]],
    });
    res.json({ success: true, transpiledCode: transpiled.code });
  } catch (e) {
    res.status(400).json({ success: false, error: "Babel Error: " + e.message });
  }
}