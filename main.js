const $ = require("jquery");
const { OpenAI } = require("openai");
const apiUrl = "https://api.openai.com/v1/";
const openai = new OpenAI();

const chatbotConfig = {
  model: "gpt-3.5-turbo-0613",
  role: "user",
  systemMessage: "You are a data analyst",
  maxTokens: 1024,
  numResponses: 1,
  temperature: 0.5,
};

class GptChatCompletionWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Add your custom styles here */
      </style>
      <div>
        <label for="apiKeyInput">OpenAI API Key:</label>
        <input type="text" id="apiKeyInput">
        <label for="promptInput">Text Completion Prompt:</label>
        <input type="text" id="promptInput">
        <button id="submitButton">Submit</button>
        <div id="responseOutput"></div>
      </div>
    `;

    const submitButton = this.shadowRoot.getElementById("submitButton");
    submitButton.addEventListener("click", this.onSubmit.bind(this));
  }

  async onSubmit() {
    const apiKeyInput = this.shadowRoot.getElementById("apiKeyInput");
    const promptInput = this.shadowRoot.getElementById("promptInput");
    const responseOutput = this.shadowRoot.getElementById("responseOutput");

    const apiKey = apiKeyInput.value;

    try {
      const userMessage = promptInput.value;
      const { response } = await openai.completions.create(apiKey, userMessage);
      const botResponse = response.choices[0];
      responseOutput.innerText = `Bot Response: ${botResponse}`;
    } catch (error) {
      console.error("Error:", error);
      responseOutput.innerText = "Error occurred.";
    }
  }

  async sendMessage(apiKey, userMessage) {
    return $.ajax({
      url: `${apiUrl}chat/completions`, // Adjust the endpoint as needed
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        model: chatbotConfig.model,
        messages: [
          { role: chatbotConfig.role, content: userMessage },
          { role: "system", content: chatbotConfig.systemMessage },
        ],
        max_tokens: chatbotConfig.maxTokens,
        n: chatbotConfig.numResponses,
        temperature: chatbotConfig.temperature,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      crossDomain: true,
    });
  }
}

customElements.define("gpt-chat-completion-widget", GptChatCompletionWidget);
