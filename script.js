let llnChart = null;
let cltChart = null;
let donskerChart = null;

function generaRademacher() {
  return Math.random() < 0.5 ? -1 : 1;
}

function generaNormaleStandard() {

  let u1 = Math.random();
  let u2 = Math.random();

  if (u1 === 0) {
    u1 = 0.000001;
  }

  return Math.sqrt(-2 * Math.log(u1)) *
         Math.cos(2 * Math.PI * u2);
}

// ===========================
// LLN
// ===========================

function simulaLLN() {

  const n = 1000;

  let somma = 0;

  const mediaEmpirica = [];
  const labels = [];

  for (let i = 1; i <= n; i++) {

    const x = Math.random();

    somma += x;

    mediaEmpirica.push(somma / i);

    labels.push(i);
  }

  const ctx = document
    .getElementById("llnChart")
    .getContext("2d");

  if (llnChart !== null) {
    llnChart.destroy();
  }

  llnChart = new Chart(ctx, {

    type: "line",

    data: {

      labels: labels,

      datasets: [

        {
          label: "Media empirica",

          data: mediaEmpirica,

          borderWidth: 2,
          pointRadius: 0,
          fill: false
        },

        {
          label: "Valore atteso = 0.5",

          data: Array(n).fill(0.5),

          borderWidth: 2,
          pointRadius: 0,
          fill: false
        }
      ]
    },

    options: {

      responsive: true,

      plugins: {

        title: {
          display: true,
          text: "Law of Large Numbers"
        }
      }
    }
  });
}

// ===========================
// CLT
// ===========================

function simulaCLT() {

  const numSamples = 5000;
  const sampleSize = 30;

  const valori = [];

  for (let i = 0; i < numSamples; i++) {

    let somma = 0;

    for (let j = 0; j < sampleSize; j++) {

      somma += Math.random();
    }

    const media = somma / sampleSize;

    const normalizzato =
      (media - 0.5) /
      Math.sqrt(1 / (12 * sampleSize));

    valori.push(normalizzato);
  }

  const bins = 30;

  const min = -4;
  const max = 4;

  const width = (max - min) / bins;

  const hist = Array(bins).fill(0);

  valori.forEach(v => {

    const idx = Math.floor((v - min) / width);

    if (idx >= 0 && idx < bins) {
      hist[idx]++;
    }
  });

  const labels = [];

  for (let i = 0; i < bins; i++) {

    labels.push(
      (min + i * width).toFixed(1)
    );
  }

  const ctx = document
    .getElementById("cltChart")
    .getContext("2d");

  if (cltChart !== null) {
    cltChart.destroy();
  }

  cltChart = new Chart(ctx, {

    type: "bar",

    data: {

      labels: labels,

      datasets: [

        {
          label: "Distribuzione normalizzata",

          data: hist
        }
      ]
    },

    options: {

      responsive: true,

      plugins: {

        title: {
          display: true,
          text: "Central Limit Theorem"
        }
      }
    }
  });
}

// ===========================
// DONSKER / WIENER
// ===========================

function costruisciProcessoScalato(T, n) {

  const punti = [];

  let somma = 0;

  punti.push({ x: 0, y: 0 });

  for (let k = 1; k <= n; k++) {

    somma += generaRademacher();

    const t = k * T / n;

    punti.push({

      x: t,

      y: somma / Math.sqrt(n)
    });
  }

  return punti;
}

function simulaDonsker() {

  const T = 1;

  const nValues = [50, 200, 1000];

  const datasets = nValues.map(n => {

    return {

      label: "n = " + n,

      data: costruisciProcessoScalato(T, n),

      borderWidth: 2,
      pointRadius: 0,
      fill: false,
      parsing: false
    };
  });

  const ctx = document
    .getElementById("donskerChart")
    .getContext("2d");

  if (donskerChart !== null) {
    donskerChart.destroy();
  }

  donskerChart = new Chart(ctx, {

    type: "line",

    data: {

      datasets: datasets
    },

    options: {

      responsive: true,

      parsing: false,

      plugins: {

        title: {
          display: true,
          text: "Donsker Invariance Principle"
        }
      },

      scales: {

        x: {

          type: "linear",

          title: {
            display: true,
            text: "Tempo t"
          }
        },

        y: {

          title: {
            display: true,
            text: "W_n(t)"
          }
        }
      }
    }
  });
}

simulaLLN();
simulaCLT();
simulaDonsker();
