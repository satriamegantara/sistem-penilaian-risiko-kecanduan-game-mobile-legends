/**
 * ============================================
 * Sistem Penilaian Risiko Kecanduan Mobile Legends
 * Fuzzy Logic Engine (Mamdani) + Expert System
 * ============================================
 */

// ============================================
// DATA PERTANYAAN & FUZZY VARIABLES
// ============================================

const QUESTIONS = [
    {
        id: 1,
        variable: 'durasi',
        text: 'Dalam sehari, berapa jam kamu biasanya bermain Mobile Legends?',
        variableText: 'Durasi Bermain',
        answers: {
            yes: { label: '> 3 jam', value: 4 },
            no: { label: '< 3 jam', value: 2 }
        }
    },
    {
        id: 2,
        variable: 'durasi',
        text: 'Apakah kamu sering bermain Mobile Legends sampai larut malam (setelah jam 23:00)?',
        variableText: 'Durasi Bermain',
        answers: {
            yes: { label: 'Ya', value: 4 },
            no: { label: 'Tidak', value: 1 }
        }
    },
    {
        id: 3,
        variable: 'frekuensi',
        text: 'Seberapa sering kamu bermain dalam seminggu?',
        variableText: 'Frekuensi Bermain',
        answers: {
            yes: { label: '5-7 hari', value: 5 },
            no: { label: '< 5 hari', value: 2 }
        }
    },
    {
        id: 4,
        variable: 'frekuensi',
        text: 'Apakah kamu merasa sulit untuk tidak membuka aplikasi game meski tidak ada notifikasi?',
        variableText: 'Frekuensi Bermain',
        answers: {
            yes: { label: 'Ya', value: 4 },
            no: { label: 'Tidak', value: 1 }
        }
    },
    {
        id: 5,
        variable: 'intensitas',
        text: 'Saat bermain, apakah kamu merasa sangat fokus dan lupa waktu?',
        variableText: 'Intensitas Bermain',
        answers: {
            yes: { label: 'Ya', value: 5 },
            no: { label: 'Tidak', value: 1 }
        }
    },
    {
        id: 6,
        variable: 'intensitas',
        text: 'Apakah kamu pernah melewatkan makan atau aktivitas penting karena sedang bermain?',
        variableText: 'Intensitas Bermain',
        answers: {
            yes: { label: 'Ya', value: 5 },
            no: { label: 'Tidak', value: 1 }
        }
    },
    {
        id: 7,
        variable: 'dampak',
        text: 'Apakah nilai sekolah/kuliahmu menurun sejak mulai sering bermain?',
        variableText: 'Dampak Negatif',
        answers: {
            yes: { label: 'Ya', value: 5 },
            no: { label: 'Tidak', value: 1 }
        }
    },
    {
        id: 8,
        variable: 'dampak',
        text: 'Apakah kamu sering bertengkar dengan keluarga karena terlalu fokus bermain?',
        variableText: 'Dampak Sosial',
        answers: {
            yes: { label: 'Ya', value: 5 },
            no: { label: 'Tidak', value: 1 }
        }
    },
    {
        id: 9,
        variable: 'dampak',
        text: 'Apakah kamu merasa cemas atau marah saat tidak bisa bermain?',
        variableText: 'Dampak Emosional',
        answers: {
            yes: { label: 'Ya', value: 5 },
            no: { label: 'Tidak', value: 1 }
        }
    },
    {
        id: 10,
        variable: 'dampak',
        text: 'Apakah kamu pernah berbohong kepada orang terdekat tentang durasi bermainmu?',
        variableText: 'Perilaku Tersembunyi',
        answers: {
            yes: { label: 'Ya', value: 5 },
            no: { label: 'Tidak', value: 1 }
        }
    }
];

// ============================================
// FUZZY MEMBERSHIP FUNCTIONS
// ============================================

// Fungsi keanggotaan untuk setiap variabel
// Menggunakan trapezoidal dan triangular membership functions

