import { questionsPool } from './questions.js';

// --- SUPABASE SETUP ---
const supabaseUrl = 'https://ppntaxnhwvkrdrriedlv.supabase.co';
const supabaseKey = 'sb_publishable_LvAgE6-B78p4qJ3sCK1YeQ_oCShrJMy';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// --- AUDIO SETUP ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    window.speechSynthesis.cancel();

    if (type === 'correct') {
        const s = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3');
        s.volume = 0.6;
        s.play().catch(() => {});
    } else if (type === 'wrong') {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.connect(g);
        g.connect(audioCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        g.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);

        const u = new SpeechSynthesisUtterance('Loser!');
        u.lang = 'en-US';
        u.pitch = 0.5;
        u.rate = 0.8;
        window.speechSynthesis.speak(u);
    }
}

// --- STATE ---
let currentDifficulty = 'leicht';
let currentQuestionIndex = 0;
let score = 0;
let currentQuizQuestions = [];
let timerAnimationFrame = null;
let timeLeft = 15;
let jokerUsed = false;
let totalTime = 0;
let questionStartTime = 0;
let highscore = 0;
let questionAlreadyScored = false;

const STORAGE_PREFIX = 'muenchenFanQuiz_';
const QUESTION_TIME_SECONDS = 15;
const QUESTIONS_PER_ROUND = 10;

// --- HELPERS ---
function sanitizeName(raw) {
    const cleaned = raw
        .normalize('NFKC')
        .replace(/[^\p{L}\p{N} _.-]/gu, '')
        .trim()
        .slice(0, 15);

    return cleaned || 'Anonym';
}

function shuffleArray(arr) {
    return [...arr].sort(() => 0.5 - Math.random());
}

function setScreen(startVisible, quizVisible) {
    document.getElementById('start-screen').style.display = startVisible ? 'block' : 'none';
    document.getElementById('quiz-container').style.display = quizVisible ? 'block' : 'none';
}

function renderEntriesToList(listEl, entries, showTime = false) {
    listEl.innerHTML = '';

    if (!entries || entries.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Noch leer';
        listEl.appendChild(li);
        return;
    }

    for (const e of entries) {
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = e.name ?? 'Anonym';
        li.appendChild(strong);

        const text = showTime
            ? `: ${e.score} Pkt. (${Number(e.time ?? 0).toFixed(1)}s)`
            : `: ${e.score}`;

        li.appendChild(document.createTextNode(text));
        listEl.appendChild(li);
    }
}

function updateScoreUI() {
    document.getElementById('score').innerText = score;
    document.getElementById('highscore').innerText = highscore;
}

// --- QUIZ FLOW ---
function initQuiz(difficulty) {
    currentDifficulty = difficulty;
    setScreen(false, true);

    // Sichtbarkeit zurücksetzen (falls man über reload nicht neu startet)
    document.getElementById('quiz').style.display = 'block';
    document.querySelector('.tools-header').style.display = 'flex';
    document.getElementById('leaderboard-section').style.display = 'none';
    document.getElementById('leaderboard-form').style.display = 'block';

    startQuiz();
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    totalTime = 0;
    jokerUsed = false;

    const jokerBtn = document.getElementById('joker-btn');
    jokerBtn.disabled = false;
    jokerBtn.style.opacity = '1';

    highscore = parseInt(localStorage.getItem(`${STORAGE_PREFIX}Highscore_${currentDifficulty}`), 10) || 0;
    updateScoreUI();

    const pool = questionsPool.filter(q => q.difficulty === currentDifficulty);

    if (pool.length === 0) {
        alert(`Keine Fragen für Schwierigkeit "${currentDifficulty}" gefunden.`);
        location.reload();
        return;
    }

    currentQuizQuestions = shuffleArray(pool).slice(0, Math.min(QUESTIONS_PER_ROUND, pool.length));
    showQuestion();
}

