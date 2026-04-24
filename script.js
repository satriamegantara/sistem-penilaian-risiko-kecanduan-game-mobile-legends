const STORAGE_KEYS = {
  draft: "ml-risk-draft",
  history: "ml-risk-history",
};

const UI = {
  sections: {
    welcome: document.getElementById("welcome"),
    assessment: document.getElementById("assessment"),
    processing: document.getElementById("processing"),
    result: document.getElementById("result"),
    history: document.getElementById("history"),
  },
  startBtn: document.getElementById("startBtn"),
  form: document.getElementById("assessmentForm"),
  resetInputBtn: document.getElementById("resetInputBtn"),
  retryBtn: document.getElementById("retryBtn"),
  shareBtn: document.getElementById("shareBtn"),
  clearHistoryBtn: document.getElementById("clearHistoryBtn"),
  processingHint: document.getElementById("processingHint"),
  progressBar: document.getElementById("progressBar"),
  progressText: document.getElementById("progressText"),
  resultDate: document.getElementById("resultDate"),
  scoreValue: document.getElementById("scoreValue"),
  riskCategory: document.getElementById("riskCategory"),
  meterFill: document.getElementById("meterFill"),
  factorBars: document.getElementById("factorBars"),
  topRules: document.getElementById("topRules"),
  recommendations: document.getElementById("recommendations"),
  historyList: document.getElementById("historyList"),
  inputs: {
    durasi: document.getElementById("durasi"),
    frekuensi: document.getElementById("frekuensi"),
    pengeluaran: document.getElementById("pengeluaran"),
    emosi: document.getElementById("emosi"),
    dampak: document.getElementById("dampak"),
  },
  valueBadges: {
    durasi: document.getElementById("durasiValue"),
    frekuensi: document.getElementById("frekuensiValue"),
    pengeluaran: document.getElementById("pengeluaranValue"),
    emosi: document.getElementById("emosiValue"),
    dampak: document.getElementById("dampakValue"),
  },
  labels: {
    durasi: document.getElementById("durasiLabel"),
    frekuensi: document.getElementById("frekuensiLabel"),
    pengeluaran: document.getElementById("pengeluaranLabel"),
    emosi: document.getElementById("emosiLabel"),
    dampak: document.getElementById("dampakLabel"),
  },
};

const membershipDefs = {
  durasi: {
    low: (x) => trap(x, 0, 0, 1.5, 2.5),
    medium: (x) => tri(x, 2, 3.5, 5),
    high: (x) => tri(x, 4.5, 5.5, 6.8),
    veryHigh: (x) => trap(x, 6, 7, 10, 10),
  },
  frekuensi: {
    rare: (x) => trap(x, 1, 1, 2, 3),
    regular: (x) => tri(x, 2, 3.5, 5),
    frequent: (x) => tri(x, 4, 5.5, 7),
    everyday: (x) => trap(x, 6, 6.6, 7, 7),
  },
  pengeluaran: {
    none: (x) => trap(x, 0, 0, 10, 35),
    low: (x) => tri(x, 15, 50, 90),
    medium: (x) => tri(x, 70, 160, 250),
    high: (x) => trap(x, 220, 300, 500, 500),
  },
  emosi: {
    calm: (x) => trap(x, 1, 1, 2.5, 4),
    neutral: (x) => tri(x, 3, 5, 7),
    agitated: (x) => tri(x, 6.5, 7.8, 9),
    veryAgitated: (x) => trap(x, 8.5, 9.2, 10, 10),
  },
  dampak: {
    noImpact: (x) => trap(x, 1, 1, 2, 3),
    minor: (x) => tri(x, 2.5, 4, 5),
    moderate: (x) => tri(x, 4.5, 5.8, 7),
    severe: (x) => trap(x, 6.5, 7.5, 10, 10),
  },
};

const outputTerms = {
  rendah: (x) => trap(x, 0, 0, 20, 35),
  sedang: (x) => tri(x, 28, 45, 62),
  tinggi: (x) => tri(x, 58, 72, 86),
  sangatTinggi: (x) => trap(x, 80, 88, 100, 100),
};

