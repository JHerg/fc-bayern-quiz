import { questionsPool } from './questions.js';

// --- AUDIO SETUP ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    window.speechSynthesis.cancel(); // Stoppt laufende Sprachausgaben

    if (type === 'correct') {
        // Gameshow Erfolgssound
        const correctSound = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3');
        correctSound.volume = 0.8;
        correctSound.play();
    } else if (type === 'wrong') {
        // Tiefer Fehlerton (Synthesizer)
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start(); 
        osc.stop(audioCtx.currentTime + 0.5);

        // JA, DIE AUSGABE IST HIER:
        const utterance = new SpeechSynthesisUtterance('Loser!');
        utterance.lang = 'en-US'; 
        utterance.pitch = 0.3;    // Schön tief und spöttisch
        utterance.rate = 0.8;     // Etwas langsamer
        window.speechSynthesis.speak(utterance);
    }
}

// --- VARIABLEN & STATE ---
let currentDifficulty = 'leicht';
let currentQuestionIndex = 0;
let score = 0;
let currentQuizQuestions = [];
let timerInterval;
const TIME_LIMIT = 15;
let timeLeft = TIME_LIMIT;
let jokerUsed = false;
let totalTime = 0;
let questionStartTime = 0;
let highscore = 0;

const STORAGE_PREFIX = 'muenchenFanQuiz_';

// --- UI ELEMENTE ---
const progressBarFill = document.getElementById("progress-bar-fill");
const questionElement = document.getElementById("question");
const questionImageElement = document.getElementById("question-image");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const explanationBox = document.getElementById("explanation-box");
const resultMessage = document.getElementById("result-message");
const scoreElement = document.getElementById("score");
const highscoreElement = document.getElementById("highscore");

// --- INITIALISIERUNG ---
function initQuiz(difficulty) {
    currentDifficulty = difficulty;
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    startQuiz();
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    totalTime = 0;
    jokerUsed = false;
    
    const jokerBtn = document.getElementById("joker-btn");
    jokerBtn.disabled = false;
    jokerBtn.style.opacity = "1";
    
    scoreElement.innerText = score;
    highscore = parseInt(localStorage.getItem(`${STORAGE_PREFIX}Highscore_${currentDifficulty}`)) || 0;
    highscoreElement.innerText = highscore;

    // Fragen filtern und 10 zufällige auswählen
    const filteredPool = questionsPool.filter(q => q.difficulty === currentDifficulty);
    currentQuizQuestions = [...filteredPool].sort(() => 0.5 - Math.random()).slice(0, 10);
    
    showQuestion();
}

// --- CORE LOGIK ---
function updateProgressBar() {
    const progress = (currentQuestionIndex / currentQuizQuestions.length) * 100;
    if(progressBarFill) progressBarFill.style.width = `${progress}%`;
}

function showQuestion() {
    resetState();
    updateProgressBar();
    startTimer();
    questionStartTime = Date.now();
    
    let currentQuestion = currentQuizQuestions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    if (currentQuestion.image) {
        questionImageElement.src = currentQuestion.image;
        questionImageElement.style.display = "block";
    } else {
        questionImageElement.style.display = "none";
    }

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        if (answer.correct) button.dataset.correct = answer.correct;
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    cancelAnimationFrame(timerInterval);
    nextButton.style.display = "none";
    explanationBox.style.display = "none";
    resultMessage.innerText = "";
    answerButtonsElement.innerHTML = "";
    const timerBar = document.getElementById("timer-bar");
    if(timerBar) {
        timerBar.style.width = "100%";
        timerBar.style.backgroundColor = "#28a745";
    }
}

function startTimer() {
    let startTime = performance.now();
    const timerBar = document.getElementById("timer-bar");

    function update(currentTime) {
        let elapsed = (currentTime - startTime) / 1000;
        timeLeft = TIME_LIMIT - elapsed;
        let percentage = (timeLeft / TIME_LIMIT) * 100;
        
        if(timerBar) {
            timerBar.style.width = `${Math.max(0, percentage)}%`;
            if (percentage < 30) {
                timerBar.style.backgroundColor = "#DC052D";
            }
        }

        if (timeLeft <= 0) {
            cancelAnimationFrame(timerInterval);
            handleTimeout();
        } else {
            timerInterval = requestAnimationFrame(update);
        }
    }
    timerInterval = requestAnimationFrame(update);
}

function handleTimeout() {
    playSound('wrong');
    resultMessage.innerText = "Zeit abgelaufen! ⏱️";
    resultMessage.style.color = "#DC052D";
    revealCorrectAnswer();
}

