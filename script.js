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

const questionsPool = [
    { question: "Wer schoss den Siegtreffer für den FC Bayern im Champions-League-Finale 2013?", answers: [{ text: "Thomas Müller", correct: false }, { text: "Franck Ribéry", correct: false }, { text: "Arjen Robben", correct: true }, { text: "Mario Mandžukić", correct: false }] },
    { question: "Welcher Trainer führte die Bayern 2013 zum ersten Triple der Vereinsgeschichte?", answers: [{ text: "Pep Guardiola", correct: false }, { text: "Jupp Heynckes", correct: true }, { text: "Louis van Gaal", correct: false }, { text: "Carlo Ancelotti", correct: false }] },
    { question: "Wer erzielte per Kopf das 1:0-Siegtor im Champions-League-Finale 2020 gegen PSG?", answers: [{ text: "Robert Lewandowski", correct: false }, { text: "Serge Gnabry", correct: false }, { text: "Kingsley Coman", correct: true }, { text: "Joshua Kimmich", correct: false }] },
    { question: "Unter welchem Trainer gewann der FC Bayern im Jahr 2020 das historische Sextuple?", answers: [{ text: "Niko Kovač", correct: false }, { text: "Hansi Flick", correct: true }, { text: "Julian Nagelsmann", correct: false }, { text: "Thomas Tuchel", correct: false }] },
    { question: "Welcher Spieler brach in der Saison 2020/21 den ewigen Bundesliga-Torrekord mit 41 Treffern?", answers: [{ text: "Robert Lewandowski", correct: true }, { text: "Harry Kane", correct: false }, { text: "Mario Gómez", correct: false }, { text: "Thomas Müller", correct: false }] },
    { question: "Welcher spanische Star-Trainer übernahm den FC Bayern im Sommer 2013?", answers: [{ text: "Luis Enrique", correct: false }, { text: "Unai Emery", correct: false }, { text: "Pep Guardiola", correct: true }, { text: "Xabi Alonso", correct: false }] },
    { question: "Aus welchem Land wechselte Harry Kane im Jahr 2023 zum Rekordmeister?", answers: [{ text: "Spanien", correct: false }, { text: "Italien", correct: false }, { text: "England", correct: true }, { text: "Frankreich", correct: false }] },
    { question: "Wer schoss in der 89. Minute das entscheidende Tor zur Meisterschaft 2023 gegen den 1. FC Köln?", answers: [{ text: "Jamal Musiala", correct: true }, { text: "Leroy Sané", correct: false }, { text: "Leon Goretzka", correct: false }, { text: "Serge Gnabry", correct: false }] },
    { question: "Welcher Bayern-Spieler erzielte 2019 beim 7:2-Sieg gegen Tottenham Hotspur vier Tore?", answers: [{ text: "Robert Lewandowski", correct: false }, { text: "Serge Gnabry", correct: true }, { text: "Thomas Müller", correct: false }, { text: "Kingsley Coman", correct: false }] },
    { question: "Von welchem Verein wechselte Manuel Neuer im Jahr 2011 zum FC Bayern?", answers: [{ text: "Borussia Dortmund", correct: false }, { text: "Werder Bremen", correct: false }, { text: "FC Schalke 04", correct: true }, { text: "VfB Stuttgart", correct: false }] },
    { question: "Wer wurde nach der Triple-Saison 2013 zu Europas Fußballer des Jahres gewählt?", answers: [{ text: "Arjen Robben", correct: false }, { text: "Franck Ribéry", correct: true }, { text: "Philipp Lahm", correct: false }, { text: "Bastian Schweinsteiger", correct: false }] },
    { question: "Welcher Bayern-Star prägte für sich selbst den Begriff 'Raumdeuter'?", answers: [{ text: "Thomas Müller", correct: true }, { text: "Mario Götze", correct: false }, { text: "Thiago", correct: false }, { text: "Toni Kroos", correct: false }] },
    { question: "Von welchem englischen Club kam Jérôme Boateng 2011 nach München?", answers: [{ text: "FC Chelsea", correct: false }, { text: "FC Arsenal", correct: false }, { text: "Manchester United", correct: false }, { text: "Manchester City", correct: true }] },
    { question: "Über welchen Spieler sagte Pep Guardiola den berühmten Satz: '... oder nix'?", answers: [{ text: "Xabi Alonso", correct: false }, { text: "Thiago", correct: true }, { text: "Javi Martínez", correct: false }, { text: "Arturo Vidal", correct: false }] },
    { question: "Wer entschied 2020 das Spitzenspiel gegen den BVB mit einem traumhaften Lupfer aus 20 Metern?", answers: [{ text: "Joshua Kimmich", correct: true }, { text: "Thiago", correct: false }, { text: "Leon Goretzka", correct: false }, { text: "David Alaba", correct: false }] },
    { question: "Welcher Kanadier schaffte in der Triple-Saison 2019/20 seinen Durchbruch als Linksverteidiger?", answers: [{ text: "Jonathan David", correct: false }, { text: "Alphonso Davies", correct: true }, { text: "Tajon Buchanan", correct: false }, { text: "Cyle Larin", correct: false }] },
    { question: "Gegen welchen europäischen Top-Club gewann Bayern 2020 in der Champions League mit 8:2?", answers: [{ text: "Real Madrid", correct: false }, { text: "Juventus Turin", correct: false }, { text: "FC Barcelona", correct: true }, { text: "FC Chelsea", correct: false }] },
    { question: "In welchem Jahr beendete der langjährige Kapitän Philipp Lahm seine Karriere?", answers: [{ text: "2015", correct: false }, { text: "2016", correct: false }, { text: "2017", correct: true }, { text: "2018", correct: false }] },
    { question: "Zusammen mit Philipp Lahm beendete 2017 noch ein weiterer Weltstar seine Karriere. Wer?", answers: [{ text: "Xabi Alonso", correct: true }, { text: "Franck Ribéry", correct: false }, { text: "Arjen Robben", correct: false }, { text: "Bastian Schweinsteiger", correct: false }] },
    { question: "Zu welchem Verein in die Premier League wechselte Bastian Schweinsteiger 2015?", answers: [{ text: "FC Arsenal", correct: false }, { text: "FC Chelsea", correct: false }, { text: "Manchester City", correct: false }, { text: "Manchester United", correct: true }] },
    { question: "Wohin zog es David Alaba nach seinem Abschied vom FC Bayern im Jahr 2021?", answers: [{ text: "FC Barcelona", correct: false }, { text: "Paris Saint-Germain", correct: false }, { text: "Real Madrid", correct: true }, { text: "FC Chelsea", correct: false }] },
    { question: "Welcher Spieler wechselte 2013 durch eine Ausstiegsklausel von Dortmund zu Bayern?", answers: [{ text: "Mats Hummels", correct: false }, { text: "Robert Lewandowski", correct: false }, { text: "Mario Götze", correct: true }, { text: "Marco Reus", correct: false }] },
    { question: "Welcher Weltmeister kehrte 2016 von Dortmund zum FC Bayern zurück?", answers: [{ text: "Mario Götze", correct: false }, { text: "Mats Hummels", correct: true }, { text: "Sebastian Rode", correct: false }, { text: "Niklas Süle", correct: false }] },
    { question: "Welcher Innenverteidiger ging 2022 den umgekehrten Weg und wechselte von Bayern zum BVB?", answers: [{ text: "Mats Hummels", correct: false }, { text: "Niklas Süle", correct: true }, { text: "Jérôme Boateng", correct: false }, { text: "Holger Badstuber", correct: false }] },
    { question: "Von welchem Bundesliga-Konkurrenten verpflichtete Bayern 2021 Dayot Upamecano?", answers: [{ text: "Borussia Dortmund", correct: false }, { text: "Bayer Leverkusen", correct: false }, { text: "RB Leipzig", correct: true }, { text: "VfL Wolfsburg", correct: false }] },
    { question: "Aus welcher italienischen Stadt wechselte Matthijs de Ligt zum FC Bayern?", answers: [{ text: "Mailand", correct: false }, { text: "Rom", correct: false }, { text: "Neapel", correct: false }, { text: "Turin", correct: true }] },
    { question: "Welcher deutsche Nationalspieler kam 2020 von Manchester City an die Isar?", answers: [{ text: "Ilkay Gündogan", correct: false }, { text: "Leroy Sané", correct: true }, { text: "Antonio Rüdiger", correct: false }, { text: "Timo Werner", correct: false }] },
    { question: "Welcher senegalesische Star stürmte in der Saison 2022/23 für die Bayern?", answers: [{ text: "Sadio Mané", correct: true }, { text: "Kalidou Koulibaly", correct: false }, { text: "Idrissa Gueye", correct: false }, { text: "Edouard Mendy", correct: false }] },
    { question: "Wer übernahm im März 2023 das Traineramt von Julian Nagelsmann?", answers: [{ text: "Hansi Flick", correct: false }, { text: "Thomas Tuchel", correct: true }, { text: "Jupp Heynckes", correct: false }, { text: "Xabi Alonso", correct: false }] },
    { question: "Von welchem Club kam Trainer Julian Nagelsmann im Jahr 2021 zum FC Bayern?", answers: [{ text: "TSG Hoffenheim", correct: false }, { text: "RB Leipzig", correct: true }, { text: "Borussia Dortmund", correct: false }, { text: "Eintracht Frankfurt", correct: false }] },
    { question: "Unter welchem Trainer gewann Bayern 2019 das Double aus Meisterschaft und Pokal?", answers: [{ text: "Niko Kovač", correct: true }, { text: "Carlo Ancelotti", correct: false }, { text: "Hansi Flick", correct: false }, { text: "Pep Guardiola", correct: false }] },
    { question: "Wer trat 2016 die Nachfolge von Pep Guardiola als Bayern-Trainer an?", answers: [{ text: "Jupp Heynckes", correct: false }, { text: "Louis van Gaal", correct: false }, { text: "Carlo Ancelotti", correct: true }, { text: "Niko Kovač", correct: false }] },
    { question: "In welchem Jahr machten 'Robbery' (Robben & Ribéry) ihr letztes Spiel für den FC Bayern?", answers: [{ text: "2018", correct: false }, { text: "2019", correct: true }, { text: "2020", correct: false }, { text: "2021", correct: false }] },
    { question: "Welches Team beendete 2024 die Serie von 11 Bayern-Meisterschaften in Folge?", answers: [{ text: "Borussia Dortmund", correct: false }, { text: "RB Leipzig", correct: false }, { text: "Bayer Leverkusen", correct: true }, { text: "VfB Stuttgart", correct: false }] },
    { question: "Von welchem englischen Club wurde Rekord-Einkauf Harry Kane verpflichtet?", answers: [{ text: "Manchester United", correct: false }, { text: "FC Arsenal", correct: false }, { text: "FC Chelsea", correct: false }, { text: "Tottenham Hotspur", correct: true }] },
    { question: "Welches französische Sturm-Talent verpflichtete der FC Bayern 2022 von Stade Rennes?", answers: [{ text: "Kingsley Coman", correct: false }, { text: "Mathys Tel", correct: true }, { text: "Michael Olise", correct: false }, { text: "Dayot Upamecano", correct: false }] },
    { question: "Wer kam 2023 als amtierender italienischer Meister aus Neapel für die Abwehr?", answers: [{ text: "Matthijs de Ligt", correct: false }, { text: "Lucas Hernández", correct: false }, { text: "Kim Min-jae", correct: true }, { text: "Eric Dier", correct: false }] },
    { question: "Welcher österreichische Mittelfeldspieler kam 2023 ablösefrei von RB Leipzig?", answers: [{ text: "Marcel Sabitzer", correct: false }, { text: "Konrad Laimer", correct: true }, { text: "Xaver Schlager", correct: false }, { text: "Christoph Baumgartner", correct: false }] },
    { question: "Wer wechselte 2023 ablösefrei von Borussia Dortmund zum FC Bayern?", answers: [{ text: "Raphaël Guerreiro", correct: true }, { text: "Mats Hummels", correct: false }, { text: "Julian Brandt", correct: false }, { text: "Marco Reus", correct: false }] },
    { question: "Wobei verletzte sich Manuel Neuer Ende 2022 so schwer, dass er fast ein Jahr ausfiel?", answers: [{ text: "Beim Tennis", correct: false }, { text: "Beim Skitourengehen", correct: true }, { text: "Beim Radfahren", correct: false }, { text: "Beim Reiten", correct: false }] },
    { question: "Wer wurde im Januar 2023 als Ersatz für den verletzten Manuel Neuer verpflichtet?", answers: [{ text: "Kevin Trapp", correct: false }, { text: "Alexander Nübel", correct: false }, { text: "Yann Sommer", correct: true }, { text: "Koen Casteels", correct: false }] },
    { question: "Welcher Torhüter vertritt Manuel Neuer seit Jahren immer wieder als zuverlässige Nummer 2?", answers: [{ text: "Tom Starke", correct: false }, { text: "Pepe Reina", correct: false }, { text: "Sven Ulreich", correct: true }, { text: "Christian Früchtl", correct: false }] },
    { question: "Aus welchem Land stammt Eric Maxim Choupo-Moting, der von 2020 bis 2024 für Bayern spielte?", answers: [{ text: "Senegal", correct: false }, { text: "Elfenbeinküste", correct: false }, { text: "Kamerun", correct: true }, { text: "Nigeria", correct: false }] },
    { question: "Zusammen mit welchem Spieler wechselte Noussair Mazraoui 2022 von Ajax Amsterdam zu Bayern?", answers: [{ text: "Matthijs de Ligt", correct: false }, { text: "Ryan Gravenberch", correct: true }, { text: "Daley Blind", correct: false }, { text: "Frenkie de Jong", correct: false }] },
    { question: "Welches Eigengewächs feierte in der Saison 2023/24 seinen Durchbruch im zentralen Mittelfeld?", answers: [{ text: "Aleksandar Pavlović", correct: true }, { text: "Angelo Stiller", correct: false }, { text: "Frans Krätzig", correct: false }, { text: "Paul Wanner", correct: false }] },
    { question: "Welcher Abwehrspieler wurde 2023/24 an Bayer Leverkusen ausgeliehen und holte dort das Double?", answers: [{ text: "Josip Stanišić", correct: true }, { text: "Tanguy Nianzou", correct: false }, { text: "Chris Richards", correct: false }, { text: "Bouna Sarr", correct: false }] },
    { question: "Welcher Rechtsverteidiger kam im Winter 2024 von Galatasaray Istanbul?", answers: [{ text: "Sacha Boey", correct: true }, { text: "Noussair Mazraoui", correct: false }, { text: "Nordi Mukiele", correct: false }, { text: "Kieran Trippier", correct: false }] },
    { question: "Welchen englischen Abwehrspieler holte Bayern im Januar 2024 von Tottenham?", answers: [{ text: "Kieran Trippier", correct: false }, { text: "Kyle Walker", correct: false }, { text: "Eric Dier", correct: true }, { text: "Harry Maguire", correct: false }] },
    { question: "Wer wurde im Sommer 2024 neuer Cheftrainer des FC Bayern?", answers: [{ text: "Xabi Alonso", correct: false }, { text: "Vincent Kompany", correct: true }, { text: "Roberto De Zerbi", correct: false }, { text: "Julian Nagelsmann", correct: false }] },
    { question: "Gegen welchen Club verlor der FC Bayern 2012 das 'Finale dahoam', bevor 2013 die goldene Ära startete?", answers: [{ text: "Manchester United", correct: false }, { text: "FC Barcelona", correct: false }, { text: "FC Chelsea", correct: true }, { text: "Inter Mailand", correct: false }] }
];
];

const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const resultMessage = document.getElementById("result-message");
const scoreElement = document.getElementById("score");

let currentQuestionIndex = 0;
let score = 0;
let currentQuizQuestions = [];

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.innerText = score;
    nextButton.innerText = "Nächste Frage";
    
    // 10 zufällige Fragen aus dem 50er-Pool auswählen
    const shuffledPool = [...questionsPool].sort(() => 0.5 - Math.random());
    currentQuizQuestions = shuffledPool.slice(0, 10);
    
    showQuestion();
}

function showQuestion() {
    resetState();
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
    if (currentQuestionIndex < currentQuizQuestions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

function showScore() {
    resetState();
    questionElement.innerText = `Glückwunsch! Du hast ${score} von ${currentQuizQuestions.length} Punkten erreicht!`;
    nextButton.innerText = "Quiz neu starten";
    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < currentQuizQuestions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

// Startet das Quiz, sobald die Seite geladen wird
startQuiz();