// worker.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>API 速度测试</title>
          <!-- 引入 html2canvas 库 -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" integrity="sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA==" crossorigin="anonymous" referrerpolicy="no-referrer"><\/script>
          <style>
              body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                  background-color: #1e1e2f;
                  color: #e0e0e0;
                  margin: 0;
                  padding: 20px;
                  font-size: 14px;
              }
              .container {
                  max-width: 1200px;
                  margin: auto;
              }
              h1 {
                  color: #ffffff;
                  text-align: center;
                  margin-bottom: 20px;
              }
              .controls {
                  background-color: #2a2a40;
                  padding: 20px;
                  border-radius: 8px;
                  margin-bottom: 30px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              }
              .input-group {
                  display: flex;
                  gap: 15px;
                  margin-bottom: 15px;
                  align-items: center;
              }
              .input-group input[type="text"], .input-group input[type="password"] {
                  flex-grow: 1;
                  padding: 10px;
                  background-color: #3a3a52;
                  border: 1px solid #4f4f6e;
                  color: #e0e0e0;
                  border-radius: 4px;
                  font-size: 14px;
              }
              .input-group input::placeholder {
                  color: #8a8aa0;
              }
              .input-group button {
                  padding: 10px 20px;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 14px;
                  transition: background-color 0.3s ease;
              }
              .test-button {
                  background-color: #4a4a70;
                  color: white;
              }
              .test-button:hover {
                  background-color: #5a5a80;
              }
              .share-button, .screenshot-button { /* Added .screenshot-button styling */
                  background-color: #28a745;
                  color: white;
                  margin-left: 10px; /* Add some space if next to another button */
              }
              .share-button:hover, .screenshot-button:hover {
                  background-color: #218838;
              }
              .description {
                  font-size: 0.9em;
                  color: #b0b0c0;
                  margin-bottom: 20px;
                  line-height: 1.6;
              }
              /* Added an ID to the results grid container for easier selection */
              #resultsContainer {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 30px;
                  margin-top: 20px;
              }
              .grid-section {
                  background-color: #2a2a40;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
              }
              .grid-section h2 {
                  margin-top: 0;
                  color: #ffffff;
                  font-size: 1.2em;
                  border-bottom: 1px solid #4f4f6e;
                  padding-bottom: 10px;
                  margin-bottom: 15px;
              }
              .grid-section .subtitle {
                  font-size: 0.85em;
                  color: #a0a0b8;
                  margin-bottom: 15px;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 10px;
              }
              th, td {
                  border: 1px solid #4f4f6e;
                  padding: 8px 5px;
                  text-align: center;
                  min-width: 50px;
                  font-size: 0.85em;
              }
              th {
                  background-color: #3a3a52;
              }
              td.label-col {
                  font-weight: bold;
                  background-color: #3a3a52;
              }
              td.placeholder {
                  color: #777;
              }
              .legend {
                  margin-top: 15px;
                  display: flex;
                  justify-content: space-between;
                  font-size: 0.8em;
              }
              .legend span {
                  padding: 3px 8px;
                  border-radius: 3px;
              }
              .status-message {
                  margin-top: 15px;
                  padding: 10px;
                  background-color: #3a3a52;
                  border-radius: 4px;
                  text-align: center;
                  display: none;
              }
              .loader {
                  border: 3px solid #f3f3f330;
                  border-top: 3px solid #8888ff;
                  border-radius: 50%;
                  width: 16px;
                  height: 16px;
                  animation: spin 1s linear infinite;
                  display: inline-block;
                  margin-left: 8px;
                  vertical-align: middle;
              }
              @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>你的API快不快？测测看</h1>

              <div class="controls">
                  <div class="input-group">
                      <input type="text" id="apiUrl" placeholder="https://api.openai.com/v1/chat/completions" value="https://api.openai.com/v1/chat/completions">
                  </div>
                  <div class="input-group">
                      <input type="text" id="modelName" placeholder="请输入模型名称 (如: gpt-3.5-turbo)">
                      <input type="password" id="apiToken" placeholder="请输入 API Token (可选)">
                  </div>
                  <div class="input-group">
                      <button id="testButton" class="test-button">测速</button>
                      <!-- Changed shareButton to screenshotButton -->
                      <button id="screenshotButton" class="screenshot-button">截图结果并下载</button>
                  </div>
                  <div class="description">
                      本工具可测试你的 LLM 接口速度和延迟，分别测量吞吐量 (tokens/sec) 和首 token 响应时间 (平均延迟)，支持多种输入输出 token 组合。输入接口地址和 (可选) API Token，点击“测速”即可。
                  </div>
              </div>

              <div id="statusMessage" class="status-message"></div>

              <!-- Added ID to the results grid container -->
              <div id="resultsContainer" class="results-grid">
                  <div class="grid-section">
                      <h2>性能图</h2>
                      <p class="subtitle">吞吐量 (每秒 token 数) - 数值越高越好</p>
                      <table id="throughputTable"></table>
                      <div class="legend">
                          <span style="background: linear-gradient(90deg, #ff6b6b, #ffd166, #90ee90);">低        中        高</span>
                      </div>
                  </div>
                  <div class="grid-section">
                      <h2>第一个token等待时间 (平均)</h2>
                      <p class="subtitle">平均延迟 (秒, 越低越好)</p>
                      <table id="latencyTable"></table>
                      <div class="legend">
                           <span style="background: linear-gradient(90deg, #90ee90, #ffd166, #ff6b6b);">低        中        高</span>
                      </div>
                  </div>
              </div>
          </div>

          <script>
              // Ensure html2canvas is loaded before assigning to window for global access if needed,
              // but direct usage is fine here.
              // window.html2canvas = html2canvas; // Usually not necessary if used within this script block

              const INPUT_TOKEN_SIZES = [128, 256, 512, 1024, 2048];
              const OUTPUT_TOKEN_SIZES = [128, 256, 512, 1024, 2048];
              const NUM_RUNS_PER_CELL = 3;

              const apiUrlInput = document.getElementById('apiUrl');
              const modelNameInput = document.getElementById('modelName');
              const apiTokenInput = document.getElementById('apiToken');
              const testButton = document.getElementById('testButton');
              const statusMessage = document.getElementById('statusMessage');
              const throughputTable = document.getElementById('throughputTable');
              const latencyTable = document.getElementById('latencyTable');
              const screenshotButton = document.getElementById('screenshotButton'); // Get the new button
              const resultsContainer = document.getElementById('resultsContainer'); // Get the container to screenshot

              function generateDummyText(numTokens) {
                  const charsPerToken = 4;
                  const targetChars = numTokens * charsPerToken;
                  const baseText = "Lorem ipsum dolor sit amet. ";
                  let text = "";
                  while (text.length < targetChars) {
                      text += baseText;
                  }
                  return text.substring(0, targetChars);
              }

              function createTable(tableElement, valueSuffix = "", higherIsBetter = true) {
                  tableElement.innerHTML = ''; 
                  let header = '<tr><th>Input Tokens \ Output Tokens</th>';
                  OUTPUT_TOKEN_SIZES.forEach(outSize => header += \`<th>\${outSize}</th>\`);
                  header += '</tr>';
                  tableElement.innerHTML += header;

                  INPUT_TOKEN_SIZES.forEach(inSize => {
                      let row = \`<tr><td class="label-col">\${inSize}</td>\`;
                      OUTPUT_TOKEN_SIZES.forEach(outSize => {
                          row += \`<td id="cell-\${tableElement.id}-\${inSize}-\${outSize}" class="placeholder">-</td>\`;
                      });
                      row += '</tr>';
                      tableElement.innerHTML += row;
                  });
              }

              function updateCell(tableId, inTokens, outTokens, value, unit = "", higherIsBetter = true, error = false) {
                  const cell = document.getElementById(\`cell-\${tableId}-\${inTokens}-\${outTokens}\`);
                  if (!cell) return;

                  if (error) {
                      cell.textContent = "Error";
                      cell.style.backgroundColor = "#800000"; 
                      cell.classList.remove('placeholder');
                      return;
                  }

                  if (value === null || isNaN(value)) {
                      cell.textContent = "-";
                      cell.style.backgroundColor = "";
                      cell.classList.add('placeholder');
                  } else {
                      cell.textContent = \`\${value.toFixed(2)}\${unit}\`;
                      cell.style.backgroundColor = getColorForValue(value, tableId === 'throughputTable', higherIsBetter);
                      cell.classList.remove('placeholder');
                  }
              }
              
              let observedMinThroughput = Infinity, observedMaxThroughput = -Infinity;
              let observedMinLatency = Infinity, observedMaxLatency = -Infinity;

              function updateObservedRanges(value, isThroughput) {
                  if (value === null || isNaN(value) || !isFinite(value)) return;
                  if (isThroughput) {
                      observedMinThroughput = Math.min(observedMinThroughput, value);
                      observedMaxThroughput = Math.max(observedMaxThroughput, value);
                  } else {
                      observedMinLatency = Math.min(observedMinLatency, value);
                      observedMaxLatency = Math.max(observedMaxLatency, value);
                  }
              }

              function getColorForValue(value, isThroughput, higherIsBetter) {
                  if (value === null || isNaN(value) || !isFinite(value)) return '#3a3a52'; 

                  let minVal, maxVal;
                  if (isThroughput) {
                      minVal = observedMinThroughput === Infinity ? 0 : observedMinThroughput;
                      maxVal = observedMaxThroughput === -Infinity ? value * 2 || 100 : observedMaxThroughput;
                  } else {
                      minVal = observedMinLatency === Infinity ? 0 : observedMinLatency;
                      maxVal = observedMaxLatency === -Infinity ? value * 2 || 5 : observedMaxLatency;
                  }
                  
                  if (maxVal === minVal) maxVal = minVal + 1; 

                  let percent = (value - minVal) / (maxVal - minVal);
                  percent = Math.max(0, Math.min(1, percent)); 

                  if (!higherIsBetter) {
                      percent = 1 - percent; 
                  }
                  const hue = percent * 120; 
                  return \`hsl(\${hue}, 60%, 40%)\`;
              }

              async function testApiEndpoint(apiUrl, modelName, apiToken, inTokens, outTokens) {
                  const promptText = generateDummyText(inTokens);
                  const headers = {
                      'Content-Type': 'application/json',
                  };
                  if (apiToken) {
                      headers['Authorization'] = \`Bearer \${apiToken}\`;
                  }

                  const body = JSON.stringify({
                      model: modelName,
                      messages: [{ role: 'user', content: promptText }],
                      max_tokens: outTokens,
                      stream: true
                  });

                  let latencies = [];
                  let throughputs = [];
                  let errorOccurred = false;

                  for (let i = 0; i < NUM_RUNS_PER_CELL; i++) {
                      try {
                          const startTime = performance.now();
                          let firstTokenTime = -1;
                          let totalCharsReceived = 0;

                          const response = await fetch(apiUrl, { method: 'POST', headers, body });

                          if (!response.ok) {
                              console.error(\`API Error (\${response.status}): \${await response.text()}\`);
                              errorOccurred = true;
                              break; 
                          }
                          if (!response.body) {
                              console.error('Response body is not readable (not a stream).');
                              errorOccurred = true;
                              break;
                          }

                          const reader = response.body.getReader();
                          const decoder = new TextDecoder();
                          let buffer = '';
                          
                          while (true) {
                              const { value, done } = await reader.read();
                              if (done) break;

                              if (firstTokenTime === -1 && value && value.length > 0) {
                                  firstTokenTime = performance.now();
                              }
                              
                              buffer += decoder.decode(value, { stream: true });
                              let lines = buffer.split('\\n\\n');
                              buffer = lines.pop() || ''; 

                              for (const line of lines) {
                                  if (line.startsWith('data: ')) {
                                      const jsonData = line.substring(6);
                                      if (jsonData.trim() === '[DONE]') continue;
                                      try {
                                          const parsed = JSON.parse(jsonData);
                                          if (parsed.choices && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                                              totalCharsReceived += parsed.choices[0].delta.content.length;
                                          }
                                      } catch (e) {
                                          // console.warn("Failed to parse stream chunk:", jsonData, e);
                                      }
                                  }
                              }
                          }
                           if (buffer.startsWith('data: ')) {
                               const jsonData = buffer.substring(6);
                               if (jsonData.trim() !== '[DONE]') {
                                   try {
                                       const parsed = JSON.parse(jsonData);
                                       if (parsed.choices && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                                           totalCharsReceived += parsed.choices[0].delta.content.length;
                                       }
                                   } catch (e) {/* ignore */}
                               }
                          }


                          const endTime = performance.now();

                          if (firstTokenTime !== -1) {
                              latencies.push((firstTokenTime - startTime) / 1000); 
                          } else {
                              latencies.push((endTime - startTime) / 1000);
                          }
                          
                          const durationSeconds = (endTime - startTime) / 1000;
                          const approxOutputTokens = totalCharsReceived / 4; 
                          if (durationSeconds > 0) {
                               throughputs.push(approxOutputTokens / durationSeconds); 
                          } else {
                               throughputs.push(0); 
                          }

                      } catch (err) {
                          console.error(\`Error during API call for \${inTokens}/\${outTokens}:\`, err);
                          errorOccurred = true;
                          break; 
                      }
                  }

                  if (errorOccurred) {
                      return { latency: null, throughput: null, error: true };
                  }

                  const avgLatency = latencies.length ? latencies.reduce((a, b) => a + b, 0) / latencies.length : null;
                  const avgThroughput = throughputs.length ? throughputs.reduce((a, b) => a + b, 0) / throughputs.length : null;
                  
                  return { latency: avgLatency, throughput: avgThroughput, error: false };
              }

              async function runAllTests() {
                  const apiUrl = apiUrlInput.value.trim();
                  const modelName = modelNameInput.value.trim();
                  const apiToken = apiTokenInput.value.trim();

                  if (!apiUrl || !modelName) {
                      statusMessage.textContent = "请输入 API 地址和模型名称。";
                      statusMessage.style.display = 'block';
                      statusMessage.style.backgroundColor = '#702020';
                      return;
                  }

                  testButton.disabled = true;
                  screenshotButton.disabled = true; // Disable screenshot button during test
                  testButton.innerHTML = '测试中... <span class="loader"></span>';
                  statusMessage.textContent = "测试正在进行中，请稍候...";
                  statusMessage.style.backgroundColor = '#3a3a52';
                  statusMessage.style.display = 'block';

                  observedMinThroughput = Infinity; observedMaxThroughput = -Infinity;
                  observedMinLatency = Infinity; observedMaxLatency = -Infinity;

                  const resultsCache = [];
                  let totalTests = INPUT_TOKEN_SIZES.length * OUTPUT_TOKEN_SIZES.length;
                  let testsCompleted = 0;

                  for (const inTokens of INPUT_TOKEN_SIZES) {
                      for (const outTokens of OUTPUT_TOKEN_SIZES) {
                          const throughputCell = document.getElementById(\`cell-throughputTable-\${inTokens}-\${outTokens}\`);
                          if (throughputCell) throughputCell.innerHTML = '<span class="loader"></span>';
                          const latencyCell = document.getElementById(\`cell-latencyTable-\${inTokens}-\${outTokens}\`);
                          if (latencyCell) latencyCell.innerHTML = '<span class="loader"></span>';
                      }
                  }
                  
                  for (const inTokens of INPUT_TOKEN_SIZES) {
                      for (const outTokens of OUTPUT_TOKEN_SIZES) {
                          statusMessage.textContent = \`测试中: \${inTokens} 输入 / \${outTokens} 输出 (\${Math.round(testsCompleted/totalTests*100)}%)\`;
                          const result = await testApiEndpoint(apiUrl, modelName, apiToken, inTokens, outTokens);
                          resultsCache.push({ inTokens, outTokens, ...result });
                          updateObservedRanges(result.throughput, true);
                          updateObservedRanges(result.latency, false);
                          testsCompleted++;
                      }
                  }
                  
                  statusMessage.textContent = "正在更新表格...";
                  resultsCache.forEach(res => {
                      updateCell('throughputTable', res.inTokens, res.outTokens, res.throughput, " t/s", true, res.error);
                      updateCell('latencyTable', res.inTokens, res.outTokens, res.latency, " s", false, res.error);
                  });

                  testButton.disabled = false;
                  screenshotButton.disabled = false; // Re-enable screenshot button
                  testButton.innerHTML = '测速';
                  statusMessage.textContent = "测试完成！";
                  statusMessage.style.backgroundColor = '#28a745';
                   setTimeout(() => { statusMessage.style.display = 'none'; }, 5000);
              }

              function captureAndDownloadResults() {
                  if (!resultsContainer || typeof html2canvas === 'undefined') {
                      alert('无法截图，截图组件未加载或结果区域不存在。');
                      return;
                  }
                  statusMessage.textContent = "正在生成截图...";
                  statusMessage.style.display = 'block';
                  statusMessage.style.backgroundColor = '#3a3a52';

                  html2canvas(resultsContainer, { 
                      backgroundColor: '#1e1e2f', // Match body background for consistency
                      useCORS: true // If you have external images/fonts, though not in this case
                  }).then(canvas => {
                      const link = document.createElement('a');
                      link.download = 'llm-test-results.png';
                      link.href = canvas.toDataURL('image/png');
                      link.click();
                      statusMessage.textContent = "截图已下载！";
                      statusMessage.style.backgroundColor = '#28a745';
                      setTimeout(() => { statusMessage.style.display = 'none'; }, 3000);
                  }).catch(err => {
                      console.error("截图失败:", err);
                      alert("截图失败，请查看控制台获取更多信息。");
                      statusMessage.textContent = "截图失败！";
                      statusMessage.style.backgroundColor = '#702020';
                      setTimeout(() => { statusMessage.style.display = 'none'; }, 3000);
                  });
              }

              document.addEventListener('DOMContentLoaded', () => {
                  createTable(throughputTable, " t/s", true);
                  createTable(latencyTable, " s", false);
                  testButton.addEventListener('click', runAllTests);
                  screenshotButton.addEventListener('click', captureAndDownloadResults); // Attach event to new button
              });
          <\/script> 
          </body>
          </html>
      `;

      return new Response(htmlContent, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      });

    } else {
      return new Response('Not Found. Access the root path to use the tool.', { status: 404 });
    }
  }
};