const MembershipFunctions = {
    /**
     * Trapezoidal membership function
     * @param {number} x - nilai input
     * @param {number} a - start
     * @param {number} b - peak start
     * @param {number} c - peak end
     * @param {number} d - end
     */
    trapezoidal(x, a, b, c, d) {
        if (x <= a || x >= d) return 0;
        if (x >= b && x <= c) return 1;
        if (x > a && x < b) return (x - a) / (b - a);
        if (x > c && x < d) return (d - x) / (d - c);
        return 0;
    },

    /**
     * Triangular membership function
     * @param {number} x - nilai input
     * @param {number} a - start
     * @param {number} b - peak
     * @param {number} c - end
     */
    triangular(x, a, b, c) {
        return this.trapezoidal(x, a, b, b, c);
    },

    /**
     * Membership function untuk DURASI (1-5)
     * Rendah: 1-2.5, Sedang: 2-4, Tinggi: 3.5-5
     */
    durasi(x) {
        return {
            rendah: this.trapezoidal(x, 1, 1, 2.5, 3),
            sedang: this.triangular(x, 2, 3.5, 5),
            tinggi: this.trapezoidal(x, 3.5, 4.5, 5, 5)
        };
    },

    /**
     * Membership function untuk FREKUENSI (1-5)
     * Rendah: 1-2.5, Sedang: 2-4, Tinggi: 3.5-5
     */
    frekuensi(x) {
        return {
            rendah: this.trapezoidal(x, 1, 1, 2.5, 3),
            sedang: this.triangular(x, 2, 3.5, 5),
            tinggi: this.trapezoidal(x, 3.5, 4.5, 5, 5)
        };
    },

    /**
     * Membership function untuk INTENSITAS (1-5)
     * Rendah: 1-2.5, Sedang: 2-4, Tinggi: 3.5-5
     */
    intensitas(x) {
        return {
            rendah: this.trapezoidal(x, 1, 1, 2.5, 3),
            sedang: this.triangular(x, 2, 3.5, 5),
            tinggi: this.trapezoidal(x, 3.5, 4.5, 5, 5)
        };
    },

    /**
     * Membership function untuk DAMPAK (1-5)
     * Ringan: 1-2.5, Sedang: 2-4, Berat: 3.5-5
     */
    dampak(x) {
        return {
            ringan: this.trapezoidal(x, 1, 1, 2.5, 3),
            sedang: this.triangular(x, 2, 3.5, 5),
            berat: this.trapezoidal(x, 3.5, 4.5, 5, 5)
        };
    }
};

// ============================================
// FUZZIFICATION
// ============================================

function fuzzify(aggregatedScores) {
    const fuzzyValues = {
        durasi: MembershipFunctions.durasi(aggregatedScores.durasi),
        frekuensi: MembershipFunctions.frekuensi(aggregatedScores.frekuensi),
        intensitas: MembershipFunctions.intensitas(aggregatedScores.intensitas),
        dampak: MembershipFunctions.dampak(aggregatedScores.dampak)
    };

    return fuzzyValues;
}

// ============================================
// FUZZY RULES (EXPERT KNOWLEDGE BASE)
// ============================================