const rules = [
  {
    id: "R1",
    description:
      "Jika durasi tinggi dan frekuensi setiap hari maka risiko tinggi",
    antecedents: [
      { variable: "durasi", term: "high" },
      { variable: "frekuensi", term: "everyday" },
    ],
    consequent: "tinggi",
    weight: 0.9,
  },
  {
    id: "R2",
    description: "Jika durasi sangat tinggi maka risiko sangat tinggi",
    antecedents: [{ variable: "durasi", term: "veryHigh" }],
    consequent: "sangatTinggi",
    weight: 1,
  },
  {
    id: "R3",
    description:
      "Jika frekuensi sering dan pengeluaran medium maka risiko tinggi",
    antecedents: [
      { variable: "frekuensi", term: "frequent" },
      { variable: "pengeluaran", term: "medium" },
    ],
    consequent: "tinggi",
    weight: 0.86,
  },
  {
    id: "R4",
    description: "Jika emosi agitated dan dampak moderate maka risiko tinggi",
    antecedents: [
      { variable: "emosi", term: "agitated" },
      { variable: "dampak", term: "moderate" },
    ],
    consequent: "tinggi",
    weight: 0.88,
  },
  {
    id: "R5",
    description: "Jika emosi sangat agitated maka risiko sangat tinggi",
    antecedents: [{ variable: "emosi", term: "veryAgitated" }],
    consequent: "sangatTinggi",
    weight: 0.97,
  },
  {
    id: "R6",
    description: "Jika dampak severe maka risiko sangat tinggi",
    antecedents: [{ variable: "dampak", term: "severe" }],
    consequent: "sangatTinggi",
    weight: 0.98,
  },
  {
    id: "R7",
    description: "Jika durasi medium dan frekuensi regular maka risiko sedang",
    antecedents: [
      { variable: "durasi", term: "medium" },
      { variable: "frekuensi", term: "regular" },
    ],
    consequent: "sedang",
    weight: 0.78,
  },
  {
    id: "R8",
    description:
      "Jika pengeluaran rendah dan frekuensi jarang maka risiko rendah",
    antecedents: [
      { variable: "pengeluaran", term: "low" },
      { variable: "frekuensi", term: "rare" },
    ],
    consequent: "rendah",
    weight: 0.72,
  },
  {
    id: "R9",
    description: "Jika dampak no impact dan emosi calm maka risiko rendah",
    antecedents: [
      { variable: "dampak", term: "noImpact" },
      { variable: "emosi", term: "calm" },
    ],
    consequent: "rendah",
    weight: 0.85,
  },
  {
    id: "R10",
    description:
      "Jika pengeluaran tinggi dan frekuensi sering maka risiko sangat tinggi",
    antecedents: [
      { variable: "pengeluaran", term: "high" },
      { variable: "frekuensi", term: "frequent" },
    ],
    consequent: "sangatTinggi",
    weight: 0.91,
  },
  {
    id: "R11",
    description: "Jika durasi low dan frekuensi rare maka risiko rendah",
    antecedents: [
      { variable: "durasi", term: "low" },
      { variable: "frekuensi", term: "rare" },
    ],
    consequent: "rendah",
    weight: 0.8,
  },
  {
    id: "R12",
    description: "Jika durasi high dan dampak moderate maka risiko tinggi",
    antecedents: [
      { variable: "durasi", term: "high" },
      { variable: "dampak", term: "moderate" },
    ],
    consequent: "tinggi",
    weight: 0.83,
  },
];

const ranges = {
  durasi: { max: 10, formatter: (v) => `${Number(v).toFixed(1)} jam/hari` },
  frekuensi: { max: 7, formatter: (v) => `${Math.round(v)} hari/minggu` },
  pengeluaran: { max: 500, formatter: (v) => `Rp${Math.round(v)}rb / bulan` },
  emosi: { max: 10, formatter: (v) => `${Math.round(v)} / 10` },
  dampak: { max: 10, formatter: (v) => `${Math.round(v)} / 10` },
};

