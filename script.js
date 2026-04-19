// Audio Context Setup für Sound-Effekte (ohne MP3-Dateien!)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        osc.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        osc.frequency.linearRampToValueAtTime(1108.73, audioCtx.currentTime + 0.2); // C#6
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    }
}

const bayernQuotes = [
    "\"Eier, wir brauchen Eier!\" – Oliver Kahn",
    "\"Ich habe fertig!\" – Giovanni Trapattoni",
    "\"Mia san mia und das bleibt auch so!\" – Bastian Schweinsteiger",
    "\"Thomas Müller spielt immer.\" – Louis van Gaal",
    "\"Arjen hat's gemacht!\" – Wolff Fuss (CL Finale 2013)"
    // Fülle hier deine weiteren Zitate aus deinem alten Skript ein...
];

// Beispielhaft mit Erklärungen (Trivia) bei den ersten 3 Fragen ausgestattet!
const questionsPool = [
    { 
        question: "Wer schoss den Siegtreffer für den FC Bayern im Champions-League-Finale 2013?", 
        answers: [{ text: "Thomas Müller", correct: false }, { text: "Franck Ribéry", correct: false }, { text: "Arjen Robben", correct: true }, { text: "Mario Mandžukić", correct: false }],
        explanation: "In der 89. Minute spitzelte Arjen Robben den Ball an Roman Weidenfeller vorbei ins Netz und erlöste ganz München."
    },
    { 
        question: "Welcher Trainer führte die Bayern 2013 zum ersten Triple der Vereinsgeschichte?", 
        answers: [{ text: "Pep Guardiola", correct: false }, { text: "Jupp Heynckes", correct: true }, { text: "Louis van Gaal", correct: false }, { text: "Carlo Ancelotti", correct: false }],
        explanation: "Jupp Heynckes krönte seine Karriere mit dem Triple aus Meisterschaft, DFB-Pokal und Champions League, bevor Pep Guardiola übernahm."
    },
    { 
        question: "Wer erzielte per Kopf das 1:0-Siegtor im Champions-League-Finale 2020 gegen PSG?", 
        answers: [{ text: "Robert Lewandowski", correct: false }, { text: "Serge Gnabry", correct: false }, { text: "Kingsley Coman", correct: true }, { text: "Joshua Kimmich", correct: false }],
        explanation: "Ausgerechnet der in Paris geborene Kingsley Coman köpfte die Bayern nach einer Flanke von Kimmich zum Titel."
    },
    {
        question: "Wer ist der Rekordtorschütze des FC Bayern München in der Bundesliga?",
        answers: [{ text: "Robert Lewandowski", correct: false }, { text: "Gerd Müller", correct: true }, { text: "Thomas Müller", correct: false }, { text: "Karl-Heinz Rummenigge", correct: false }],
        explanation: "Der 'Bomber der Nation', Gerd Müller, erzielte unglaubliche 365 Bundesliga-Tore für den FC Bayern."
    },
    {
        question: "In welchem Jahr wurde der FC Bayern München gegründet?",
        answers: [{ text: "1899", correct: false }, { text: "1900", correct: true }, { text: "1905", correct: false }, { text: "1920", correct: false }],
        explanation: "Am 27. Februar 1900 wurde der Club im Restaurant 'Gisela' in München gegründet."
    },
    {
        question: "Wie oft gewann der FC Bayern den Europapokal der Landesmeister bzw. die Champions League (Stand 2023)?",
        answers: [{ text: "4 Mal", correct: false }, { text: "5 Mal", correct: false }, { text: "6 Mal", correct: true }, { text: "7 Mal", correct: false }],
        explanation: "Der FCB triumphierte 1974, 1975, 1976, 2001, 2013 und 2020 in der Königsklasse."
    },
    {
        question: "Welcher legendäre Spieler und spätere Präsident trug den Spitznamen 'Der Kaiser'?",
        answers: [{ text: "Uli Hoeneß", correct: false }, { text: "Franz Beckenbauer", correct: true }, { text: "Paul Breitner", correct: false }, { text: "Lothar Matthäus", correct: false }],
        explanation: "Franz Beckenbauer prägte den deutschen Fußball und den FC Bayern wie kaum ein anderer und wurde als 'Kaiser' weltberühmt."
    },
    {
        question: "Wie heißt das offizielle Maskottchen des FC Bayern München?",
        answers: [{ text: "Bazi", correct: false }, { text: "Berni", correct: true }, { text: "Bavaria", correct: false }, { text: "Münchi", correct: false }],
        explanation: "Der Bär 'Berni' ist seit Mai 2004 das Maskottchen und heizt den Fans bei Heimspielen ein."
    },
    {
        question: "Welcher Spieler brach in der Saison 2020/21 den ewigen Torrekord von Gerd Müller mit 41 Treffern?",
        answers: [{ text: "Harry Kane", correct: false }, { text: "Mario Gómez", correct: false }, { text: "Robert Lewandowski", correct: true }, { text: "Roy Makaay", correct: false }],
        explanation: "Robert Lewandowski erzielte am letzten Spieltag in der 90. Minute sein 41. Saisontor und sicherte sich den historischen Rekord."
    },
    {
        question: "In welchem Stadion trägt der FC Bayern München seit 2005 seine Heimspiele aus?",
        answers: [{ text: "Olympiastadion", correct: false }, { text: "Grünwalder Stadion", correct: false }, { text: "Allianz Arena", correct: true }, { text: "Audi Dome", correct: false }],
        explanation: "Nach vielen Jahren im Olympiastadion zog der FC Bayern zur Saison 2005/06 in die neu erbaute Allianz Arena um."
    }
];