const FUZZY_RULES = [
    // Rule 1-3: Semua tinggi
    { durasi: 'tinggi', frekuensi: 'tinggi', intensitas: 'tinggi', dampak: 'berat', risiko: 'sangatTinggi', weight: 1.0 },
    { durasi: 'tinggi', frekuensi: 'tinggi', intensitas: 'tinggi', dampak: 'sedang', risiko: 'sangatTinggi', weight: 0.9 },
    { durasi: 'tinggi', frekuensi: 'tinggi', intensitas: 'tinggi', dampak: 'ringan', risiko: 'tinggi', weight: 0.8 },

    // Rule 4-6: Durasi + Frekuensi tinggi
    { durasi: 'tinggi', frekuensi: 'tinggi', intensitas: 'sedang', dampak: 'berat', risiko: 'sangatTinggi', weight: 0.9 },
    { durasi: 'tinggi', frekuensi: 'tinggi', intensitas: 'sedang', dampak: 'sedang', risiko: 'tinggi', weight: 0.8 },
    { durasi: 'tinggi', frekuensi: 'tinggi', intensitas: 'sedang', dampak: 'ringan', risiko: 'sedang', weight: 0.6 },

    // Rule 7-9: Durasi + Dampak berat
    { durasi: 'tinggi', frekuensi: 'sedang', intensitas: 'tinggi', dampak: 'berat', risiko: 'sangatTinggi', weight: 0.9 },
    { durasi: 'tinggi', frekuensi: 'sedang', intensitas: 'tinggi', dampak: 'sedang', risiko: 'tinggi', weight: 0.8 },
    { durasi: 'tinggi', frekuensi: 'sedang', intensitas: 'tinggi', dampak: 'ringan', risiko: 'sedang', weight: 0.5 },

    // Rule 10-12: Durasi tinggi
    { durasi: 'tinggi', frekuensi: 'sedang', intensitas: 'sedang', dampak: 'berat', risiko: 'tinggi', weight: 0.7 },
    { durasi: 'tinggi', frekuensi: 'sedang', intensitas: 'sedang', dampak: 'sedang', risiko: 'sedang', weight: 0.5 },
    { durasi: 'tinggi', frekuensi: 'sedang', intensitas: 'sedang', dampak: 'ringan', risiko: 'rendah', weight: 0.4 },

    // Rule 13-15: Frekuensi + Intensitas tinggi
    { durasi: 'sedang', frekuensi: 'tinggi', intensitas: 'tinggi', dampak: 'berat', risiko: 'sangatTinggi', weight: 0.85 },
    { durasi: 'sedang', frekuensi: 'tinggi', intensitas: 'tinggi', dampak: 'sedang', risiko: 'tinggi', weight: 0.7 },
    { durasi: 'sedang', frekuensi: 'tinggi', intensitas: 'tinggi', dampak: 'ringan', risiko: 'sedang', weight: 0.5 },

    // Rule 16-18: Frekuensi tinggi
    { durasi: 'sedang', frekuensi: 'tinggi', intensitas: 'sedang', dampak: 'berat', risiko: 'tinggi', weight: 0.7 },
    { durasi: 'sedang', frekuensi: 'tinggi', intensitas: 'sedang', dampak: 'sedang', risiko: 'sedang', weight: 0.5 },
    { durasi: 'sedang', frekuensi: 'tinggi', intensitas: 'sedang', dampak: 'ringan', risiko: 'rendah', weight: 0.3 },

    // Rule 19-21: Dampak berat
    { durasi: 'sedang', frekuensi: 'sedang', intensitas: 'tinggi', dampak: 'berat', risiko: 'tinggi', weight: 0.7 },
    { durasi: 'sedang', frekuensi: 'sedang', intensitas: 'sedang', dampak: 'berat', risiko: 'sedang', weight: 0.5 },
    { durasi: 'sedang', frekuensi: 'sedang', intensitas: 'rendah', dampak: 'berat', risiko: 'sedang', weight: 0.4 },

    // Rule 22-24: Medium risk
    { durasi: 'sedang', frekuensi: 'sedang', intensitas: 'sedang', dampak: 'sedang', risiko: 'rendah', weight: 0.3 },
    { durasi: 'sedang', frekuensi: 'sedang', intensitas: 'tinggi', dampak: 'sedang', risiko: 'sedang', weight: 0.5 },
    { durasi: 'sedang', frekuensi: 'sedang', intensitas: 'tinggi', dampak: 'ringan', risiko: 'rendah', weight: 0.3 },

    // Rule 25-27: Rendah semua
    { durasi: 'rendah', frekuensi: 'rendah', intensitas: 'rendah', dampak: 'ringan', risiko: 'rendah', weight: 1.0 },
    { durasi: 'rendah', frekuensi: 'rendah', intensitas: 'rendah', dampak: 'sedang', risiko: 'rendah', weight: 0.7 },
    { durasi: 'rendah', frekuensi: 'rendah', intensitas: 'rendah', dampak: 'berat', risiko: 'sedang', weight: 0.5 },

    // Rule 28-30: Edge cases
    { durasi: 'tinggi', frekuensi: 'rendah', intensitas: 'rendah', dampak: 'ringan', risiko: 'rendah', weight: 0.5 },
    { durasi: 'rendah', frekuensi: 'tinggi', intensitas: 'rendah', dampak: 'ringan', risiko: 'rendah', weight: 0.5 },
    { durasi: 'rendah', frekuensi: 'rendah', intensitas: 'tinggi', dampak: 'berat', risiko: 'sedang', weight: 0.6 }
];