const categoryMap = {
  durasi: [
    { label: "Low", test: (v) => v <= 2.5 },
    { label: "Medium", test: (v) => v <= 5 },
    { label: "High", test: (v) => v <= 6.8 },
    { label: "Very High", test: () => true },
  ],
  frekuensi: [
    { label: "Rare", test: (v) => v <= 2 },
    { label: "Regular", test: (v) => v <= 4 },
    { label: "Frequent", test: (v) => v <= 6 },
    { label: "Everyday", test: () => true },
  ],
  pengeluaran: [
    { label: "None", test: (v) => v <= 10 },
    { label: "Low", test: (v) => v <= 60 },
    { label: "Medium", test: (v) => v <= 220 },
    { label: "High", test: () => true },
  ],
  emosi: [
    { label: "Calm", test: (v) => v <= 3 },
    { label: "Neutral", test: (v) => v <= 6 },
    { label: "Agitated", test: (v) => v <= 8 },
    { label: "Very Agitated", test: () => true },
  ],
  dampak: [
    { label: "No Impact", test: (v) => v <= 2 },
    { label: "Minor", test: (v) => v <= 4 },
    { label: "Moderate", test: (v) => v <= 6 },
    { label: "Severe", test: () => true },
  ],
};

const recommendationsByCategory = {
  Rendah: [
    "Pertahankan pola bermain yang seimbang dengan rutinitas harian.",
    "Tetapkan batas main harian agar tetap konsisten.",
    "Lanjutkan aktivitas offline seperti olahraga atau belajar.",
  ],
  Sedang: [
    "Kurangi sesi bermain di hari kerja dan buat jadwal pasti.",
    "Batasi top up bulanan dengan nominal tetap.",
    "Gunakan alarm pengingat untuk berhenti bermain tepat waktu.",
  ],
  Tinggi: [
    "Lakukan game detox minimal 1-2 hari per minggu.",
    "Alihkan waktu prime time ke kegiatan sosial atau produktif.",
    "Diskusikan kebiasaan bermainmu dengan teman atau keluarga terdekat.",
  ],
  "Sangat Tinggi": [
    "Nonaktifkan notifikasi game dan batasi akses pada jam tertentu.",
    "Minta pendampingan orang terdekat untuk mengontrol waktu bermain.",
    "Pertimbangkan konsultasi profesional bila game sudah mengganggu fungsi harian.",
  ],
};

// Blended score dari engine ini cenderung konservatif, jadi hasil akhir
// dikalibrasi ke skala 0-100 agar input ekstrem benar-benar mencapai 100.
const SCORE_CALIBRATION_BASELINE = 77.4;
const SCORE_CALIBRATION_FACTOR = 100 / SCORE_CALIBRATION_BASELINE;

function isMaxInput(inputs) {
  return (
    inputs.durasi >= Number(UI.inputs.durasi.max) &&
    inputs.frekuensi >= Number(UI.inputs.frekuensi.max) &&
    inputs.pengeluaran >= Number(UI.inputs.pengeluaran.max) &&
    inputs.emosi >= Number(UI.inputs.emosi.max) &&
    inputs.dampak >= Number(UI.inputs.dampak.max)
  );
}

function tri(x, a, b, c) {
  if (x <= a || x >= c) {
    return 0;
  }
  if (x === b) {
    return 1;
  }
  if (x < b) {
    return (x - a) / (b - a);
  }
  return (c - x) / (c - b);
}

function trap(x, a, b, c, d) {
  if (a === b && x === a) {
    return 1;
  }
  if (c === d && x === d) {
    return 1;
  }
  if (x <= a || x >= d) {
    return 0;
  }
  if (x >= b && x <= c) {
    return 1;
  }
  if (x > a && x < b) {
    return (x - a) / (b - a || 1);
  }
  return (d - x) / (d - c || 1);
}

function getRiskCategory(score) {
  if (score <= 30) {
    return { key: "Rendah", className: "risk-low" };
  }
  if (score <= 60) {
    return { key: "Sedang", className: "risk-medium" };
  }
  if (score <= 80) {
    return { key: "Tinggi", className: "risk-high" };
  }
  return { key: "Sangat Tinggi", className: "risk-very-high" };
}

function getInputValues() {
  return {
    durasi: Number(UI.inputs.durasi.value),
    frekuensi: Number(UI.inputs.frekuensi.value),
    pengeluaran: Number(UI.inputs.pengeluaran.value),
    emosi: Number(UI.inputs.emosi.value),
    dampak: Number(UI.inputs.dampak.value),
  };
}

