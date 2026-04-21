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
        s.volume = 0.6; s.play();
    } else if (type === 'wrong') {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.connect(g); g.connect(audioCtx.destination);
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        g.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);

        const u = new SpeechSynthesisUtterance('Loser!');
        u.lang = 'en-US'; u.pitch = 0.5; u.rate = 0.8;
        window.speechSynthesis.speak(u);
    }
}

// --- VARIABLEN & STATE ---
let currentDifficulty = 'leicht', 
    currentQuestionIndex = 0, 
    score = 0, 
    currentQuizQuestions = [], 
    timerInterval, 
    timeLeft = 15, 
    jokerUsed = false, 
    totalTime = 0, 
    questionStartTime = 0, 
    highscore = 0;

const STORAGE_PREFIX = 'muenchenFanQuiz_';

// --- INITIALISIERUNG ---
function initQuiz(d) {
    currentDifficulty = d;
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    startQuiz();
}

function startQuiz() {
    currentQuestionIndex = 0; score = 0; totalTime = 0; jokerUsed = false;
    const jBtn = document.getElementById("joker-btn");
    jBtn.disabled = false; jBtn.style.opacity = "1";
    document.getElementById("score").innerText = score;
    
    // Highscore bleibt lokal als persönlicher Rekord
    highscore = parseInt(localStorage.getItem(`${STORAGE_PREFIX}Highscore_${currentDifficulty}`)) || 0;
    document.getElementById("highscore").innerText = highscore;

    const pool = questionsPool.filter(q => q.difficulty === currentDifficulty);
    currentQuizQuestions = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
    showQuestion();
}

// --- CORE LOGIK ---
function showQuestion() {
    resetState();
    
    const qBox = document.getElementById("quiz");
    qBox.classList.remove("question-slide-in");
    void qBox.offsetWidth; 
    qBox.classList.add("question-slide-in");

    const progress = (currentQuestionIndex / currentQuizQuestions.length) * 100;
    document.getElementById("progress-bar-fill").style.width = `${progress}%`;

    startTimer();
    questionStartTime = Date.now();
    let q = currentQuizQuestions[currentQuestionIndex];
    document.getElementById("question").innerText = q.question;
    
    const img = document.getElementById("question-image");
    if (q.image) { img.src = q.image; img.style.display = "block"; } else { img.style.display = "none"; }
    
    q.answers.forEach(a => {
        const b = document.createElement("button");
        b.innerText = a.text; b.classList.add("btn");
        if (a.correct) b.dataset.correct = "true";
        b.addEventListener("click", selectAnswer);
        document.getElementById("answer-buttons").appendChild(b);
    });
}

function resetState() {
    cancelAnimationFrame(timerInterval);
    document.body.classList.remove("timer-urgent");
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("explanation-box").style.display = "none";
    document.getElementById("result-message").innerText = "";
    document.getElementById("answer-buttons").innerHTML = "";
}

function startTimer() {
    let start = performance.now();
    const bar = document.getElementById("timer-bar");
    
    function up(time) {
        let elapsed = (time - start) / 1000;
        timeLeft = 15 - elapsed;
        let perc = Math.max(0, (timeLeft / 15) * 100);
        bar.style.width = `${perc}%`;

        if (perc < 33) {
            bar.style.backgroundColor = "#DC052D";
            document.body.classList.add("timer-urgent");
        } else {
            bar.style.backgroundColor = "#28a745";
        }

        if (timeLeft <= 0) { 
            cancelAnimationFrame(timerInterval); 
            document.body.classList.remove("timer-urgent");
            handleTimeout(); 
        }
        else { timerInterval = requestAnimationFrame(up); }
    }
    timerInterval = requestAnimationFrame(up);
}

function handleTimeout() { 
    playSound('wrong'); 
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    revealAnswer(); 
}

function selectAnswer(e) {
    cancelAnimationFrame(timerInterval);
    document.body.classList.remove("timer-urgent");
    
    const b = e.target; 
    const isC = b.dataset.correct === "true";
    totalTime += (Date.now() - questionStartTime) / 1000;

    if (isC) { 
        playSound('correct'); 
        if (navigator.vibrate) navigator.vibrate(50); 
        b.style.background = '#28a745'; b.style.color = '#fff'; 
        score++; document.getElementById("score").innerText = score; 
    }
    else { 
        playSound('wrong'); 
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]); 
        b.style.background = '#DC052D'; b.style.color = '#fff'; 
    }
    revealAnswer();
}

