document.getElementById('roi-demo').innerHTML = `
    <form id="roi-form" autocomplete="off">
        <label>Duration (days): 
            <input type="range" id="duration" min="1" max="30" value="14" oninput="durationVal.value=this.value">
            <output id="durationVal">14</output>
        </label><br>
        <label>Conversion Rate: 
            <input type="range" step="0.01" id="conversion" min="0.01" max="0.3" value="0.15" oninput="convVal.value=this.value">
            <output id="convVal">0.15</output>
        </label><br>
        <label>Acquisition Cost: 
            <input type="range" id="acquisition" min="100" max="3000" value="1050" oninput="acqVal.value=this.value">
            <output id="acqVal">1050</output>
        </label><br>
        <label>Engagement Score: 
            <input type="range" id="engagement" min="1" max="10" value="5" oninput="engVal.value=this.value">
            <output id="engVal">5</output>
        </label><br>
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
        <br>
    </form>
    <div id="roi-result" style="margin:20px 0 10px 2px;font-size:1.24em;font-weight:bold;"></div>
    <div id="roi-comment" style="font-size:1.04em;color:#174;"></div>
`;

function calcROI() {
    const duration = Number(document.getElementById('duration').value);
    const conversion = Number(document.getElementById('conversion').value);
    const acquisition = Number(document.getElementById('acquisition').value);
    const engagement = Number(document.getElementById('engagement').value);
    const channel = document.getElementById('channel').value;
    let multiplier = 1;
    if (channel === "Instagram") multiplier = 1.18;
    if (channel === "Facebook") multiplier = 1.08;
    if (channel === "Twitter") multiplier = 0.97;
    if (channel === "LinkedIn") multiplier = 0.88;

    const roi = Math.max(0, (conversion * engagement * duration * multiplier * 850 / (acquisition + 900)).toFixed(2));
    return roi;
}
function updateROI() {
    const roi = calcROI();
    let color = "#256ee7";
    let comment = "";
    if (roi >= 3) { color = "#209b4e"; comment = "Excellent ROI! 🚀"; }
    else if (roi >= 1) { color = "#b6a619"; comment = "Average ROI (consider optimizing)"; }
    else { color = "#be2d2d"; comment = "Low ROI: adjust parameters!"; }

    document.getElementById('roi-result').innerHTML = `Predicted ROI: <span style="color:${color}">${roi}</span>`;
    document.getElementById('roi-comment').innerHTML = comment;
}
["duration","conversion","acquisition","engagement","channel","audience"].forEach(id=>{
    document.getElementById(id).addEventListener('input',updateROI);
});
updateROI();
options: {
  elements: {
    bar: { borderRadius: 12 }
  },
  // (остальные опции)
}
options: {
  animation: {
    duration: 1700,
    easing: 'easeOutElastic'
  },
  //...
}
plugins: {
  datalabels: {
    anchor: 'end',
    align: 'end',
    color: '#256ee7',
    font: { weight: 'bold', size: 16 }
  }
}
backgroundColor: [
  'rgba(37,110,231, 0.75)',    // синий-фиолетовый
  'rgba(68,196,161, 0.68)',    // зелёно-бирюзовый
  'rgba(243,165,50, 0.72)',    // солнечно-жёлтый
  'rgba(255,187,104, 0.65)',   // мягкий оранжевый
  'rgba(168,144,253, 0.68)'    // светло-фиолетовый
]
