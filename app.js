// Вставляем HTML калькулятора в контейнер
document.getElementById('roi-demo').innerHTML = `
  <form id="roi-form" autocomplete="off">
    <label>Duration (days): <input type="range" id="duration" min="1" max="30" value="14" oninput="durationVal.value=this.value">
      <output id="durationVal">14</output>
    </label>
    <label>Conversion Rate: <input type="range" step="0.01" id="conversion" min="0.01" max="0.3" value="0.15" oninput="convVal.value=this.value">
      <output id="convVal">0.15</output>
    </label>
    <label>Acquisition Cost: <input type="range" id="acquisition" min="100" max="3000" value="1050" oninput="acqVal.value=this.value">
      <output id="acqVal">1050</output>
    </label>
    <label>Engagement Score: <input type="range" id="engagement" min="1" max="10" value="5" oninput="engVal.value=this.value">
      <output id="engVal">5</output>
    </label>
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
  </form>
  <div id="roi-result" style="margin:20px 0 10px 2px;font-size:1.24em;font-weight:bold;"></div>
  <div id="roi-comment" style="font-size:1.04em;color:#174;"></div>
`;

// Получаем элементы после вставки
const duration = document.getElementById('duration');
const conversion = document.getElementById('conversion');
const acquisition = document.getElementById('acquisition');
const engagement = document.getElementById('engagement');
const channel = document.getElementById('channel');
const audience = document.getElementById('audience');
const roiResult = document.getElementById('roi-result');
const roiComment = document.getElementById('roi-comment');

// Функция расчёта ROI
function calcROI() {
  let multiplier = 1;
  if (channel.value === "Instagram") multiplier = 1.18;
  else if (channel.value === "Facebook") multiplier = 1.08;
  else if (channel.value === "Twitter") multiplier = 0.97;
  else if (channel.value === "LinkedIn") multiplier = 0.88;

  const roi = Math.max(0, (conversion.value * engagement.value * duration.value * multiplier * 850 / (Number(acquisition.value) + 900)).toFixed(2));

  // Определяем цвет и текст оценки
  let color = "#256ee7";
  let comment = "";
  if (roi >= 3) {
    color = "#209b4e";
    comment = "Excellent ROI! 🚀";
  } else if (roi >= 1) {
    color = "#b6a619";
    comment = "Average ROI (consider optimizing)";
  } else {
    color = "#be2d2d";
    comment = "Low ROI: adjust parameters!";
  }

  // Обновляем отображение результата
  roiResult.innerHTML = `Predicted ROI: <span style="color:${color}">${roi}</span>`;
  roiComment.innerHTML = comment;
}

// Навешиваем события на все поля и селекты
["duration","conversion","acquisition","engagement","channel","audience"].forEach(id => {
  document.getElementById(id).addEventListener('input', calcROI);
});

// Запускаем первый расчет при загрузке
calcROI();

const trainLoss = [
  5.26,4.06,4.09,4.05,4.02,4.03,4.04,3.99,3.99,4.02,3.99,4.00,3.97,4.00,3.98,
  3.96,3.93,3.94,3.97,3.92,3.94,3.93,3.94,3.94,3.91,3.91,3.94,3.93,3.92,3.90
];
const valLoss = [
  4.16,4.14,4.11,4.10,4.13,4.12,4.10,4.09,4.10,4.12,
  4.13,4.11,4.14,4.12,4.13,4.14,4.13,4.13,4.13,4.15,
  4.16,4.15,4.16,4.15,4.19,4.17,4.19,4.18,4.18,4.18
];
const valMAE = [
  1.61,1.60,1.60,1.60,1.61,1.60,1.60,1.60,1.60,1.60,1.60,1.60,1.60,1.60,1.60,
  1.60,1.60,1.60,1.60,1.60,1.60,1.60,1.60,1.60,1.62,1.61,1.61,1.61,1.61,1.61
];

let trainEpoch = 0;
let interval = null;
let chart = null;

function updatePanel() {
  document.getElementById('epoch-val').textContent = trainEpoch === 0 ? 0 : trainEpoch;
  document.getElementById('loss-val').textContent = trainEpoch === 0 ? '—' : trainLoss[trainEpoch-1].toFixed(2);
  document.getElementById('val-loss-val').textContent = trainEpoch === 0 ? '—' : valLoss[trainEpoch-1].toFixed(2);
  document.getElementById('mae-val').textContent = trainEpoch === 0 ? '—' : valMAE[trainEpoch-1].toFixed(2);

  var progress = Math.round((trainEpoch / trainLoss.length) * 100);
  document.getElementById('progress-inner').style.width = progress + "%";
  document.getElementById('progress-inner').textContent = progress + "%";
  document.getElementById('status-message').textContent =
    trainEpoch === trainLoss.length ? "Model ready! You can now predict ROI." :
    trainEpoch === 0 ? "Model not trained. Click 'Train Model' to start!" : "Training model (" + progress + "%)...";
}

function drawChart(epoch) {
  if(chart) chart.destroy();
  chart = new Chart(document.getElementById('live-loss-chart').getContext('2d'), {
    type: 'line',
    data: {
      labels: Array.from({length: epoch}, (_,i) => i+1),
      datasets: [{
        label: 'Training Loss', data: trainLoss.slice(0,epoch),
        borderColor: '#256ee7', fill: false, tension:0.1
      },{
        label: 'Validation Loss', data: valLoss.slice(0,epoch),
        borderColor: '#44c4a1', fill: false, tension:0.1
      }]
    },
    options: {
      animation: {duration: 500},
      plugins: {legend: {position:'top'}, title: {display:true,text:'Step-by-Step Training'}},
      scales: { x:{title:{display:true,text:'Epoch'}},y:{beginAtZero:false,title:{display:true,text:'Loss'}} }
    }
  });
}

document.getElementById('train-model-btn').onclick = function() {
  if(trainEpoch === trainLoss.length) return;
  interval = setInterval(() => {
    if(trainEpoch < trainLoss.length) {
      trainEpoch++;
      updatePanel(); drawChart(trainEpoch);
    } else { clearInterval(interval); }
  }, 500);
};
document.getElementById('reset-model-btn').onclick = function() {
  trainEpoch = 0; updatePanel(); drawChart(trainEpoch); clearInterval(interval);
};

// Первый запуск
updatePanel(); drawChart(trainEpoch);