function showQuestion() {
    resetState();

    const qBox = document.getElementById('quiz');
    qBox.classList.remove('question-slide-in');
    void qBox.offsetWidth;
    qBox.classList.add('question-slide-in');

    const progress = (currentQuestionIndex / currentQuizQuestions.length) * 100;
    document.getElementById('progress-bar-fill').style.width = `${progress}%`;

    questionStartTime = Date.now();
    questionAlreadyScored = false;
    startTimer();

    const q = currentQuizQuestions[currentQuestionIndex];
    document.getElementById('question').innerText = q.question;

    const img = document.getElementById('question-image');
    if (q.image) {
        img.src = q.image;
        img.style.display = 'block';
    } else {
        img.style.display = 'none';
    }

    const answerButtons = document.getElementById('answer-buttons');
    q.answers.forEach(a => {
        const b = document.createElement('button');
        b.innerText = a.text;
        b.classList.add('btn');
        if (a.correct) b.dataset.correct = 'true';
        b.addEventListener('click', selectAnswer);
        answerButtons.appendChild(b);
    });
}

function resetState() {
    if (timerAnimationFrame) cancelAnimationFrame(timerAnimationFrame);

    document.body.classList.remove('timer-urgent');
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('explanation-box').style.display = 'none';
    document.getElementById('result-message').innerText = '';
    document.getElementById('answer-buttons').innerHTML = '';

    const bar = document.getElementById('timer-bar');
    bar.style.width = '100%';
    bar.style.backgroundColor = '#28a745';
    timeLeft = QUESTION_TIME_SECONDS;
}

function startTimer() {
    const start = performance.now();
    const bar = document.getElementById('timer-bar');

    function update(now) {
        const elapsed = (now - start) / 1000;
        timeLeft = QUESTION_TIME_SECONDS - elapsed;

        const perc = Math.max(0, (timeLeft / QUESTION_TIME_SECONDS) * 100);
        bar.style.width = `${perc}%`;

        if (perc < 33) {
            bar.style.backgroundColor = '#DC052D';
            document.body.classList.add('timer-urgent');
        } else {
            bar.style.backgroundColor = '#28a745';
            document.body.classList.remove('timer-urgent');
        }

        if (timeLeft <= 0) {
            cancelAnimationFrame(timerAnimationFrame);
            document.body.classList.remove('timer-urgent');
            handleTimeout();
        } else {
            timerAnimationFrame = requestAnimationFrame(update);
        }
    }

    timerAnimationFrame = requestAnimationFrame(update);
}

function handleTimeout() {
    // Falls nicht bereits beantwortet, volle Zeit aufrechnen
    if (!questionAlreadyScored) {
        totalTime += QUESTION_TIME_SECONDS;
        questionAlreadyScored = true;
    }

    playSound('wrong');
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    revealAnswer();
}

function selectAnswer(e) {
    if (timerAnimationFrame) cancelAnimationFrame(timerAnimationFrame);
    document.body.classList.remove('timer-urgent');

    const b = e.target;
    const isCorrect = b.dataset.correct === 'true';

    // Gemessene Zeit nur einmal addieren
    if (!questionAlreadyScored) {
        totalTime += (Date.now() - questionStartTime) / 1000;
        questionAlreadyScored = true;
    }

    if (isCorrect) {
        playSound('correct');
        if (navigator.vibrate) navigator.vibrate(50);
        b.style.background = '#28a745';
        b.style.color = '#fff';
        score++;
        updateScoreUI();
    } else {
        playSound('wrong');
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        b.style.background = '#DC052D';
        b.style.color = '#fff';
    }

    revealAnswer();
}

function revealAnswer() {
    const answerButtons = Array.from(document.getElementById('answer-buttons').children);
    answerButtons.forEach(b => {
        if (b.dataset.correct === 'true') {
            b.style.background = '#28a745';
            b.style.color = '#fff';
        }
        b.disabled = true;
    });

    const q = currentQuizQuestions[currentQuestionIndex];
    if (q.explanation) {
        const ex = document.getElementById('explanation-box');
        ex.textContent = `💡 ${q.explanation}`;
        ex.style.display = 'block';
    }

    document.getElementById('next-btn').style.display = 'block';
}

