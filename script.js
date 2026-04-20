import { questionsPool } from './questions.js';

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    window.speechSynthesis.cancel(); 

    if (type === 'correct') {
        const correctSound = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3');
        correctSound.volume = 1.0;
        correctSound.play();
    } else if (type === 'wrong') {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start(); osc.stop(audioCtx.currentTime + 0.5);

        const utterance = new SpeechSynthesisUtterance('Loser!');
        utterance.lang = 'en-US'; 
        utterance.pitch = 0.3;    
        utterance.rate = 0.9;     
        window.speechSynthesis.speak(utterance);
    }
}

const bayernQuotes = [
    "\"Eier, wir brauchen Eier!\" – Oliver Kahn",
    "\"Ich habe fertig!\" – Giovanni Trapattoni",
    "\"Schwach wie eine Flasche leer!\" – Giovanni Trapattoni",
    "\"Weiter, immer weiter!\" – Oliver Kahn",
    "\"Das ist der Wahnsinn!\" – Thomas Müller",
    "\"Wir sind hier ja nicht beim Wunschkonzert.\" – Oliver Kahn",
    "\"Gute Freunde kann niemand trennen.\" – Franz Beckenbauer",
    "\"Mia san mia und das bleibt auch so!\" – Bastian Schweinsteiger",
    "\"Wenn du nicht mehr kannst, musst du halt weiterlaufen.\" – Thomas Müller",
    "\"Erfolg ist kein Zufall. Es ist harte Arbeit.\" – Franck Ribéry",
    "\"Geht's raus und spielt's Fußball!\" – Franz Beckenbauer",
    "\"Der Ball ist rund. Wäre er eckig, wäre er ein Würfel.\" – Sepp Maier",
    "„Thomas Müller spielt immer.“ – Louis van Gaal",
    "„Der FC Bayern ist nicht nur ein Verein, sondern eine Familie.“ – Franck Ribéry",
    "„Was erlauben Strunz?“ – Giovanni Trapattoni",
    "„Das ist der FC Bayern, hier gibt es keine Ausreden.“ – Bastian Schweinsteiger",
    "„Es gibt nur ein Gas: Vollgas!“ – Hasan Salihamidžić",
    "„Wir müssen immer ans Limit gehen.“ – Manuel Neuer",
    "„Fußball ist ein Spiel von Fehlern. Wer die wenigsten macht, gewinnt.“ – Pep Guardiola",
    "„Arjen hat's gemacht!“ – Wolff Fuss"
];

const questionElement = document.getElementById("question");
const questionImageElement = document.getElementById("question-image");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const resultMessage = document.getElementById("result-message");
const scoreElement = document.getElementById("score");
const highscoreElement = document.getElementById("highscore");
const currentDiffDisplay = document.getElementById("current-diff-display");
const endDiffDisplay = document.getElementById("end-diff-display");
const jokerBtn = document.getElementById("joker-btn");
const timerBar = document.getElementById("timer-bar");
const explanationBox = document.getElementById("explanation-box");
const leaderboardSection = document.getElementById("leaderboard-section");
const leaderboardList = document.getElementById("leaderboard-list");
const leaderboardForm = document.getElementById("leaderboard-form");
const playerNameInput = document.getElementById("player-name");
const saveScoreBtn = document.getElementById("save-score-btn");

let currentDifficulty = 'leicht';
let currentQuestionIndex = 0;
let score = 0;
let currentQuizQuestions = [];
let timerInterval;
let timeLeft = 15;
const TIME_LIMIT = 15;
let jokerUsed = false;
let totalTime = 0;
let questionStartTime = 0;
let highscore = 0;

function initQuiz(difficulty) {
    currentDifficulty = difficulty;
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    
    let diffName = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    currentDiffDisplay.innerText = diffName;
    endDiffDisplay.innerText = diffName;
    
    startQuiz();
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    totalTime = 0;
    jokerUsed = false;
    jokerBtn.disabled = false;
    scoreElement.innerText = score;
    nextButton.innerText = "Nächste Frage";
    
    highscore = parseInt(localStorage.getItem(`bayernHighscore_${currentDifficulty}`)) || 0;
    highscoreElement.innerText = highscore;

    const filteredPool = questionsPool.filter(q => q.difficulty === currentDifficulty);
    const shuffledPool = [...filteredPool].sort(() => 0.5 - Math.random());
    currentQuizQuestions = shuffledPool.slice(0, 10);
    
    showQuestion();
}

