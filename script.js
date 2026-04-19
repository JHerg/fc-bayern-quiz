// Audio Context Setup für Sound-Effekte (ohne MP3-Dateien!)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start(); osc.stop(audioCtx.currentTime + 0.2);
    }
}

const bayernQuotes = [
    "\"Eier, wir brauchen Eier!\" – Oliver Kahn",
    "\"Ich habe fertig!\" – Giovanni Trapattoni",
    "\"Mia san mia und das bleibt auch so!\" – Bastian Schweinsteiger",
    "\"Thomas Müller spielt immer.\" – Louis van Gaal",
    "\"Arjen hat's gemacht!\" – Wolff Fuss (CL Finale 2013)"
,
    "\"Das Wichtigste ist, dass wir am Ende der Saison ganz oben stehen.\" – Philipp Lahm",
    "\"Ein gutes Pferd springt nur so hoch, wie es muss.\" – Sepp Maier",
    "\"Fußball ist ein Spiel von Fehlern. Wer die wenigsten macht, gewinnt.\" – Johan Cruyff (oft zitiert in München)",
    "\"Wir haben eine Mannschaft, die immer hungrig ist.\" – Robert Lewandowski",
    "\"Der FC Bayern ist eine Familie.\" – Uli Hoeneß"
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
    }