function fuzzify(inputs) {
  const fuzzy = {};
  Object.keys(membershipDefs).forEach((variable) => {
    fuzzy[variable] = {};
    Object.keys(membershipDefs[variable]).forEach((term) => {
      fuzzy[variable][term] = Number(
        membershipDefs[variable][term](inputs[variable]).toFixed(4),
      );
    });
  });
  return fuzzy;
}

function evaluateRules(fuzzyInput) {
  return rules.map((rule) => {
    const alpha = Math.min(
      ...rule.antecedents.map(
        (antecedent) => fuzzyInput[antecedent.variable][antecedent.term],
      ),
    );
    return {
      ...rule,
      alpha,
      weightedAlpha: alpha * rule.weight,
    };
  });
}

function defuzzify(ruleEvaluations) {
  let numerator = 0;
  let denominator = 0;

  for (let x = 0; x <= 100; x += 1) {
    let mu = 0;
    ruleEvaluations.forEach((ruleEval) => {
      const clipped = Math.min(
        ruleEval.weightedAlpha,
        outputTerms[ruleEval.consequent](x),
      );
      mu = Math.max(mu, clipped);
    });

    numerator += x * mu;
    denominator += mu;
  }

  if (denominator === 0) {
    return 0;
  }
  return Number((numerator / denominator).toFixed(2));
}

function computeFactorRisk(inputs) {
  return {
    durasi_risk: Number(
      Math.min(100, (inputs.durasi / ranges.durasi.max) * 100).toFixed(1),
    ),
    frekuensi_risk: Number(
      Math.min(100, (inputs.frekuensi / ranges.frekuensi.max) * 100).toFixed(1),
    ),
    pengeluaran_risk: Number(
      Math.min(
        100,
        (inputs.pengeluaran / ranges.pengeluaran.max) * 100,
      ).toFixed(1),
    ),
    emosi_risk: Number(
      Math.min(100, (inputs.emosi / ranges.emosi.max) * 100).toFixed(1),
    ),
    dampak_risk: Number(
      Math.min(100, (inputs.dampak / ranges.dampak.max) * 100).toFixed(1),
    ),
  };
}

function getDominantRules(evaluations, limit = 4) {
  return evaluations
    .filter((item) => item.weightedAlpha > 0)
    .sort((a, b) => b.weightedAlpha - a.weightedAlpha)
    .slice(0, limit);
}

function inferRecommendations(category, dominantRules) {
  const base = recommendationsByCategory[category] || [];
  const extra = [];

  if (dominantRules.some((rule) => rule.id === "R2" || rule.id === "R1")) {
    extra.push(
      "Durasi bermain menjadi sinyal utama, coba gunakan hard time limit harian.",
    );
  }
  if (dominantRules.some((rule) => rule.id === "R5" || rule.id === "R6")) {
    extra.push(
      "Perhatikan regulasi emosi setelah kalah agar tidak memicu sesi bermain berulang.",
    );
  }
  if (dominantRules.some((rule) => rule.id === "R10")) {
    extra.push(
      "Aktifkan batas transaksi bulanan untuk menahan pembelian impulsif di game.",
    );
  }

  return [...new Set([...base, ...extra])].slice(0, 5);
}

function runAssessment(inputs) {
  const fuzzyInput = fuzzify(inputs);
  const ruleEvaluations = evaluateRules(fuzzyInput);
  const fuzzyScore = defuzzify(ruleEvaluations);

  const expertIntensity =
    ruleEvaluations.reduce((sum, item) => sum + item.weightedAlpha, 0) /
    Math.max(ruleEvaluations.length, 1);
  const expertScore = Number(Math.min(100, expertIntensity * 125).toFixed(2));

  const blendedScore = fuzzyScore * 0.75 + expertScore * 0.25;
  const finalScore = isMaxInput(inputs)
    ? 100
    : Number(Math.min(100, blendedScore * SCORE_CALIBRATION_FACTOR).toFixed(2));
  const categoryInfo = getRiskCategory(finalScore);
  const factors = computeFactorRisk(inputs);
  const dominantRules = getDominantRules(ruleEvaluations);
  const recommendations = inferRecommendations(categoryInfo.key, dominantRules);

  return {
    tanggal: new Date().toLocaleString("id-ID"),
    inputs,
    fuzzyInput,
    fuzzyScore,
    expertScore,
    skor: finalScore,
    kategori: categoryInfo.key,
    kategoriClass: categoryInfo.className,
    detail: factors,
    dominantRules,
    recommendations,
  };
}