function startTimer() {
    timeLeft = TIME_LIMIT;
    timerBar.style.width = "100%";
    timerBar.style.backgroundColor = "#28a745";
    timerBar.classList.remove("pulse-alert");
    
    let startTime = performance.now();

    function updateTimer(currentTime) {
        let elapsed = (currentTime - startTime) / 1000;
        timeLeft = TIME_LIMIT - elapsed;

        let percentage = (timeLeft / TIME_LIMIT) * 100;
        timerBar.style.width = `${Math.max(0, percentage)}%`;

        if (percentage < 30) {
            timerBar.style.backgroundColor = "#DC052D";
            timerBar.classList.add("pulse-alert");
        }

        if (timeLeft <= 0) {
            cancelAnimationFrame(timerInterval);
            timeLeft = 0;
            timeOut();
        } else {
            timerInterval = requestAnimationFrame(updateTimer);
        }
    }

    timerInterval = requestAnimationFrame(updateTimer);
}

function timeOut() {
    totalTime += TIME_LIMIT;
    playSound('wrong');
    resultMessage.textContent = "Zeit abgelaufen!";
    resultMessage.style.color = "#DC052D";
    
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.style.backgroundColor = '#28a745';
            button.style.borderColor = '#28a745';
            button.style.color = '#ffffff';
        }
        button.disabled = true;
        button.style.cursor = 'not-allowed';
        button.style.opacity = '0.6';
    });
    
    showExplanation(currentQuizQuestions[currentQuestionIndex]);
    nextButton.style.display = "block";
}

function showQuestion() {
    resetState();
    startTimer();
    questionStartTime = Date.now();
    
    let currentQuestion = currentQuizQuestions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    if (currentQuestion.image) {
        questionImageElement.src = currentQuestion.image;
        questionImageElement.style.display = "block";
    } else {
        questionImageElement.style.display = "none";
        questionImageElement.src = "";
    }

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });

    showRandomQuotes();
}

jokerBtn.addEventListener("click", () => {
    if (jokerUsed) return;
    jokerUsed = true;
    jokerBtn.disabled = true;
    
    const buttons = Array.from(answerButtonsElement.children);
    const wrongButtons = buttons.filter(btn => btn.dataset.correct !== "true");
    
    let n = wrongButtons.length;
    const limit = Math.min(2, n);
    for (let i = 0; i < limit; i++) {
        const j = i + Math.floor(Math.random() * (n - i));
        const temp = wrongButtons[i];
        wrongButtons[i] = wrongButtons[j];
        wrongButtons[j] = temp;
    }
    const shuffledWrong = wrongButtons.slice(0, limit);
    shuffledWrong.forEach(btn => {
        btn.classList.add("fade-out");
        btn.disabled = true;
    });
});

function showRandomQuotes() {
    const quoteLeft = document.getElementById("quote-left");
    const quoteRight = document.getElementById("quote-right");
    if (!quoteLeft || !quoteRight) return;

    let idx1 = Math.floor(Math.random() * bayernQuotes.length);
    let idx2 = Math.floor(Math.random() * bayernQuotes.length);
    while (idx1 === idx2) { idx2 = Math.floor(Math.random() * bayernQuotes.length); }
    
    quoteLeft.innerText = bayernQuotes[idx1];
    quoteRight.innerText = bayernQuotes[idx2];
}

function resetState() {
    cancelAnimationFrame(timerInterval);
    nextButton.style.display = "none";
    explanationBox.style.display = "none";
    leaderboardSection.style.display = "none";
    resultMessage.textContent = "";
    answerButtonsElement.replaceChildren();
}

function showExplanation(question) {
    if (question.explanation) {
        explanationBox.innerText = `💡 Wusstest du schon? ${question.explanation}`;
        explanationBox.style.display = "block";
    }
}

function selectAnswer(e) {
    cancelAnimationFrame(timerInterval);
    
    let timeTaken = Math.min((Date.now() - questionStartTime) / 1000, TIME_LIMIT);
    totalTime += timeTaken;

    const selectedButton = e.target;
    const isCorrect = selectedButton.dataset.correct === "true";
    const currentQuestion = currentQuizQuestions[currentQuestionIndex];
    
    if (isCorrect) {
        playSound('correct');
        selectedButton.style.backgroundColor = '#28a745';
        selectedButton.style.borderColor = '#28a745';
        selectedButton.style.color = '#ffffff';
        resultMessage.textContent = "Richtig! Toll gemacht!";
        resultMessage.style.color = "#28a745";
        score++;
        scoreElement.innerText = score;

        if (score > highscore) {
            highscore = score;
            localStorage.setItem(`bayernHighscore_${currentDifficulty}`, highscore);
            highscoreElement.innerText = highscore;
        }
    } else {
        playSound('wrong');
        selectedButton.style.backgroundColor = '#DC052D';
        selectedButton.style.color = '#ffffff';
        resultMessage.textContent = "Leider falsch!";
        resultMessage.style.color = "#DC052D";
    }

    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true" && !isCorrect) {
            button.style.backgroundColor = '#28a745';
            button.style.borderColor = '#28a745';
            button.style.color = '#ffffff';
        }
        button.disabled = true;
        button.style.cursor = 'not-allowed';
        button.style.opacity = '0.6';
    });
    
    showExplanation(currentQuestion);
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizQuestions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