function selectAnswer(e) {
    cancelAnimationFrame(timerInterval);
    const selectedButton = e.target;
    const isCorrect = selectedButton.dataset.correct === "true";
    
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    totalTime += timeTaken;

    if (isCorrect) {
        playSound('correct');
        selectedButton.style.backgroundColor = '#28a745';
        selectedButton.style.borderColor = '#28a745';
        selectedButton.style.color = '#fff';
        score++;
        scoreElement.innerText = score;
    } else {
        playSound('wrong'); // Hier wird das "Loser!" getriggert
        selectedButton.style.backgroundColor = '#DC052D';
        selectedButton.style.borderColor = '#DC052D';
        selectedButton.style.color = '#fff';
    }

    revealCorrectAnswer();
}

function revealCorrectAnswer() {
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.style.backgroundColor = '#28a745';
            button.style.color = '#fff';
            button.style.borderColor = '#28a745';
        }
        button.disabled = true;
    });

    const currentQuestion = currentQuizQuestions[currentQuestionIndex];
    if (currentQuestion.explanation) {
        explanationBox.innerHTML = `💡 <strong>Wusstest du schon?</strong><br>${currentQuestion.explanation}`;
        explanationBox.style.display = "block";
    }
    nextButton.style.display = "block";
}

// --- JOKER ---
const jokerBtn = document.getElementById("joker-btn");
if(jokerBtn) {
    jokerBtn.addEventListener("click", (e) => {
        if (jokerUsed) return;
        jokerUsed = true;
        e.target.disabled = true;
        e.target.style.opacity = "0.3";

        const buttons = Array.from(answerButtonsElement.children);
        const wrongButtons = buttons.filter(btn => btn.dataset.correct !== "true");
        
        const toHide = wrongButtons.sort(() => 0.5 - Math.random()).slice(0, 2);
        toHide.forEach(btn => {
            btn.style.opacity = "0";
            btn.style.pointerEvents = "none";
        });
    });
}

// --- NAVIGATION ---
nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizQuestions.length) {
        showQuestion();
    } else {
        if(progressBarFill) progressBarFill.style.width = "100%";
        showScore();
    }
});

// --- FINALE & BESTENLISTE ---
function showScore() {
    document.getElementById("quiz").style.display = "none";
    document.querySelector(".tools-header").style.display = "none";
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("leaderboard-section").style.display = "block";

    if (score > highscore) {
        localStorage.setItem(`${STORAGE_PREFIX}Highscore_${currentDifficulty}`, score);
    }

    let message = "";
    if (score === 10) {
        message = "🏆 WELTKLASSE! Wahre Fan-Power!";
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#DC052D', '#ffffff'] });
    } else if (score >= 7) {
        message = "🥈 Starke Leistung! Fast wie eine Meistersaison!";
    } else {
        message = "⚽ Da ist noch Luft nach oben. Ab ins Training!";
    }

    document.getElementById("final-result-text").innerHTML = `${message}<br><br>Du hast ${score} von 10 Punkten erreicht!`;
    renderLeaderboard();
}

function renderLeaderboard() {
    const list = document.getElementById("leaderboard-list");
    const storageKey = `${STORAGE_PREFIX}Leaderboard_${currentDifficulty}`;
    const leaderboard = JSON.parse(localStorage.getItem(storageKey)) || [];
    list.innerHTML = "";

    leaderboard.forEach(entry => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${entry.name}</strong>: ${entry.score} Pkt. <small>(${entry.time.toFixed(1)}s)</small>`;
        list.appendChild(li);
    });
}

const saveBtn = document.getElementById("save-score-btn");
if(saveBtn) {
    saveBtn.addEventListener("click", () => {
        const nameInput = document.getElementById("player-name");
        const name = nameInput.value.trim() || "Anonym";
        const storageKey = `${STORAGE_PREFIX}Leaderboard_${currentDifficulty}`;
        let leaderboard = JSON.parse(localStorage.getItem(storageKey)) || [];

        leaderboard.push({ name: name, score: score, time: totalTime });
        leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
        leaderboard = leaderboard.slice(0, 5);

        localStorage.setItem(storageKey, JSON.stringify(leaderboard));
        document.getElementById("leaderboard-form").style.display = "none";
        renderLeaderboard();
    });
}

// --- START-BILDSCHIRM LISTEN ---
function renderStartScreenLeaderboards() {
    ['leicht', 'mittel', 'schwer'].forEach(diff => {
        const list = document.getElementById(`start-leaderboard-${diff}`);
        if(list) {
            const data = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}Leaderboard_${diff}`)) || [];
            list.innerHTML = data.length ? "" : "<li>-</li>";
            data.forEach(entry => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${entry.name}</strong>: ${entry.score}`;
                list.appendChild(li);
            });
        }
    });
}

renderStartScreenLeaderboards();

// Global machen für HTML onclick
window.initQuiz = initQuiz;