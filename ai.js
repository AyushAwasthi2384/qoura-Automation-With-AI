const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyBt4Sh_D5gjV-9tO7KFKgD8PWWKQLkb0Cg");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function run(prompt) {
    prompt = prompt + "in 100 words";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}

// export default { run };