function showScore() {
    resetState();
    
    if (score > highscore) {
        highscore = score;
        localStorage.setItem(`bayernHighscore_${currentDifficulty}`, highscore);
        highscoreElement.innerText = highscore;
    }

    let message = "";
    let ratio = score / currentQuizQuestions.length;
    
    if (ratio === 1) {
        message = "Weltklasse! Du hast die Mia-san-Mia-Mentalität. 🏆";
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#DC052D', '#ffffff', '#004BA0'] });
    } else if (ratio >= 0.7) {
        message = "Starke Leistung! Nur wenige Details haben zum Triple gefehlt. ⚽";
    } else if (ratio >= 0.4) {
        message = "Solides Mittelfeld, aber für die Champions League musst du noch trainieren. 🏃‍♂️";
    } else {
        message = "\"Schwach wie eine Flasche leer!\" Da musst du nochmal ins Trainingslager. 📉";
    }

    questionElement.innerText = `Glückwunsch! Du hast ${score} von ${currentQuizQuestions.length} Punkten erreicht!\nBenötigte Zeit: ${totalTime.toFixed(1)} Sekunden\n\n${message}`;
    
    document.querySelector('.tools-header').style.display = 'none';
    
    leaderboardSection.style.display = "block";
    leaderboardForm.style.display = "block";
    playerNameInput.value = "";
    renderLeaderboard();
}

function renderLeaderboard() {
    const storageKey = `bayernLeaderboard_${currentDifficulty}`;
    const leaderboard = JSON.parse(localStorage.getItem(storageKey)) || [];
    leaderboardList.innerHTML = "";

    leaderboard.forEach(entry => {
        const li = document.createElement("li");
        li.style.marginBottom = "5px";

        const strong = document.createElement("strong");
        strong.textContent = entry.name;

        const textNode = document.createTextNode(` - ${entry.score} Punkte (${entry.time.toFixed(1)}s)`);

        li.appendChild(strong);
        li.appendChild(textNode);

        leaderboardList.appendChild(li);
    });
}

saveScoreBtn.addEventListener("click", () => {
    const name = playerNameInput.value.trim() || "Anonym";
    const storageKey = `bayernLeaderboard_${currentDifficulty}`;
    const leaderboard = JSON.parse(localStorage.getItem(storageKey)) || [];

    leaderboard.push({ name: name, score: score, time: totalTime });

    leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.time - b.time;
    });

    const top10 = leaderboard.slice(0, 10);
    localStorage.setItem(storageKey, JSON.stringify(top10));

    leaderboardForm.style.display = "none";
    renderLeaderboard();
});

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < currentQuizQuestions.length) {
        handleNextButton();
    }
});

function renderStartScreenLeaderboards() {
    const difficulties = ['leicht', 'mittel', 'schwer'];
    
    difficulties.forEach(diff => {
        const listElement = document.getElementById(`start-leaderboard-${diff}`);
        const storageKey = `bayernLeaderboard_${diff}`;
        const leaderboard = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        listElement.innerHTML = ""; 
        
        if (leaderboard.length === 0) {
            listElement.innerHTML = "<li class='empty-leaderboard'>Noch keine Einträge</li>";
            return;
        }
        
        const top5 = leaderboard.slice(0, 5);
        
        top5.forEach(entry => {
            const li = document.createElement("li");
            li.style.marginBottom = "4px";
            
            const strong = document.createElement("strong");
            strong.textContent = entry.name;
            
            const textNode = document.createTextNode(` - ${entry.score} Pkt.`);
            
            li.appendChild(strong);
            li.appendChild(textNode);
            
            listElement.appendChild(li);
        });
    });
}

renderStartScreenLeaderboards();

// Globale Zuweisung, damit "onclick" im HTML noch auf das nun exportierte Modul zugreifen kann
window.initQuiz = initQuiz;