,
    {
        question: "Wer ist der Rekordtorschütze des FC Bayern München in der Bundesliga?",
        answers: [{ text: "Gerd Müller", correct: true }, { text: "Robert Lewandowski", correct: false }, { text: "Karl-Heinz Rummenigge", correct: false }, { text: "Thomas Müller", correct: false }],
        explanation: "Gerd Müller erzielte 365 Tore in der Bundesliga für den FC Bayern, ein unübertroffener Rekord."
    },
    {
        question: "In welchem Jahr wurde der FC Bayern München gegründet?",
        answers: [{ text: "1899", correct: false }, { text: "1900", correct: true }, { text: "1905", correct: false }, { text: "1910", correct: false }],
        explanation: "Der Verein wurde am 27. Februar 1900 von Franz John und anderen Mitgliedern des MTV München gegründet."
    },
    {
        question: "Wie oft gewann der FC Bayern den Europapokal der Landesmeister bzw. die Champions League (Stand 2023)?",
        answers: [{ text: "4 Mal", correct: false }, { text: "5 Mal", correct: false }, { text: "6 Mal", correct: true }, { text: "7 Mal", correct: false }],
        explanation: "Bayern München hat den wichtigsten europäischen Vereinswettbewerb 6 Mal gewonnen (1974, 1975, 1976, 2001, 2013, 2020)."
    },
    {
        question: "Welcher legendäre Spieler und spätere Präsident trug den Spitznamen 'Der Kaiser'?",
        answers: [{ text: "Uli Hoeneß", correct: false }, { text: "Franz Beckenbauer", correct: true }, { text: "Karl-Heinz Rummenigge", correct: false }, { text: "Lothar Matthäus", correct: false }],
        explanation: "Franz Beckenbauer, einer der besten Fußballer der Geschichte, war als 'Der Kaiser' bekannt."
    },
    {
        question: "Wie heißt das offizielle Maskottchen des FC Bayern München?",
        answers: [{ text: "Bazi", correct: false }, { text: "Berni", correct: true }, { text: "Balu", correct: false }, { text: "Bruno", correct: false }],
        explanation: "Berni, ein Bär, ist seit Mai 2004 das offizielle Maskottchen des Vereins."
    },
    {
        question: "Welcher Spieler brach in der Saison 2020/21 den ewigen Torrekord von Gerd Müller mit 41 Treffern?",
        answers: [{ text: "Harry Kane", correct: false }, { text: "Robert Lewandowski", correct: true }, { text: "Erling Haaland", correct: false }, { text: "Thomas Müller", correct: false }],
        explanation: "Robert Lewandowski erzielte am letzten Spieltag der Saison 20/21 sein 41. Tor und brach damit Müllers Rekord von 40 Toren."
    },
    {
        question: "In welchem Stadion trägt der FC Bayern München seit 2005 seine Heimspiele aus?",
        answers: [{ text: "Olympiastadion", correct: false }, { text: "Allianz Arena", correct: true }, { text: "Grünwalder Stadion", correct: false }, { text: "Audi Dome", correct: false }],
        explanation: "Die Allianz Arena im Münchner Norden ist seit 2005 die Heimstätte des FC Bayern."
    },
    {
        question: "Welcher Torwart war der Held beim Champions-League-Finale 2001 in Mailand?",
        answers: [{ text: "Sepp Maier", correct: false }, { text: "Oliver Kahn", correct: true }, { text: "Manuel Neuer", correct: false }, { text: "Hans-Jörg Butt", correct: false }],
        explanation: "Oliver Kahn hielt im Elfmeterschießen gegen Valencia drei Elfmeter und sicherte den Titel."
    },
    {
        question: "Gegen welche Mannschaft gewann Bayern 2020 das Champions-League-Finale?",
        answers: [{ text: "FC Barcelona", correct: false }, { text: "Paris Saint-Germain", correct: true }, { text: "Real Madrid", correct: false }, { text: "FC Chelsea", correct: false }],
        explanation: "Bayern besiegte PSG mit 1:0 durch ein Tor von Kingsley Coman."
    },
    {
        question: "Wie oft wurde der FC Bayern München bis 2023 Deutscher Meister?",
        answers: [{ text: "30 Mal", correct: false }, { text: "31 Mal", correct: false }, { text: "32 Mal", correct: false }, { text: "33 Mal", correct: true }],
        explanation: "Mit dem Titel 2023 feierte der FC Bayern seine 33. Deutsche Meisterschaft."
    },
    {
        question: "Welcher Spieler hält den Rekord für die meisten Einsätze für den FC Bayern München?",
        answers: [{ text: "Thomas Müller", correct: false }, { text: "Oliver Kahn", correct: false }, { text: "Sepp Maier", correct: true }, { text: "Bastian Schweinsteiger", correct: false }],
        explanation: "Sepp Maier absolvierte 706 Pflichtspiele für den FC Bayern."
    },
    {
        question: "Unter welchem Trainer gewann Bayern das Triple 2020?",
        answers: [{ text: "Hansi Flick", correct: true }, { text: "Pep Guardiola", correct: false }, { text: "Niko Kovač", correct: false }, { text: "Julian Nagelsmann", correct: false }],
        explanation: "Hansi Flick übernahm das Team während der Saison und führte es zum historischen Sextuple."
    },
    {
        question: "Wer war der erste ausländische Torschützenkönig für den FC Bayern in der Bundesliga?",
        answers: [{ text: "Roy Makaay", correct: false }, { text: "Giovane Élber", correct: true }, { text: "Claudio Pizarro", correct: false }, { text: "Luca Toni", correct: false }],
        explanation: "Der Brasilianer Giovane Élber wurde in der Saison 2002/03 gemeinsam mit Thomas Christiansen Torschützenkönig."
    },
    {
        question: "Gegen wen kassierte Bayern 1999 die bittere Niederlage im Champions-League-Finale in Barcelona?",
        answers: [{ text: "Real Madrid", correct: false }, { text: "AC Mailand", correct: false }, { text: "Manchester United", correct: true }, { text: "Juventus Turin", correct: false }],
        explanation: "Manchester United drehte das Spiel in der Nachspielzeit mit zwei Toren von Sheringham und Solskjær."
    },
    {
        question: "Wie hieß das Stadion, in dem der FC Bayern vor der Allianz Arena spielte?",
        answers: [{ text: "Städtisches Stadion an der Grünwalder Straße", correct: false }, { text: "Olympiastadion", correct: true }, { text: "Münchner Stadtstadion", correct: false }, { text: "Bayern-Arena", correct: false }],
        explanation: "Von 1972 bis 2005 trug der FC Bayern seine Heimspiele im Olympiastadion München aus."
    },
    {
        question: "Welcher Spieler wechselte 2014 ablösefrei von Borussia Dortmund zum FC Bayern?",
        answers: [{ text: "Mario Götze", correct: false }, { text: "Mats Hummels", correct: false }, { text: "Robert Lewandowski", correct: true }, { text: "Raphaël Guerreiro", correct: false }],
        explanation: "Robert Lewandowski kam 2014 nach Vertragsende in Dortmund nach München."
    },
    {
        question: "Welcher Bayern-Spieler erzielte 2007 gegen Real Madrid das schnellste Tor der Champions-League-Geschichte?",
        answers: [{ text: "Arjen Robben", correct: false }, { text: "Franck Ribéry", correct: false }, { text: "Thomas Müller", correct: false }, { text: "Roy Makaay", correct: true }],
        explanation: "Roy Makaay traf nach nur 10,12 Sekunden ins Netz."
    },
    {
        question: "Wer war der Manager des FC Bayern München in der erfolgreichsten Zeit der Vereinsgeschichte (1979-2009)?",
        answers: [{ text: "Karl-Heinz Rummenigge", correct: false }, { text: "Uli Hoeneß", correct: true }, { text: "Franz Beckenbauer", correct: false }, { text: "Matthias Sammer", correct: false }],
        explanation: "Uli Hoeneß prägte den Verein über Jahrzehnte als Manager und später als Präsident."
    },
    {
        question: "Mit welchem Verein teilt sich der FC Bayern München die Säbener Straße?",
        answers: [{ text: "TSV 1860 München", correct: false }, { text: "SpVgg Unterhaching", correct: false }, { text: "Keinem, es ist alleiniges Trainingsgelände", correct: true }, { text: "Türkgücü München", correct: false }],
        explanation: "Das Trainingsgelände an der Säbener Straße wird exklusiv vom FC Bayern genutzt."
    },
    {
        question: "Wie viele Tore erzielte der FC Bayern beim 8:2-Sieg gegen den FC Barcelona im CL-Viertelfinale 2020?",
        answers: [{ text: "6", correct: false }, { text: "7", correct: false }, { text: "8", correct: true }, { text: "9", correct: false }],
        explanation: "In einem denkwürdigen Spiel in Lissabon deklassierte Bayern die Katalanen mit 8:2."
    },
    {
        question: "Welcher Spieler hat den Spitznamen 'Basti Fantasti'?",
        answers: [{ text: "Bastian Schweinsteiger", correct: true }, { text: "Sebastian Deisler", correct: false }, { text: "Sebastian Rudy", correct: false }, { text: "Sebastian Rode", correct: false }],
        explanation: "Bastian Schweinsteiger, eine Vereinsikone, wurde von den Fans so genannt."
    },
    {
        question: "Welcher Bayern-Trainer prägte den Satz 'Ich habe fertig!'?",
        answers: [{ text: "Louis van Gaal", correct: false }, { text: "Giovanni Trapattoni", correct: true }, { text: "Pep Guardiola", correct: false }, { text: "Otto Rehhagel", correct: false }],
        explanation: "Der Italiener Giovanni Trapattoni beendete damit 1998 seine legendäre Wutrede."
    },
    {
        question: "Wer ist der aktuelle (2024) Trainer des FC Bayern München?",
        answers: [{ text: "Thomas Tuchel", correct: true }, { text: "Julian Nagelsmann", correct: false }, { text: "Hansi Flick", correct: false }, { text: "Xabi Alonso", correct: false }],
        explanation: "Thomas Tuchel übernahm das Traineramt im Frühjahr 2023."
    },
    {
        question: "Aus welchem Land stammt der Spieler Alphonso Davies?",
        answers: [{ text: "USA", correct: false }, { text: "Kanada", correct: true }, { text: "Jamaika", correct: false }, { text: "England", correct: false }],
        explanation: "Alphonso Davies ist kanadischer Nationalspieler."
    },
    {
        question: "Wer verwandelte den entscheidenden Elfmeter für Bayern im Finale 2001?",
        answers: [{ text: "Stefan Effenberg", correct: false }, { text: "Mehmet Scholl", correct: false }, { text: "Thomas Linke", correct: true }, { text: "Hasan Salihamidžić", correct: false }],
        explanation: "Thomas Linke verwandelte den letzten Elfmeter für Bayern, bevor Kahn gegen Pellegrino hielt."
    },
    {
        question: "Welcher Sponsor ziert (Stand 2024) die Brust der Bayern-Trikots?",
        answers: [{ text: "Allianz", correct: false }, { text: "Audi", correct: false }, { text: "Deutsche Telekom", correct: true }, { text: "Adidas", correct: false }],
        explanation: "Die Deutsche Telekom ist seit 2002 Hauptsponsor auf den Trikots."
    },
    {
        question: "Wie wird das Stadion des FC Bayern umgangssprachlich oft genannt?",
        answers: [{ text: "Schlauchboot", correct: true }, { text: "Ufo", correct: false }, { text: "Reifen", correct: false }, { text: "Kissen", correct: false }],
        explanation: "Wegen ihrer Form wird die Allianz Arena oft als 'Schlauchboot' bezeichnet."
    },
    {
        question: "Welcher ehemalige Bayern-Spieler wurde später Sportvorstand des Vereins?",
        answers: [{ text: "Hasan Salihamidžić", correct: true }, { text: "Oliver Kahn", correct: false }, { text: "Bastian Schweinsteiger", correct: false }, { text: "Philipp Lahm", correct: false }],
        explanation: "Hasan Salihamidžić ('Brazzo') war von 2017 bis 2023 in sportlicher Verantwortung."
    },
    {
        question: "Welcher englische Stürmer wechselte im Sommer 2023 zum FC Bayern?",
        answers: [{ text: "Jadon Sancho", correct: false }, { text: "Marcus Rashford", correct: false }, { text: "Harry Kane", correct: true }, { text: "Raheem Sterling", correct: false }],
        explanation: "Harry Kane kam von Tottenham Hotspur und wurde sofort zu einem Leistungsträger."
    },
    {
        question: "Wer war der Kapitän der Triple-Mannschaft von 2013?",
        answers: [{ text: "Bastian Schweinsteiger", correct: false }, { text: "Philipp Lahm", correct: true }, { text: "Manuel Neuer", correct: false }, { text: "Thomas Müller", correct: false }],
        explanation: "Philipp Lahm führte das Team 2013 als Kapitän zum historischen Erfolg."
    },
    {
        question: "In welcher Stadt feierte der FC Bayern 2020 den Gewinn der Champions League?",
        answers: [{ text: "Istanbul", correct: false }, { text: "London", correct: false }, { text: "Lissabon", correct: true }, { text: "Madrid", correct: false }],
        explanation: "Das 'Final-8-Turnier' fand wegen der Corona-Pandemie in Lissabon statt."
    },
    {
        question: "Wer ist der erfolgreichste ausländische Torschütze des FC Bayern?",
        answers: [{ text: "Claudio Pizarro", correct: false }, { text: "Arjen Robben", correct: false }, { text: "Robert Lewandowski", correct: true }, { text: "Giovane Élber", correct: false }],
        explanation: "Robert Lewandowski erzielte 344 Pflichtspieltore für den FC Bayern."
    },
    {
        question: "Welche Trikotnummer trug Arjen Robben bei den Bayern?",
        answers: [{ text: "7", correct: false }, { text: "10", correct: true }, { text: "11", correct: false }, { text: "25", correct: false }],
        explanation: "Robben trug die ikonische Nummer 10 in seiner Zeit bei Bayern."
    },
    {
        question: "Wie viele Titel gewann Bayern unter Hansi Flick in der Saison 2019/20 und dem darauffolgenden Jahr?",
        answers: [{ text: "4", correct: false }, { text: "5", correct: false }, { text: "6", correct: true }, { text: "7", correct: false }],
        explanation: "Die Bayern gewannen das Sextuple: Meisterschaft, Pokal, CL, DFL-Supercup, UEFA-Supercup und Klub-WM."
    },
    {
        question: "Welcher Brasilianer prägte in den frühen 2000ern den Sturm der Bayern?",
        answers: [{ text: "Aílton", correct: false }, { text: "Marcelinho", correct: false }, { text: "Giovane Élber", correct: true }, { text: "Zé Roberto", correct: false }],
        explanation: "Giovane Élber war jahrelang der treffsicherste Stürmer des Vereins."
    },
    {
        question: "Wer war der Vorgänger von Jupp Heynckes in der Triple-Saison 2012/13?",
        answers: [{ text: "Louis van Gaal", correct: false }, { text: "Jürgen Klinsmann", correct: false }, { text: "Andries Jonker", correct: false }, { text: "Jupp Heynckes selbst war sein eigener Vorgänger (er übernahm schon 2011)", correct: true }],
        explanation: "Heynckes übernahm das Amt 2011 von Andries Jonker (Interim nach van Gaal) und führte das Team 2013 zum Triple."
    },
    {
        question: "Gegen wen schoss Robert Lewandowski 2015 fünf Tore in neun Minuten?",
        answers: [{ text: "Borussia Dortmund", correct: false }, { text: "Bayer Leverkusen", correct: false }, { text: "VfL Wolfsburg", correct: true }, { text: "Schalke 04", correct: false }],
        explanation: "Nach seiner Einwechslung zerlegte er den VfL Wolfsburg im Alleingang."
    },
    {
        question: "Welcher Bayern-Torwart trug oft eine lange Hose beim Spielen?",
        answers: [{ text: "Oliver Kahn", correct: false }, { text: "Sepp Maier", correct: false }, { text: "Gábor Király", correct: false }, { text: "Keiner der genannten", correct: true }],
        explanation: "Király spielte für Hertha und 1860, nicht für Bayern. Bayern-Torhüter trugen in der Regel kurze Hosen."
    },
    {
        question: "Wer schoss das entscheidende Tor für Bayern im Weltpokalfinale 2001?",
        answers: [{ text: "Samuel Kuffour", correct: true }, { text: "Giovane Élber", correct: false }, { text: "Claudio Pizarro", correct: false }, { text: "Hasan Salihamidžić", correct: false }],
        explanation: "Kuffour traf in der Verlängerung zum 1:0 gegen die Boca Juniors."
    },
    {
        question: "Welcher Spieler war für seine präzisen Flanken und Freistöße bekannt und wurde 'Schweizer Messer' genannt?",
        answers: [{ text: "Xherdan Shaqiri", correct: false }, { text: "Mario Basler", correct: false }, { text: "Mehmet Scholl", correct: false }, { text: "Keiner dieser Spieler", correct: true }],
        explanation: "Xherdan Shaqiri wurde 'Kraftwürfel' genannt. Ein 'Schweizer Messer' gab es so nicht."
    },
    {
        question: "In welcher Saison verlor der FC Bayern das 'Finale dahoam'?",
        answers: [{ text: "2009/10", correct: false }, { text: "2010/11", correct: false }, { text: "2011/12", correct: true }, { text: "2012/13", correct: false }],
        explanation: "2012 verlor Bayern das CL-Finale im eigenen Stadion gegen den FC Chelsea."
    },
    {
        question: "Welcher Franzose prägte zusammen mit Arjen Robben eine Ära ('Robbery')?",
        answers: [{ text: "Kingsley Coman", correct: false }, { text: "Franck Ribéry", correct: true }, { text: "Willy Sagnol", correct: false }, { text: "Bixente Lizarazu", correct: false }],
        explanation: "Franck Ribéry spielte 12 Jahre für die Bayern und bildete mit Robben ein geniales Flügelduo."
    },
    {
        question: "Wer war der erste Trainer, der den FC Bayern zur Deutschen Meisterschaft in der Bundesliga führte?",
        answers: [{ text: "Zlatko Čajkovski", correct: false }, { text: "Branko Zebec", correct: true }, { text: "Udo Lattek", correct: false }, { text: "Dettmar Cramer", correct: false }],
        explanation: "Branko Zebec gewann 1969 das erste Double aus Meisterschaft und Pokal für die Bayern."
    },
    {
        question: "Welcher Club ist der größte Rivale der Bayern auf lokaler Ebene?",
        answers: [{ text: "SpVgg Unterhaching", correct: false }, { text: "TSV 1860 München", correct: true }, { text: "FC Augsburg", correct: false }, { text: "1. FC Nürnberg", correct: false }],
        explanation: "Das Münchner Stadtderby gegen 1860 München ('die Löwen') hat eine lange Tradition."
    },
    {
        question: "Welche Farbe hat das Ausweichtrikot der Bayern meist in der Champions League?",
        answers: [{ text: "Rot", correct: false }, { text: "Weiß", correct: false }, { text: "Schwarz oder Dunkelblau", correct: true }, { text: "Grün", correct: false }],
        explanation: "Oft treten die Bayern international in dunklen Ausweichtrikots an."
    },
    {
        question: "Welcher Spieler kam 2007 zusammen mit Luca Toni und Franck Ribéry zu den Bayern?",
        answers: [{ text: "Miroslav Klose", correct: true }, { text: "Lukas Podolski", correct: false }, { text: "Bastian Schweinsteiger", correct: false }, { text: "Mark van Bommel", correct: false }],
        explanation: "Miroslav Klose wechselte im Sommer 2007 von Werder Bremen zu den Bayern."
    },
    {
        question: "Wie heißt die Fangruppierung, die in der Südkurve steht?",
        answers: [{ text: "Schickeria", correct: true }, { text: "Inferno", correct: false }, { text: "Red München", correct: false }, { text: "Bavaria Ultras", correct: false }],
        explanation: "Die 'Schickeria München' ist die bekannteste Ultra-Gruppierung des Vereins."
    }
    // Du kannst optional bei jeder Frage ein 'explanation: "..."' hinzufügen.
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
let highscore = localStorage.getItem("bayernHighscore") || 0;
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
    
    timerInterval = setInterval(() => {
        timeLeft -= 0.1;
        let percentage = (timeLeft / TIME_LIMIT) * 100;
        timerBar.style.width = `${percentage}%`;

        if (percentage < 30) {
            timerBar.style.backgroundColor = "#DC052D"; // Rot bei < 30%
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeOut();
        }
    }, 100);
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
    const shuffledWrong = wrongButtons.sort(() => 0.5 - Math.random()).slice(0, 2);
    shuffledWrong.forEach(btn => {
        btn.style.visibility = "hidden";
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
    clearInterval(timerInterval);
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
    clearInterval(timerInterval); // Timer stoppen
    
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
