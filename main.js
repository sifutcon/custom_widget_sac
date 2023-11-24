import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: "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";
});
var ajaxCall = (key, url, prompt) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        model: "gpt-3.5-turbo-1106",
        prompt: prompt,
        max_tokens: 1024,
        n: 1,
        temperature: 0.05,
        
        
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      crossDomain: true,
      success: function (response, status, xhr) {
        resolve({ response, status, xhr });
      },
      error: function (xhr, status, error) {
        const err = new Error('xhr error');
        err.status = xhr.status;
        reject(err);
      },
    });
  });
};

const url = "https://api.openai.com/v1";

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  class MainWebComponent extends HTMLElement {
    async post(apiKey, endpoint, prompt) {
      const  response  = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
            "role":"user",
            "content":prompt,
          }
        ],
        max_tokens: 1024,
        temperature: 0.05,
      );
      console.log(response);
      return response;
    }
  }
  customElements.define("custom-widget", MainWebComponent);
})();
