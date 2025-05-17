# LLM API Speed & Latency Test Tool (Cloudflare Worker)

This is a small tool deployed on Cloudflare Workers to test the call speed and performance of Large Language Model (LLM) APIs. It measures throughput (tokens/sec) and average first-token response latency for various input and output token combinations.

![Tool Screenshot](placeholder.png)

## ✨ Features

*   **Custom API Endpoint**: Test any LLM API endpoint compatible with the OpenAI streaming interface.
*   **Model Name Specification**: Input the specific model name to be tested.
*   **API Token (Optional)**: Supports APIs requiring authentication.
*   **Performance Matrix**:
    *   **Throughput (Tokens/sec)**: Displays throughput in a table легенfor different combinations of input and output token counts. Higher is better.
    *   **Average First Token Wait Time (seconds)**: Shows the average latency for the corresponding combinations. Lower is better.
*   **Dynamic Color Highlighting**: Test results are color-coded based on performance, making it easy to identify bottlenecks quickly.
*   **Pure Frontend Logic**: All tests are initiated from the user's browser. The Cloudflare Worker serves only this single-page application.
*   **Easy Deployment**: Can be deployed directly via the Cloudflare Worker's online editor or using the Wrangler CLI.

## 🚀 How to Use

This tool is designed for deployment as a single `worker.js` file, embedding all HTML, CSS, and JavaScript.

**Method 1: Deploy via Cloudflare Web Dashboard (Easiest)**

1.  Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Navigate to "Workers & Pages".
3.  Click "Create application" -> "Create Worker".
4.  Assign a name to your Worker (e.g., `llm-api-speed-tester`) and choose a subdomain.
5.  Deploy the initial Worker.
6.  Click on the newly created Worker's name to go to its details, then click "Quick edit".
7.  Delete all existing code in the editor.
8.  Copy the **entire content** of the `worker.js` file from this project and paste it into the Cloudflare online editor.
9.  Click "Save and deploy".
10. Access your Worker's URL (e.g., `https://llm-api-speed-tester.your-username.workers.dev`) to start using the tool.

**Method 2: Deploy using Wrangler CLI (For local development and version control)**

1.  **Install Wrangler CLI**: If you haven't already, refer to the [Cloudflare Wrangler official documentation](https://developers.cloudflare.com/workers/wrangler/get-started/).
    ```bash
    npm install -g wrangler
    ```
2.  **Login to Wrangler**:
    ```bash
    wrangler login
    ```
3.  **Clone or download this repository** (if you've uploaded it to GitHub).
4.  **Create `wrangler.toml` file**:
    Create a `wrangler.toml` file in the project root directory with the following content:
    ```toml
    name = "llm-api-speed-tester" # You can customize the Worker name
    main = "worker.js"           # Points to the JS file containing all code
    compatibility_date = "2023-12-01" # Use a valid compatibility date
    # If your worker.js filename is different, modify the main value accordingly
    ```
5.  **Deploy Worker**:
    Run the following command in the project root directory:
    ```bash
    wrangler deploy
    ```
6.  Wrangler will output the URL of the deployed Worker.

**Start Testing:**

1.  Open the deployed Worker URL in your browser.
2.  Enter the full Endpoint URL of the target LLM API (e.g., `https://api.openai.com/v1/chat/completions`).
3.  Enter the model name (e.g., `gpt-3.5-turbo`).
4.  If required by the API, enter your API Token.
5.  Click the "Test Speed" (测速) button and wait for the test results to appear in the tables.

## 🛠️ Technical Details

*   **Frontend**: HTML, CSS, and plain JavaScript.
*   **Backend**: Cloudflare Worker (solely for serving the single-page application).
*   **API Calls**: Uses the browser's `fetch` API to call LLM APIs in a streaming fashion.
*   **Performance Metrics**:
    *   **First Token Latency**: Time from sending the request to receiving the first data chunk. To reduce fluctuations, multiple tests are run per cell, and the average is taken.
    *   **Throughput**: (Approximate Output Tokens) / (Total Response Time). Output tokens are approximated by counting received characters and dividing by an average (e.g., 4 chars/token).
*   **Token Approximation**: As the frontend cannot directly access model-specific tokenizers, input token counts are simulated by generating placeholder text of a certain length. Output token counts are estimated based on the actual characters received.

## 📝 Notes and Limitations

*   **Token Approximation Accuracy**: Token counts are approximate. Actual token numbers can vary based on the model and text content.
*   **Network Fluctuations**: Test results are affected by the user's current network environment. It's advisable to test multiple times or under different network conditions for a comprehensive understanding.
*   **Browser Limitations**: A large number of concurrent requests or prolonged tests might be limited by browser resources.
*   **API Rate Limits**: Be mindful not to exceed the rate limits of the target LLM API, as this could lead to failed tests or account issues.
*   **CORS**: The tool makes requests directly from the browser to the target API. If the target API is not correctly configured for CORS (Cross-Origin Resource Sharing) to allow requests from your Worker's domain, the tests will fail. Most public LLM APIs have relatively permissive CORS policies.
*   **Worker Script Size**: Since all code is embedded in a single JS file, be aware of Cloudflare Worker's script size limits (typically 1MB compressed for the free tier).

## 💡 Potential Future Improvements

*   [ ] Support for importing/exporting test configurations and results.
*   [ ] More accurate token calculation (if a lightweight tokenizer can be integrated).
*   [ ] Backend implementation for the "Share Results" feature.
*   [ ] Visual charts to display historical test data.

## 🤝 Contributing

Feel free to open issues or submit pull requests!

## 📄 License

This project is licensed under the [MIT License](LICENSE).