function showScore() {
    document.getElementById('quiz').style.display = 'none';
    document.querySelector('.tools-header').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('leaderboard-section').style.display = 'block';

    if (score > highscore) {
        localStorage.setItem(`${STORAGE_PREFIX}Highscore_${currentDifficulty}`, String(score));
        highscore = score;
    }

    let rankTitle = '';
    let rankColor = '';

    if (score === currentQuizQuestions.length) {
        rankTitle = '🏆 TRIPLE-SIEGER / LEGENDE';
        rankColor = '#FFD700';
        confetti({
            particleCount: 200,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#DC052D', '#FFD700', '#ffffff']
        });
    } else if (score >= 7) {
        rankTitle = '🌟 BUNDESLIGA-PROFI';
        rankColor = '#004BA0';
    } else if (score >= 4) {
        rankTitle = '🏃 REGIONALLIGA-STAMMPLATZ';
        rankColor = '#222';
    } else {
        rankTitle = '🌭 STADIONWURST-NIVEAU';
        rankColor = '#666';
    }

    const totalQuestions = currentQuizQuestions.length;
    document.getElementById('final-result-text').innerHTML = `
        <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; color: #666; margin-bottom: 5px;">Dein Rang:</div>
        <div style="font-size: 1.4rem; font-weight: 900; color: ${rankColor}; margin-bottom: 20px;">${rankTitle}</div>
        <div style="background: #f0f0f0; display: inline-block; padding: 12px 25px; border-radius: 15px; font-size: 1.1rem;">
            Ergebnis: <strong>${score} / ${totalQuestions}</strong>
        </div>
    `;

    updateScoreUI();
    renderLeaderboard();
}

// --- LEADERBOARDS ---
async function renderLeaderboard() {
    const l = document.getElementById('leaderboard-list');
    l.innerHTML = '<li>Lade weltweite Bestenliste...</li>';

    const { data, error } = await supabase
        .from('leaderboard')
        .select('name, score, time')
        .eq('difficulty', currentDifficulty)
        .order('score', { ascending: false })
        .order('time', { ascending: true })
        .limit(5);

    if (error) {
        l.innerHTML = '<li>Fehler beim Laden :(</li>';
        return;
    }

    renderEntriesToList(l, data, true);
}

async function renderStart() {
    const diffs = ['leicht', 'mittel', 'schwer'];

    for (const d of diffs) {
        const list = document.getElementById(`start-leaderboard-${d}`);
        list.innerHTML = '<li>Lädt...</li>';

        const { data, error } = await supabase
            .from('leaderboard')
            .select('name, score')
            .eq('difficulty', d)
            .order('score', { ascending: false })
            .limit(3);

        if (error) {
            list.innerHTML = '<li>Fehler beim Laden</li>';
            continue;
        }

        renderEntriesToList(list, data, false);
    }
}

async function saveScore() {
    const nameInput = document.getElementById('player-name');
    const name = sanitizeName(nameInput.value);

    const btn = document.getElementById('save-score-btn');
    btn.disabled = true;
    btn.innerText = 'Wird gespeichert...';

    const payload = {
        name,
        score,
        time: Number(totalTime.toFixed(2)),
        difficulty: currentDifficulty
    };

    const { error } = await supabase
        .from('leaderboard')
        .insert([payload]);

    if (error) {
        alert('Fehler beim Cloud-Speichern!');
        btn.disabled = false;
        btn.innerText = 'Speichern';
        return;
    }

    document.getElementById('leaderboard-form').style.display = 'none';
    await renderLeaderboard();
}

// --- EVENTS ---
document.querySelectorAll('.btn-diff').forEach(btn => {
    btn.addEventListener('click', () => initQuiz(btn.dataset.diff));
});

document.getElementById('joker-btn').addEventListener('click', (e) => {
    if (jokerUsed) return;
    jokerUsed = true;

    e.target.disabled = true;
    e.target.style.opacity = '0.3';

    const btns = Array.from(document.getElementById('answer-buttons').children);
    const wrong = btns
        .filter(b => b.dataset.correct !== 'true')
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

    wrong.forEach(b => {
        b.style.opacity = '0';
        b.style.pointerEvents = 'none';
    });
});

document.getElementById('next-btn').addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizQuestions.length) {
        showQuestion();
    } else {
        document.getElementById('progress-bar-fill').style.width = '100%';
        showScore();
    }
});

document.getElementById('save-score-btn').addEventListener('click', saveScore);

document.getElementById('restart-btn').addEventListener('click', () => {
    location.reload();
});

// --- INIT ---
renderStart();