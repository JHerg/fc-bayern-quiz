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
    "\„Weiter, immer weiter!“ – Oliver Kahn",
    "\„Wir haben einfach diese Mia-san-mia-Mentalität.“ – Thomas Müller",
    "\„Schau'n mer mal, dann sehn mer scho.“ – Franz Beckenbauer",
    "\„Ich habe fertig!“ – Giovanni Trapattoni",
    "\„Thomas Müller spielt immer.“ – Louis van Gaal",
    "\„Der FC Bayern ist nicht nur ein Verein, sondern eine Familie.“ – Franck Ribéry",
    "\„Was erlauben Strunz?“ – Giovanni Trapattoni",
    "\„Eier, wir brauchen Eier!“ – Oliver Kahn",
    "\„Das ist der FC Bayern, hier gibt es keine Ausreden.“ – Bastian Schweinsteiger",
    "\„Es gibt nur ein Gas: Vollgas!“ – Hasan Salihamidžić",
    "\„Wir müssen immer ans Limit gehen.“ – Manuel Neuer",
    "\„Mia san mia!“ – Das Vereinsmotto",
    "\„Fußball ist ein Spiel von Fehlern. Wer die wenigsten macht, gewinnt.“ – Pep Guardiola (während seiner Bayern-Zeit)",
    "\„Arjen hat's gemacht!“ – Wolff Fuss (Champions League Finale 2013)"
];

const questions = [
    {
        question: "Welches Tier ist das Maskottchen des FC Bayern München?",
        answers: [
            { text: "Ein Geißbock", correct: false },
            { text: "Ein Adler", correct: false },
            { text: "Ein Bär namens Berni", correct: true },
            { text: "Ein Dinosaurier", correct: false }
        ]
    },
    {
        question: "Welche Farben hat das Trikot des FC Bayern meistens bei Heimspielen?",
        answers: [
            { text: "Blau und Weiß", correct: false },
            { text: "Rot und Weiß", correct: true },
            { text: "Schwarz und Gelb", correct: false },
            { text: "Grün und Weiß", correct: false }
        ]
    },
    {
        question: "Wie heißt das große, oft leuchtende Stadion des FC Bayern?",
        answers: [
            { text: "Allianz Arena", correct: true },
            { text: "Olympiastadion", correct: false },
            { text: "Signal Iduna Park", correct: false },
            { text: "Camp Nou", correct: false }
        ]
    },
    {
        question: "Wie lautet der berühmte Spruch der Bayern-Fans?",
        answers: [
            { text: "Echte Liebe", correct: false },
            { text: "Nur der FCB", correct: false },
            { text: "Mia san mia", correct: true },
            { text: "Wir sind München", correct: false }
        ]
    },
    {
        question: "Welcher dieser Spieler ist ein weltberühmter Torwart des FC Bayern?",
        answers: [
            { text: "Thomas Müller", correct: false },
            { text: "Jamal Musiala", correct: false },
            { text: "Harry Kane", correct: false },
            { text: "Manuel Neuer", correct: true }
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const resultMessage = document.getElementById("result-message");
const scoreElement = document.getElementById("score");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.innerText = score;
    nextButton.innerText = "Nächste Frage";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
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

function showRandomQuotes() {
    const quoteLeft = document.getElementById("quote-left");
    const quoteRight = document.getElementById("quote-right");
    
    if (!quoteLeft || !quoteRight) return;

    let idx1 = Math.floor(Math.random() * bayernQuotes.length);
    let idx2 = Math.floor(Math.random() * bayernQuotes.length);
    
    while (idx1 === idx2) {
        idx2 = Math.floor(Math.random() * bayernQuotes.length);
    }
    
    quoteLeft.innerText = bayernQuotes[idx1];
    quoteRight.innerText = bayernQuotes[idx2];
}

function resetState() {
    nextButton.style.display = "none";
    resultMessage.textContent = "";
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const isCorrect = selectedButton.dataset.correct === "true";
    
    if (isCorrect) {
        selectedButton.style.backgroundColor = '#28a745';
        selectedButton.style.borderColor = '#28a745';
        selectedButton.style.color = '#ffffff';
        resultMessage.textContent = "Richtig! Toll gemacht!";
        resultMessage.style.color = "#28a745";
        score++;
        scoreElement.innerText = score;
    } else {
        selectedButton.style.backgroundColor = '#DC052D';
        selectedButton.style.color = '#ffffff';
        resultMessage.textContent = "Leider falsch!";
        resultMessage.style.color = "#DC052D";
    }

    // Alle Buttons deaktivieren und bei einer falschen Antwort die richtige grün markieren
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
    
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

function showScore() {
    resetState();
    questionElement.innerText = `Glückwunsch! Du hast ${score} von ${questions.length} Punkten erreicht!`;
    nextButton.innerText = "Quiz neu starten";
    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

// Startet das Quiz, sobald die Seite geladen wird
startQuiz();