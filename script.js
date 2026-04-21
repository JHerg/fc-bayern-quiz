import { questionsPool } from './questions.js';

// --- AUDIO ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    window.speechSynthesis.cancel(); 

    if (type === 'correct') {
        const s = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3');
        s.volume = 0.7; s.play();
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

// --- STATE ---
let currentDifficulty = 'leicht', currentQuestionIndex = 0, score = 0, currentQuizQuestions = [], timerInterval, timeLeft = 15, jokerUsed = false, totalTime = 0, questionStartTime = 0, highscore = 0;
const STORAGE_PREFIX = 'muenchenFanQuiz_';

// --- INIT ---
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
    highscore = parseInt(localStorage.getItem(`${STORAGE_PREFIX}Highscore_${currentDifficulty}`)) || 0;
    document.getElementById("highscore").innerText = highscore;
    const pool = questionsPool.filter(q => q.difficulty === currentDifficulty);
    currentQuizQuestions = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
    showQuestion();
}

// --- LOGIK ---
function showQuestion() {
    resetState();
    
    // Animation triggern
    const qBox = document.getElementById("quiz");
    qBox.classList.remove("question-slide-in");
    void qBox.offsetWidth; 
    qBox.classList.add("question-slide-in");

    // Progress Bar
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
        let perc = Math.max(0, (timeLeft/15)*100);
        bar.style.width = `${perc}%`;

        // Panik-Modus bei < 5 Sek (30%)
        if (perc < 30) {
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

function handleTimeout() { playSound('wrong'); revealAnswer(); }

function selectAnswer(e) {
    cancelAnimationFrame(timerInterval);
    document.body.classList.remove("timer-urgent");
    const b = e.target; const isC = b.dataset.correct === "true";
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
    if (q.explanation) { const ex = document.getElementById("explanation-box"); ex.innerHTML = `💡 ${q.explanation}`; ex.style.display = "block"; }
    document.getElementById("next-btn").style.display = "block";
}

// --- TOOLS ---
document.getElementById("joker-btn").addEventListener("click", (e) => {
    if (jokerUsed) return; jokerUsed = true; e.target.disabled = true; e.target.style.opacity = "0.3";
    const btns = Array.from(document.getElementById("answer-buttons").children);
    const wrong = btns.filter(b => b.dataset.correct !== "true").sort(() => 0.5 - Math.random()).slice(0, 2);
    wrong.forEach(b => { b.style.opacity = "0"; b.style.pointerEvents = "none"; });
});

document.getElementById("next-btn").addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizQuestions.length) showQuestion();
    else {
        document.getElementById("progress-bar-fill").style.width = "100%";
        showScore();
    }
});

// --- FINALE ---
function showScore() {
    document.getElementById("quiz").style.display = "none";
    document.querySelector(".tools-header").style.display = "none";
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("leaderboard-section").style.display = "block";
    if (score > highscore) localStorage.setItem(`${STORAGE_PREFIX}Highscore_${currentDifficulty}`, score);
    
    let m = score === 10 ? "🏆 WELTKLASSE!" : score >= 7 ? "🥈 STARK!" : "⚽ WEITER TRAINIEREN!";
    if (score === 10) confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#DC052D', '#ffffff'] });
    
    document.getElementById("final-result-text").innerHTML = `${m}<br>Du hast ${score}/10 Punkten!`;
    renderLeaderboard();
}

function renderLeaderboard() {
    const l = document.getElementById("leaderboard-list");
    const data = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}Leaderboard_${currentDifficulty}`)) || [];
    l.innerHTML = data.map(e => `<li><strong>${e.name}</strong>: ${e.score} Pkt.</li>`).join("");
}

document.getElementById("save-score-btn").addEventListener("click", () => {
    const name = document.getElementById("player-name").value || "Anonym";
    let data = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}Leaderboard_${currentDifficulty}`)) || [];
    data.push({ name, score, time: totalTime });
    data.sort((a,b) => b.score - a.score || a.time - b.time).splice(5);
    localStorage.setItem(`${STORAGE_PREFIX}Leaderboard_${currentDifficulty}`, JSON.stringify(data));
    document.getElementById("leaderboard-form").style.display = "none";
    renderLeaderboard();
});

function renderStart() {
    ['leicht', 'mittel', 'schwer'].forEach(d => {
        const l = document.getElementById(`start-leaderboard-${d}`);
        const data = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}Leaderboard_${d}`)) || [];
        l.innerHTML = data.map(e => `<li>${e.name}: ${e.score}</li>`).join("") || "<li>-</li>";
    });
}

renderStart();
window.initQuiz = initQuiz;