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

const ctxLoss = document.getElementById('ml-loss-chart').getContext('2d');
new Chart(ctxLoss, {
  type: 'line',
  data: {
    labels: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30
    ],
    datasets: [
      {
        label: 'Training Loss',
        data: [
          5.2612, 4.0602, 4.0910, 4.0499, 4.0179, 4.0298, 4.0440, 3.9966, 3.9950, 4.0171,
          3.9918, 3.9968, 3.9735, 4.0046, 3.9782, 3.9604, 3.9322, 3.9441, 3.9709, 3.9215,
          3.9483, 3.9300, 3.9385, 3.9387, 3.9125, 3.9132, 3.9371, 3.9307, 3.9238, 3.9036
        ],
        borderColor: '#256ee7',
        backgroundColor: '#256ee7',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Validation Loss',
        data: [
          4.1567, 4.1377, 4.1106, 4.0990, 4.1302, 4.1186, 4.1006, 4.0925, 4.1034, 4.1176,
          4.1278, 4.1142, 4.1388, 4.1200, 4.1337, 4.1356, 4.1294, 4.1288, 4.1339, 4.1499,
          4.1605, 4.1498, 4.1560, 4.1483, 4.1921, 4.1676, 4.1895, 4.1751, 4.1821, 4.1834
        ],
        borderColor: '#44c4a1',
        backgroundColor: '#44c4a1',
        fill: false,
        tension: 0.1
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Model Training: Loss by Epoch' }
    },
    scales: {
      x: { title: { display: true, text: 'Epoch' } },
      y: { title: { display: true, text: 'Loss' }, beginAtZero: false }
    }
  }
});
