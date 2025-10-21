document.getElementById('app').innerHTML = `
    <h2>Description of the Project</h2>
    <ul>
      <li>Data cleaning and preprocessing</li>
      <li>Feature engineering and encoding</li>
      <li>Model training with neural networks (MLP)</li>
      <li>Interactive ROI prediction widget (in Colab)</li>
    </ul>
    <p>
      See the <a href="README.md" target="_blank">README.md</a> for full details.<br>
      Launch the full interactive demo in Google Colab above.
    </p>
`;
document.getElementById('roi-demo').innerHTML = `
    <form id="roi-form">
        <label>Duration (days): <input type="range" id="duration" min="1" max="30" value="14" oninput="durationVal.value=this.value"><output id="durationVal">14</output></label><br>
        <label>Conversion Rate: <input type="range" step="0.01" id="conversion" min="0.01" max="0.3" value="0.15" oninput="convVal.value=this.value"><output id="convVal">0.15</output></label><br>
        <label>Acquisition Cost: <input type="range" id="acquisition" min="100" max="3000" value="1050" oninput="acqVal.value=this.value"><output id="acqVal">1050</output></label><br>
        <label>Engagement Score: <input type="range" id="engagement" min="1" max="10" value="5" oninput="engVal.value=this.value"><output id="engVal">5</output></label><br>
        <label>Channel: 
            <select id="channel">
                <option>Facebook</option>
                <option>Instagram</option>
                <option>Twitter</option>
                <option>LinkedIn</option>
            </select>
        </label>
        <label>Audience: 
            <select id="audience">
                <option>All Ages</option>
                <option>18-35</option>
                <option>36-50</option>
            </select>
        </label>
        <br><button type="submit" class="btn">Calculate ROI</button>
    </form>
    <div id="roi-result" style="margin-top:16px;font-size:1.3em;font-weight:bold;"></div>
`;

document.getElementById('roi-form').onsubmit = function(e){
    e.preventDefault();
    // "Фейковая" формула для примера (адаптируй по желанию)
    const duration = Number(document.getElementById('duration').value);
    const conversion = Number(document.getElementById('conversion').value);
    const acquisition = Number(document.getElementById('acquisition').value);
    const engagement = Number(document.getElementById('engagement').value);
    const channel = document.getElementById('channel').value;
    const channelMultiplier = channel === 'Instagram' ? 1.15 : (channel === 'Facebook' ? 1.05 : 0.93);
    const roi = Math.max(0, (conversion * engagement * duration * channelMultiplier * 1000 / (acquisition+1500)).toFixed(2));
    document.getElementById('roi-result').innerHTML = `Predicted ROI: <span style="color:#256ee7">${roi}</span>`;
}