function setSectionVisible(id) {
  Object.keys(UI.sections).forEach((key) => {
    UI.sections[key].classList.toggle("hidden", key !== id);
    UI.sections[key].classList.toggle("active", key === id);
  });
}

function getCategoryLabel(variable, value) {
  return categoryMap[variable].find((item) => item.test(value)).label;
}

function updateProgress(inputs) {
  const percentages = Object.keys(inputs).map((variable) => {
    const min = Number(UI.inputs[variable].min);
    const max = Number(UI.inputs[variable].max);
    return ((inputs[variable] - min) / (max - min)) * 100;
  });

  const progress = Number(
    (percentages.reduce((a, b) => a + b, 0) / percentages.length).toFixed(0),
  );
  UI.progressBar.style.width = `${progress}%`;
  UI.progressText.textContent = `${progress}%`;
}

function updateInputVisuals() {
  const values = getInputValues();

  UI.valueBadges.durasi.textContent = ranges.durasi.formatter(values.durasi);
  UI.valueBadges.frekuensi.textContent = ranges.frekuensi.formatter(
    values.frekuensi,
  );
  UI.valueBadges.pengeluaran.textContent = ranges.pengeluaran.formatter(
    values.pengeluaran,
  );
  UI.valueBadges.emosi.textContent = ranges.emosi.formatter(values.emosi);
  UI.valueBadges.dampak.textContent = ranges.dampak.formatter(values.dampak);

  UI.labels.durasi.textContent = getCategoryLabel("durasi", values.durasi);
  UI.labels.frekuensi.textContent = getCategoryLabel(
    "frekuensi",
    values.frekuensi,
  );
  UI.labels.pengeluaran.textContent = getCategoryLabel(
    "pengeluaran",
    values.pengeluaran,
  );
  UI.labels.emosi.textContent = getCategoryLabel("emosi", values.emosi);
  UI.labels.dampak.textContent = getCategoryLabel("dampak", values.dampak);

  updateProgress(values);
  saveDraft(values);
}

function animateCounter(targetValue) {
  const duration = 1000;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const ratio = Math.min(1, elapsed / duration);
    const current = Math.round(targetValue * (1 - (1 - ratio) * (1 - ratio)));
    UI.scoreValue.textContent = String(current);

    if (ratio < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function renderFactorBars(detail) {
  UI.factorBars.innerHTML = "";

  const labels = {
    durasi_risk: "Durasi",
    frekuensi_risk: "Frekuensi",
    pengeluaran_risk: "Pengeluaran",
    emosi_risk: "Emosi",
    dampak_risk: "Dampak",
  };

  Object.keys(detail).forEach((key) => {
    const wrap = document.createElement("div");
    wrap.className = "factor-item";

    wrap.innerHTML = `
      <div class="factor-top">
        <span>${labels[key]}</span>
        <span class="mono">${detail[key]}%</span>
      </div>
      <div class="factor-track">
        <div class="factor-fill" style="width:${detail[key]}%"></div>
      </div>
    `;

    UI.factorBars.appendChild(wrap);
  });
}

function renderRules(ruleList) {
  UI.topRules.innerHTML = "";

  if (ruleList.length === 0) {
    const li = document.createElement("li");
    li.textContent =
      "Tidak ada rule dominan, gunakan input yang lebih representatif.";
    UI.topRules.appendChild(li);
    return;
  }

  ruleList.forEach((rule) => {
    const li = document.createElement("li");
    li.textContent = `${rule.id} (${(rule.weightedAlpha * 100).toFixed(1)}%): ${rule.description}`;
    UI.topRules.appendChild(li);
  });
}

function renderRecommendations(list) {
  UI.recommendations.innerHTML = "";
  list.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    UI.recommendations.appendChild(li);
  });
}