// ============================================
// INFERENCE ENGINE (MAMDANI METHOD)
// ============================================

function evaluateRule(fuzzyValues, rule) {
    // Calculate minimum (AND operation) of all antecedents
    const durasiMembership = fuzzyValues.durasi[rule.durasi] || 0;
    const frekuensiMembership = fuzzyValues.frekuensi[rule.frekuensi] || 0;
    const intensitasMembership = fuzzyValues.intensitas[rule.intensitas] || 0;
    const dampakMembership = fuzzyValues.dampak[rule.dampak] || 0;

    // Minimum of all memberships
    const firingStrength = Math.min(
        durasiMembership,
        frekuensiMembership,
        intensitasMembership,
        dampakMembership
    );

    // Apply rule weight
    return firingStrength * rule.weight;
}

function inference(fuzzyValues) {
    let ruleOutputs = [];

    for (let i = 0; i < FUZZY_RULES.length; i++) {
        const rule = FUZZY_RULES[i];
        const firingStrength = evaluateRule(fuzzyValues, rule);

        if (firingStrength > 0) {
            ruleOutputs.push({
                ruleIndex: i,
                rule: rule,
                firingStrength: firingStrength,
                risiko: rule.risiko
            });
        }
    }

    return ruleOutputs;
}

// ============================================
// DEFUZZIFICATION (CENTROID METHOD)
// ============================================

const RISK_VALUES = {
    rendah: 25,
    sedang: 50,
    tinggi: 75,
    sangatTinggi: 100
};

function defuzzify(ruleOutputs) {
    if (ruleOutputs.length === 0) {
        return { crispValue: 0, level: 'rendah' };
    }

    // Weighted average method
    let sumWeightedOutput = 0;
    let sumWeights = 0;

    for (const output of ruleOutputs) {
        const riskValue = RISK_VALUES[output.risiko];
        sumWeightedOutput += output.firingStrength * riskValue;
        sumWeights += output.firingStrength;
    }

    const crispValue = sumWeights > 0 ? sumWeightedOutput / sumWeights : 0;

    // Determine risk level
    let level = 'rendah';
    if (crispValue >= 80) level = 'sangatTinggi';
    else if (crispValue >= 60) level = 'tinggi';
    else if (crispValue >= 40) level = 'sedang';
    else level = 'rendah';

    return { crispValue, level };
}

// ============================================
// EXPERT SYSTEM (DIAGNOSIS & RECOMMENDATIONS)
// ============================================

const DIAGNOSIS_TEXT = {
    sangatTinggi: `Berdasarkan hasil analisis fuzzy dan sistem pakar, kamu menunjukkan gejala kecanduan game Mobile Legends yang serius. "Game-playing disorder" telah diakui oleh WHO sebagai gangguan mental. Disarankan untuk segera mencari bantuan profesional dan melakukan intervensi untuk mengurangi waktu bermain.`,
    tinggi: `Hasil assessment menunjukkan risiko kecanduan yang tinggi. Kamu menunjukkan perilaku gaming yang tidak sehat dengan dampak signifikan terhadap kehidupan sehari-hari. Sebaiknya mulai batasi waktu bermain dan cari alternatif aktivitas yang lebih positif.`,
    sedang: `Kamu berada di zona risiko sedang. Meskipun belum kecanduan, beberapa perilaku gamingmu sudah menunjukkan tanda-tanda yang perlu diperhatikan. Disarankan untuk lebih sadar dan mulai mengatur waktu bermain dengan lebih bijaksana.`,
    rendah: `Selamat! Kamu memiliki pola bermain game yang sehat dan seimbang. Kamu masih bisa menikmati Mobile Legends tanpa mengorbankan aspek penting dalam hidupmu. Terus pertahankan gaya hidup ini!`
};

