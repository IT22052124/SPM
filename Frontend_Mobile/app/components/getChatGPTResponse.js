// chatgptService.js
import axios from "axios";

const apiKey =
  "sk-i9pI0UDxpXTjqJjfr-tJn-R7B08cIzu1XeTmb2NRpST3BlbkFJO5H7hBJAggy-hR36N9lDvCaPAJFoR4sUJL_krx0TQA";

export const getChatGPTResponse = async (prompt) => {
  console.log(1);
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo", // You can choose the appropriate model
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  console.log(2);
  return response.data.choices[0].message.content;
};