function revealAnswer() {
    Array.from(document.getElementById("answer-buttons").children).forEach(b => {
        if (b.dataset.correct === "true") { b.style.background = '#28a745'; b.style.color = '#fff'; }
        b.disabled = true;
    });
    const q = currentQuizQuestions[currentQuestionIndex];
    if (q.explanation) { 
        const ex = document.getElementById("explanation-box"); 
        ex.innerHTML = `💡 ${q.explanation}`; 
        ex.style.display = "block"; 
    }
    document.getElementById("next-btn").style.display = "block";
}

// --- JOKER ---
document.getElementById("joker-btn").addEventListener("click", (e) => {
    if (jokerUsed) return; jokerUsed = true; e.target.disabled = true; e.target.style.opacity = "0.3";
    const btns = Array.from(document.getElementById("answer-buttons").children);
    const wrong = btns.filter(b => b.dataset.correct !== "true").sort(() => 0.5 - Math.random()).slice(0, 2);
    wrong.forEach(b => { b.style.opacity = "0"; b.style.pointerEvents = "none"; });
});

// --- NAVIGATION ---
document.getElementById("next-btn").addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizQuestions.length) showQuestion();
    else {
        document.getElementById("progress-bar-fill").style.width = "100%";
        showScore();
    }
});

// --- FINALE & CLOUD BESTENLISTE ---
function showScore() {
    document.getElementById("quiz").style.display = "none";
    document.querySelector(".tools-header").style.display = "none";
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("leaderboard-section").style.display = "block";

    if (score > highscore) localStorage.setItem(`${STORAGE_PREFIX}Highscore_${currentDifficulty}`, score);
    
    let rankTitle = "", rankColor = "";
    if (score === 10) {
        rankTitle = "🏆 TRIPLE-SIEGER / LEGENDE"; rankColor = "#FFD700";
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, colors: ['#DC052D', '#FFD700', '#ffffff'] });
    } else if (score >= 7) {
        rankTitle = "🌟 BUNDESLIGA-PROFI"; rankColor = "#004BA0";
    } else if (score >= 4) {
        rankTitle = "🏃 REGIONALLIGA-STAMMPLATZ"; rankColor = "#222";
    } else {
        rankTitle = "🌭 STADIONWURST-NIVEAU"; rankColor = "#666";
    }

    document.getElementById("final-result-text").innerHTML = `
        <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; color: #666; margin-bottom: 5px;">Dein Rang:</div>
        <div style="font-size: 1.4rem; font-weight: 900; color: ${rankColor}; margin-bottom: 20px;">${rankTitle}</div>
        <div style="background: #f0f0f0; display: inline-block; padding: 12px 25px; border-radius: 15px; font-size: 1.1rem;">
            Ergebnis: <strong>${score} / 10</strong>
        </div>
    `;
    renderLeaderboard();
}

// Top 5 aus der Cloud laden
async function renderLeaderboard() {
    const l = document.getElementById("leaderboard-list");
    l.innerHTML = "<li>Lade weltweite Bestenliste...</li>";

    const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('difficulty', currentDifficulty)
        .order('score', { ascending: false })
        .order('time', { ascending: true })
        .limit(5);

    if (error) {
        l.innerHTML = "<li>Fehler beim Laden :(</li>";
        return;
    }

    l.innerHTML = data.map(e => `<li><strong>${e.name}</strong>: ${e.score} Pkt. <small>(${e.time.toFixed(1)}s)</small></li>`).join("");
}

// In der Cloud speichern
document.getElementById("save-score-btn").addEventListener("click", async () => {
    const nameInput = document.getElementById("player-name");
    const name = nameInput.value.trim() || "Anonym";
    
    const btn = document.getElementById("save-score-btn");
    btn.disabled = true;
    btn.innerText = "Wird gespeichert...";

    const { error } = await supabase
        .from('leaderboard')
        .insert([{ 
            name: name, 
            score: score, 
            time: totalTime, 
            difficulty: currentDifficulty 
        }]);

    if (error) {
        alert("Fehler beim Cloud-Speichern!");
        btn.disabled = false;
        btn.innerText = "Speichern";
    } else {
        document.getElementById("leaderboard-form").style.display = "none";
        renderLeaderboard();
    }
});

// Startbildschirm mit echten Cloud-Daten befüllen
async function renderStart() {
    const diffs = ['leicht', 'mittel', 'schwer'];
    for (const d of diffs) {
        const list = document.getElementById(`start-leaderboard-${d}`);
        const { data, error } = await supabase
            .from('leaderboard')
            .select('name, score')
            .eq('difficulty', d)
            .order('score', { ascending: false })
            .limit(3);

        if (!error && data) {
            list.innerHTML = data.map(e => `<li>${e.name}: ${e.score}</li>`).join("") || "<li>Noch leer</li>";
        }
    }
}

renderStart();
window.initQuiz = initQuiz;