const RECOMMENDATIONS = {
    sangatTinggi: [
        'Segera konsultasikan ke psikolog atau konselor profesional',
        'Pertimbangkan untuk uninstall sementara atau blockade game',
        'Beri tahu keluarga/ teman dekat agar membantu proses recovery',
        'Cari aktivitas pengganti yang menstimulasi dopamin positif',
        'Join komunitas recovery dari gaming addiction'
    ],
    tinggi: [
        'Buat jadwal playing yang ketat dan patuhi',
        'Set timer/alarm untuk mengingatkan berhenti main',
        'Hapus atau batasi akses ke aplikasi game',
        'Gunakan aplikasi screen-time monitoring',
        'Tambahkan aktivitas positif: olahraga, hobi, belajar'
    ],
    sedang: [
        'Tetapkan batas waktu bermain per hari (max 2 jam)',
        'Hindari main saat sendirian terlalu lama',
        'Cari teman playing yang memiliki pola sehat',
        'Jaga keseimbangan: gaming, belajar, bersosialisasi',
        'Perhatikan tanda-tanda awal kecanduan'
    ],
    rendah: [
        'Pertahankan pola bermain yang sudah baik',
        'Jangan ragu batasi waktu jika mulai terasa berlebihan',
        'Gunakan fitur parental control jika perlu',
        'Variasikan hobi di luar gaming',
        'Tetap waspada dan self-aware terhadap waktu bermain'
    ]
};

// ============================================
// APPLICATION STATE
// ============================================

let currentQuestion = 0;
let answers = new Array(QUESTIONS.length).fill(null);
let aggregatedScores = {
    durasi: 0,
    frekuensi: 0,
    intensitas: 0,
    dampak: 0
};

// ============================================
// DOM ELEMENTS
// ============================================