const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const resultMessage = document.getElementById("result-message");
const scoreElement = document.getElementById("score");
const highscoreElement = document.getElementById("highscore");
const jokerBtn = document.getElementById("joker-btn");
const timerBar = document.getElementById("timer-bar");
const explanationBox = document.getElementById("explanation-box");

let currentQuestionIndex = 0;
let score = 0;
let currentQuizQuestions = [];
let timerInterval;
let timeLeft = 15; // 15 Sekunden pro Frage
const TIME_LIMIT = 15;
let jokerUsed = false;

// Highscore aus dem lokalen Browser-Speicher laden
let highscore = parseInt(localStorage.getItem("bayernHighscore")) || 0;
highscoreElement.innerText = highscore;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    jokerUsed = false;
    jokerBtn.disabled = false;
    scoreElement.innerText = score;
    nextButton.innerText = "Nächste Frage";
    
    const shuffledPool = [...questionsPool].sort(() => 0.5 - Math.random());
    currentQuizQuestions = shuffledPool.slice(0, 10);
    
    showQuestion();
}

function startTimer() {
    timeLeft = TIME_LIMIT;
    timerBar.style.width = "100%";
    timerBar.style.backgroundColor = "#28a745"; // Grün
    timerBar.classList.remove("pulse-alert");
    
    let startTime = performance.now();

    function updateTimer(currentTime) {
        let elapsed = (currentTime - startTime) / 1000; // in seconds
        timeLeft = TIME_LIMIT - elapsed;

        let percentage = (timeLeft / TIME_LIMIT) * 100;
        timerBar.style.width = `${Math.max(0, percentage)}%`;

        if (percentage < 30) {
            timerBar.style.backgroundColor = "#DC052D"; // Rot bei < 30%
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
    playSound('wrong');
    resultMessage.textContent = "Zeit abgelaufen!";
    resultMessage.style.color = "#DC052D";
    
    // Deaktiviere Buttons und zeige richtige Antwort
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
    
    let currentQuestion = currentQuizQuestions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

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

// 50:50 Joker Logik
jokerBtn.addEventListener("click", () => {
    if (jokerUsed) return;
    jokerUsed = true;
    jokerBtn.disabled = true;
    
    const buttons = Array.from(answerButtonsElement.children);
    const wrongButtons = buttons.filter(btn => btn.dataset.correct !== "true");
    
    // Zwei zufällige falsche Antworten ausblenden/deaktivieren
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
    resultMessage.textContent = "";
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function showExplanation(question) {
    if (question.explanation) {
        explanationBox.innerText = `💡 Wusstest du schon? ${question.explanation}`;
        explanationBox.style.display = "block";
    }
}

function selectAnswer(e) {
    cancelAnimationFrame(timerInterval); // Timer stoppen
    
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

        // Update highscore immediately during the quiz
        if (score > highscore) {
            highscore = score;
            localStorage.setItem("bayernHighscore", highscore);
            highscoreElement.innerText = highscore;
        }
    } else {
        playSound('wrong');
        selectedButton.style.backgroundColor = '#DC052D';
        selectedButton.style.color = '#ffffff';
        resultMessage.textContent = "Leider falsch!";
        resultMessage.style.color = "#DC052D";
    }

    // Alle Buttons deaktivieren
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
    
    // Highscore aktualisieren
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("bayernHighscore", highscore);
        highscoreElement.innerText = highscore;
    }

    let message = "";
    let ratio = score / currentQuizQuestions.length;
    
    if (ratio === 1) {
        message = "Weltklasse! Du hast die Mia-san-Mia-Mentalität. 🏆";
    } else if (ratio >= 0.7) {
        message = "Starke Leistung! Nur wenige Details haben zum Triple gefehlt. ⚽";
    } else if (ratio >= 0.4) {
        message = "Solides Mittelfeld, aber für die Champions League musst du noch trainieren. 🏃‍♂️";
    } else {
        message = "\"Schwach wie eine Flasche leer!\" Da musst du nochmal ins Trainingslager. 📉";
    }

    questionElement.innerText = `Glückwunsch! Du hast ${score} von ${currentQuizQuestions.length} Punkten erreicht!\n\n${message}`;
    
    // Tools ausblenden beim Endbildschirm
    document.querySelector('.tools-header').style.display = 'none';
    
    nextButton.innerText = "Revanche starten";
    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < currentQuizQuestions.length) {
        handleNextButton();
    } else {
        document.querySelector('.tools-header').style.display = 'flex'; // Tools wieder einblenden
        startQuiz();
    }
});

// Start
startQuiz();
