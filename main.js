
const apiUrl = "https://api.openai.com/v1/";

const chatbotConfig = {
  model: "gpt-3.5-turbo",
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
        <label for="promptInput">Text Completion Prompt:</label>
        <input type="text" id="promptInput">
      </div>
      <div>
        <input type="text" id="apiKey">
        <button id="submitButton">Submit</button>
      </div>
        <div id="responseOutput"></div>
      </div>
    `;
    const submitButton = this.shadowRoot.getElementById("submitButton");
    submitButton.addEventListener("click", this.onSubmit.bind(this));
   

  async onSubmit() {
    const promptInput = this.shadowRoot.getElementById("promptInput");
    const responseOutput = this.shadowRoot.getElementById("responseOutput");
    const apiKey = this.shadowRoot.getElementById("apiKey");
    
    
    try {
      const userMessage = promptInput.value;
      const { response } = await this.sendMessage(apiKey, userMessage);
      const botResponse = response.choices[0]?.message?.content || "";
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