function showResult(result) {
  setSectionVisible("result");
  UI.sections.history.classList.remove("hidden");

  UI.resultDate.textContent = `${result.tanggal} | Fuzzy ${result.fuzzyScore} | Expert ${result.expertScore}`;
  UI.riskCategory.textContent = result.kategori;
  UI.riskCategory.className = `risk-tag ${result.kategoriClass}`;

  UI.meterFill.style.width = "0%";
  setTimeout(() => {
    UI.meterFill.style.width = `${result.skor}%`;
  }, 60);

  animateCounter(Math.round(result.skor));
  renderFactorBars(result.detail);
  renderRules(result.dominantRules);
  renderRecommendations(result.recommendations);
  saveToHistory(result);
  renderHistory();
}

function saveDraft(inputs) {
  localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(inputs));
}

function loadDraft() {
  const raw = localStorage.getItem(STORAGE_KEYS.draft);
  if (!raw) {
    return;
  }

  try {
    const draft = JSON.parse(raw);
    Object.keys(UI.inputs).forEach((key) => {
      if (draft[key] !== undefined) {
        UI.inputs[key].value = draft[key];
      }
    });
  } catch (_err) {
    localStorage.removeItem(STORAGE_KEYS.draft);
  }
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || "[]");
  } catch (_err) {
    return [];
  }
}

function saveToHistory(result) {
  const current = loadHistory();
  const compact = {
    tanggal: result.tanggal,
    skor: result.skor,
    kategori: result.kategori,
  };

  const updated = [compact, ...current].slice(0, 6);
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(updated));
}

function renderHistory() {
  const data = loadHistory();
  UI.historyList.innerHTML = "";

  if (data.length === 0) {
    UI.historyList.innerHTML = "<p>Belum ada assessment tersimpan.</p>";
    return;
  }

  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `
      <span class="mono">${item.tanggal}</span>
      <strong>${item.skor} (${item.kategori})</strong>
    `;
    UI.historyList.appendChild(div);
  });
}

function runProcessingSequence(inputs) {
  const hints = [
    "Menyiapkan membership function...",
    "Evaluasi rule base pakar...",
    "Defuzzification centroid...",
    "Menyusun rekomendasi personal...",
  ];

  setSectionVisible("processing");
  let idx = 0;

  const timer = setInterval(() => {
    UI.processingHint.textContent = hints[idx] || hints[hints.length - 1];
    idx += 1;
  }, 320);

  setTimeout(() => {
    clearInterval(timer);
    const result = runAssessment(inputs);
    showResult(result);
  }, 1400);
}

async function shareResult() {
  const category = UI.riskCategory.textContent;
  const score = UI.scoreValue.textContent;
  const shareText = `Skor risiko kecanduan ML saya: ${score}/100 (${category}).`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "ML Addict Risk Assessment",
        text: shareText,
      });
      return;
    } catch (_err) {
      return;
    }
  }

  try {
    await navigator.clipboard.writeText(shareText);
    alert("Hasil disalin ke clipboard.");
  } catch (_err) {
    alert("Share belum didukung browser ini.");
  }
}

function resetInputs() {
  UI.form.reset();
  UI.inputs.durasi.value = 0;
  UI.inputs.frekuensi.value = 1;
  UI.inputs.pengeluaran.value = 0;
  UI.inputs.emosi.value = 1;
  UI.inputs.dampak.value = 1;
  updateInputVisuals();
}

function bindEvents() {
  UI.startBtn.addEventListener("click", () => {
    setSectionVisible("assessment");
    UI.sections.history.classList.remove("hidden");
    UI.sections.assessment.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  Object.values(UI.inputs).forEach((input) => {
    input.addEventListener("input", updateInputVisuals);
  });

  UI.form.addEventListener("submit", (event) => {
    event.preventDefault();
    runProcessingSequence(getInputValues());
  });

  UI.resetInputBtn.addEventListener("click", resetInputs);

  UI.retryBtn.addEventListener("click", () => {
    setSectionVisible("assessment");
    UI.sections.assessment.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  UI.shareBtn.addEventListener("click", shareResult);

  UI.clearHistoryBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.history);
    renderHistory();
  });
}

function init() {
  loadDraft();
  updateInputVisuals();
  renderHistory();
  bindEvents();
}

init();