const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');
const questionContainer = document.getElementById('question-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderQuestion() {
    const q = QUESTIONS[currentQuestion];
    const answerValue = answers[currentQuestion];

    questionContainer.innerHTML = `
        <div class="question-card">
            <span class="question-number">${q.variableText}</span>
            <p class="question-text">${q.text}</p>
            <div class="answer-options">
                <button class="answer-btn ${answerValue === 0 ? 'selected selected-no' : ''}"
                        onclick="selectAnswer(0)">
                    <span>✗</span> Tidak
                </button>
                <button class="answer-btn ${answerValue === 1 ? 'selected selected-yes' : ''}"
                        onclick="selectAnswer(1)">
                    <span>✓</span> Ya
                </button>
            </div>
        </div>
    `;

    // Update progress
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Pertanyaan ${currentQuestion + 1} dari ${QUESTIONS.length}`;

    // Update buttons
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.disabled = answers[currentQuestion] === null;
}

function selectAnswer(value) {
    answers[currentQuestion] = value;
    renderQuestion();
}

function goToQuestion(index) {
    if (index >= 0 && index < QUESTIONS.length) {
        currentQuestion = index;
        renderQuestion();
    }
}

// ============================================
// AGGREGATION & FUZZY PROCESSING
// ============================================

function aggregateScores() {
    let durasiScore = 0, frekuensiScore = 0, intensitasScore = 0, dampakScore = 0;
    let durasiCount = 0, frekuensiCount = 0, intensitasCount = 0, dampakCount = 0;

    for (let i = 0; i < QUESTIONS.length; i++) {
        const q = QUESTIONS[i];
        const answer = answers[i];

        if (answer === null) continue;

        // answer 1 = Ya (tinggi), answer 0 = Tidak (rendah)
        const scoreValue = answer === 1 ? q.answers.yes.value : q.answers.no.value;

        switch (q.variable) {
            case 'durasi':
                durasiScore += scoreValue;
                durasiCount++;
                break;
            case 'frekuensi':
                frekuensiScore += scoreValue;
                frekuensiCount++;
                break;
            case 'intensitas':
                intensitasScore += scoreValue;
                intensitasCount++;
                break;
            case 'dampak':
                dampakScore += scoreValue;
                dampakCount++;
                break;
        }
    }

    // Normalize to 1-5 scale
    aggregatedScores = {
        durasi: durasiCount > 0 ? (durasiScore / durasiCount) : 1,
        frekuensi: frekuensiCount > 0 ? (frekuensiScore / frekuensiCount) : 1,
        intensitas: intensitasCount > 0 ? (intensitasScore / intensitasCount) : 1,
        dampak: dampakCount > 0 ? (dampakScore / dampakCount) : 1
    };

    return aggregatedScores;
}

// ============================================
// RESULT RENDERING
// ============================================

function showResult() {
    // Process fuzzy logic
    const scores = aggregateScores();
    const fuzzyValues = fuzzify(scores);
    const ruleOutputs = inference(fuzzyValues);
    const { crispValue, level } = defuzzify(ruleOutputs);

    // Hide quiz, show result
    quizSection.classList.remove('active');
    resultSection.classList.add('active');

    // Update risk level display
    const riskLevelEl = document.getElementById('risk-level');
    const levelLabels = {
        rendah: 'RENDANG',
        sedang: 'SEDANG',
        tinggi: 'TINGGI',
        sangatTinggi: 'SANGAT TINGGI'
    };
    riskLevelEl.textContent = levelLabels[level] || level.toUpperCase();
    riskLevelEl.className = `risk-level ${level.replace('sangatTinggi', 'sangat-tinggi')}`;

    // Update score
    document.getElementById('score-value').textContent = Math.round(crispValue);

    // Update diagnosis
    document.getElementById('diagnosis-text').textContent = DIAGNOSIS_TEXT[level];

    // Update recommendations
    const recList = document.getElementById('recommendations-list');
    recList.innerHTML = RECOMMENDATIONS[level]
        .map(rec => `<li>${rec}</li>`)
        .join('');

    // Update rule analysis
    const ruleContent = document.getElementById('rule-analysis-content');
    const activeRules = ruleOutputs
        .sort((a, b) => b.firingStrength - a.firingStrength)
        .slice(0, 5);

    ruleContent.innerHTML = activeRules.map(rule => `
        <div class="rule-item active">
            <div class="rule-label">Rule #${rule.ruleIndex + 1} (strength: ${(rule.firingStrength * 100).toFixed(1)}%)</div>
            IF durasi=${rule.rule.durasi} AND frekuensi=${rule.rule.frekuensi}
            AND intensitas=${rule.rule.intensitas} AND dampak=${rule.rule.dampak}
            <div class="rule-result">THEN risiko=${rule.risiko}</div>
        </div>
    `).join('');

    // Animate gauge needle
    const gaugeNeedle = document.getElementById('gauge-needle');
    // Rotate from -90deg (0%) to 90deg (100%)
    const rotation = -90 + (crispValue / 100) * 180;
    gaugeNeedle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
}

function restart() {
    currentQuestion = 0;
    answers = new Array(QUESTIONS.length).fill(null);
    aggregatedScores = { durasi: 0, frekuensi: 0, intensitas: 0, dampak: 0 };

    resultSection.classList.remove('active');
    quizSection.classList.add('active');
    renderQuestion();
}

// ============================================
// EVENT LISTENERS
// ============================================

prevBtn.addEventListener('click', () => goToQuestion(currentQuestion - 1));
nextBtn.addEventListener('click', () => {
    if (currentQuestion < QUESTIONS.length - 1) {
        goToQuestion(currentQuestion + 1);
    } else {
        showResult();
    }
});
restartBtn.addEventListener('click', restart);

// ============================================
// INITIALIZE
// ============================================

renderQuestion();