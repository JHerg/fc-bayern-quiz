// Audio Context Setup für Sound-Effekte (ohne MP3-Dateien!)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    if (type === 'correct') {
        // Fanfare (C4 - E4 - G4 - C5)
        const notes = [261.63, 329.63, 392.00, 523.25];
        const times = [0, 0.15, 0.3, 0.45];
        const duration = 0.4; // Dauer der letzten Note

        notes.forEach((freq, index) => {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.type = 'square'; // Bläser-artiger Klang
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + times[index]);

            gainNode.gain.setValueAtTime(0, audioCtx.currentTime + times[index]);
            gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + times[index] + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + times[index] + (index === notes.length - 1 ? duration : 0.15));

            osc.start(audioCtx.currentTime + times[index]);
            osc.stop(audioCtx.currentTime + times[index] + (index === notes.length - 1 ? duration : 0.15));
        });
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

        // Sprachausgabe "Loser!"
        const utterance = new SpeechSynthesisUtterance('Loser!');
        utterance.lang = 'de-DE';
        utterance.pitch = 0.5; // Eine etwas tiefere, gemeinere Stimme
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
    "„Weiter, immer weiter!“ – Oliver Kahn",
    "„Wir haben einfach diese Mia-san-mia-Mentalität.“ – Thomas Müller",
    "„Schau'n mer mal, dann sehn mer scho.“ – Franz Beckenbauer",
    "„Ich habe fertig!“ – Giovanni Trapattoni",
    "„Thomas Müller spielt immer.“ – Louis van Gaal",
    "„Der FC Bayern ist nicht nur ein Verein, sondern eine Familie.“ – Franck Ribéry",
    "„Was erlauben Strunz?“ – Giovanni Trapattoni",
    "„Eier, wir brauchen Eier!“ – Oliver Kahn",
    "„Das ist der FC Bayern, hier gibt es keine Ausreden.“ – Bastian Schweinsteiger",
    "„Es gibt nur ein Gas: Vollgas!“ – Hasan Salihamidžić",
    "„Wir müssen immer ans Limit gehen.“ – Manuel Neuer",
    "„Mia san mia!“ – Das Vereinsmotto",
    "„Fußball ist ein Spiel von Fehlern. Wer die wenigsten macht, gewinnt.“ – Pep Guardiola",
    "„Arjen hat's gemacht!“ – Wolff Fuss (Champions League Finale 2013)"
];

const questionsPool = [
    { question: "Wer schoss den Siegtreffer für den FC Bayern im Champions-League-Finale 2013?", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Arjen_Robben_in_2013.jpg/320px-Arjen_Robben_in_2013.jpg", answers: [{ text: "Thomas Müller", correct: false }, { text: "Franck Ribéry", correct: false }, { text: "Arjen Robben", correct: true }, { text: "Mario Mandžukić", correct: false }], explanation: "In der 89. Minute spitzelte Arjen Robben den Ball an Roman Weidenfeller vorbei ins Netz und erlöste ganz München." },
    { question: "Welcher Trainer führte die Bayern 2013 zum ersten Triple der Vereinsgeschichte?", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Jupp_Heynckes.jpg/320px-Jupp_Heynckes.jpg", answers: [{ text: "Pep Guardiola", correct: false }, { text: "Jupp Heynckes", correct: true }, { text: "Louis van Gaal", correct: false }, { text: "Carlo Ancelotti", correct: false }], explanation: "Jupp Heynckes krönte seine Karriere mit dem Triple aus Meisterschaft, DFB-Pokal und Champions League, bevor Pep Guardiola übernahm." },
    { question: "Wer erzielte per Kopf das 1:0-Siegtor im Champions-League-Finale 2020 gegen PSG?", answers: [{ text: "Robert Lewandowski", correct: false }, { text: "Serge Gnabry", correct: false }, { text: "Kingsley Coman", correct: true }, { text: "Joshua Kimmich", correct: false }], explanation: "Ausgerechnet der in Paris geborene Kingsley Coman köpfte die Bayern nach einer Flanke von Kimmich zum Titel." },
    { question: "Unter welchem Trainer gewann der FC Bayern im Jahr 2020 das historische Sextuple?", answers: [{ text: "Niko Kovač", correct: false }, { text: "Hansi Flick", correct: true }, { text: "Julian Nagelsmann", correct: false }, { text: "Thomas Tuchel", correct: false }], explanation: "Hansi Flick übernahm das Team während der Saison und führte es zu sechs Titeln innerhalb eines Jahres." },
    { question: "Welcher Spieler brach in der Saison 2020/21 den ewigen Bundesliga-Torrekord mit 41 Treffern?", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/20180624_FIFA_World_Cup_Group_H_POL_COL_Robert_Lewandowski.jpg/320px-20180624_FIFA_World_Cup_Group_H_POL_COL_Robert_Lewandowski.jpg", answers: [{ text: "Robert Lewandowski", correct: true }, { text: "Harry Kane", correct: false }, { text: "Mario Gómez", correct: false }, { text: "Thomas Müller", correct: false }], explanation: "Lewandowski übertraf am letzten Spieltag in der 90. Minute den legendären Rekord von Gerd Müller (40 Tore)." },
    { question: "Welcher spanische Star-Trainer übernahm den FC Bayern im Sommer 2013?", answers: [{ text: "Luis Enrique", correct: false }, { text: "Unai Emery", correct: false }, { text: "Pep Guardiola", correct: true }, { text: "Xabi Alonso", correct: false }], explanation: "Pep Guardiola kam vom FC Barcelona und prägte den ballbesitzorientierten Fußball in München." },
    { question: "Aus welchem Land wechselte Harry Kane im Jahr 2023 zum Rekordmeister?", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Harry_Kane_2018.jpg/320px-Harry_Kane_2018.jpg", answers: [{ text: "Spanien", correct: false }, { text: "Italien", correct: false }, { text: "England", correct: true }, { text: "Frankreich", correct: false }], explanation: "Harry Kane kam als Kapitän der englischen Nationalmannschaft von Tottenham Hotspur." },
    { question: "Wer schoss in der 89. Minute das entscheidende Tor zur Meisterschaft 2023 gegen den 1. FC Köln?", answers: [{ text: "Jamal Musiala", correct: true }, { text: "Leroy Sané", correct: false }, { text: "Leon Goretzka", correct: false }, { text: "Serge Gnabry", correct: false }], explanation: "Mit seinem Last-Minute-Treffer sicherte Musiala den Bayern am letzten Spieltag die Meisterschaft vor dem BVB." },
    { question: "Welcher Bayern-Spieler erzielte 2019 beim 7:2-Sieg gegen Tottenham Hotspur vier Tore?", answers: [{ text: "Robert Lewandowski", correct: false }, { text: "Serge Gnabry", correct: true }, { text: "Thomas Müller", correct: false }, { text: "Kingsley Coman", correct: false }], explanation: "Gnabry lieferte in London eine historische Leistung in der Champions League ab." },
    { question: "Von welchem Verein wechselte Manuel Neuer im Jahr 2011 zum FC Bayern?", answers: [{ text: "Borussia Dortmund", correct: false }, { text: "Werder Bremen", correct: false }, { text: "FC Schalke 04", correct: true }, { text: "VfB Stuttgart", correct: false }], explanation: "Der Wechsel des damaligen Schalke-Kapitäns sorgte zunächst für viele Diskussionen, bevor Neuer zur Legende wurde." },
    { question: "Wer wurde nach der Triple-Saison 2013 zu Europas Fußballer des Jahres gewählt?", answers: [{ text: "Arjen Robben", correct: false }, { text: "Franck Ribéry", correct: true }, { text: "Philipp Lahm", correct: false }, { text: "Bastian Schweinsteiger", correct: false }], explanation: "Franck Ribéry wurde für seine herausragende Saison mit der Auszeichnung geehrt." },
    { question: "Welcher Bayern-Star prägte für sich selbst den Begriff 'Raumdeuter'?", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/20180602_FIFA_Friendly_Match_Austria_vs._Germany_Thomas_M%C3%BCller_850_0704.jpg/320px-20180602_FIFA_Friendly_Match_Austria_vs._Germany_Thomas_M%C3%BCller_850_0704.jpg", answers: [{ text: "Thomas Müller", correct: true }, { text: "Mario Götze", correct: false }, { text: "Thiago", correct: false }, { text: "Toni Kroos", correct: false }], explanation: "Müller gab sich diesen Namen, da sein Spielstil stark darauf basiert, freie Räume auf dem Platz zu erkennen." },
    { question: "Von welchem englischen Club kam Jérôme Boateng 2011 nach München?", answers: [{ text: "FC Chelsea", correct: false }, { text: "FC Arsenal", correct: false }, { text: "Manchester United", correct: false }, { text: "Manchester City", correct: true }], explanation: "Boateng wechselte von Manchester City und wurde über Jahre zum Abwehrchef der Bayern." },
    { question: "Über welchen Spieler sagte Pep Guardiola den berühmten Satz: '... oder nix'?", answers: [{ text: "Xabi Alonso", correct: false }, { text: "Thiago", correct: true }, { text: "Javi Martínez", correct: false }, { text: "Arturo Vidal", correct: false }], explanation: "Guardiola forderte bei seinem Amtsantritt vehement die Verpflichtung von Thiago Alcántara." },
    { question: "Wer entschied 2020 das Spitzenspiel gegen den BVB mit einem traumhaften Lupfer aus 20 Metern?", answers: [{ text: "Joshua Kimmich", correct: true }, { text: "Thiago", correct: false }, { text: "Leon Goretzka", correct: false }, { text: "David Alaba", correct: false }], explanation: "Kimmichs spektakulärer Treffer ebnete den Weg zur Meisterschaft unter Hansi Flick." },
    { question: "Welcher Kanadier schaffte in der Triple-Saison 2019/20 seinen Durchbruch als Linksverteidiger?", answers: [{ text: "Jonathan David", correct: false }, { text: "Alphonso Davies", correct: true }, { text: "Tajon Buchanan", correct: false }, { text: "Cyle Larin", correct: false }], explanation: "Alphonso 'Phonzy' Davies begeisterte mit seiner enormen Geschwindigkeit auf der linken Außenbahn." },
    { question: "Gegen welchen europäischen Top-Club gewann Bayern 2020 in der Champions League mit 8:2?", answers: [{ text: "Real Madrid", correct: false }, { text: "Juventus Turin", correct: false }, { text: "FC Barcelona", correct: true }, { text: "FC Chelsea", correct: false }], explanation: "Das 8:2 beim Final-Turnier in Lissabon ging als eines der denkwürdigsten Spiele in die CL-Geschichte ein." },
    { question: "In welchem Jahr beendete der langjährige Kapitän Philipp Lahm seine Karriere?", answers: [{ text: "2015", correct: false }, { text: "2016", correct: false }, { text: "2017", correct: true }, { text: "2018", correct: false }], explanation: "Philipp Lahm hängte 2017 zusammen mit Xabi Alonso die Fußballschuhe an den Nagel." },
    { question: "Zusammen mit Philipp Lahm beendete 2017 noch ein weiterer Weltstar seine Karriere. Wer?", answers: [{ text: "Xabi Alonso", correct: true }, { text: "Franck Ribéry", correct: false }, { text: "Arjen Robben", correct: false }, { text: "Bastian Schweinsteiger", correct: false }], explanation: "Der spanische Mittelfeld-Maestro Xabi Alonso beendete in München seine aktive Laufbahn." },
    { question: "Zu welchem Verein in die Premier League wechselte Bastian Schweinsteiger 2015?", answers: [{ text: "FC Arsenal", correct: false }, { text: "FC Chelsea", correct: false }, { text: "Manchester City", correct: false }, { text: "Manchester United", correct: true }], explanation: "Schweinsteiger folgte dem Ruf seines ehemaligen Bayern-Trainers Louis van Gaal nach Manchester." },
    { question: "Wohin zog es David Alaba nach seinem Abschied vom FC Bayern im Jahr 2021?", answers: [{ text: "FC Barcelona", correct: false }, { text: "Paris Saint-Germain", correct: false }, { text: "Real Madrid", correct: true }, { text: "FC Chelsea", correct: false }], explanation: "Alaba wechselte ablösefrei zu den 'Königlichen' nach Spanien." },
    { question: "Welcher Spieler wechselte 2013 durch eine Ausstiegsklausel von Dortmund zu Bayern?", answers: [{ text: "Mats Hummels", correct: false }, { text: "Robert Lewandowski", correct: false }, { text: "Mario Götze", correct: true }, { text: "Marco Reus", correct: false }], explanation: "Der Wechsel des BVB-Toptalents Götze sorgte kurz vor dem direkten Aufeinandertreffen im CL-Finale für enormes Aufsehen." },
    { question: "Welcher Weltmeister kehrte 2016 von Dortmund zum FC Bayern zurück?", answers: [{ text: "Mario Götze", correct: false }, { text: "Mats Hummels", correct: true }, { text: "Sebastian Rode", correct: false }, { text: "Niklas Süle", correct: false }], explanation: "Hummels, der in der Bayern-Jugend ausgebildet wurde, kehrte als gestandener Weltmeister zurück." },
    { question: "Welcher Innenverteidiger ging 2022 den umgekehrten Weg und wechselte von Bayern zum BVB?", answers: [{ text: "Mats Hummels", correct: false }, { text: "Niklas Süle", correct: true }, { text: "Jérôme Boateng", correct: false }, { text: "Holger Badstuber", correct: false }], explanation: "Süle entschied sich nach Ablauf seines Vertrages in München für einen ablösefreien Wechsel nach Dortmund." },
    { question: "Von welchem Bundesliga-Konkurrenten verpflichtete Bayern 2021 Dayot Upamecano?", answers: [{ text: "Borussia Dortmund", correct: false }, { text: "Bayer Leverkusen", correct: false }, { text: "RB Leipzig", correct: true }, { text: "VfL Wolfsburg", correct: false }], explanation: "Upamecano kam zusammen mit Trainer Julian Nagelsmann und Marcel Sabitzer aus Leipzig." },
    { question: "Aus welcher italienischen Stadt wechselte Matthijs de Ligt zum FC Bayern?", answers: [{ text: "Mailand", correct: false }, { text: "Rom", correct: false }, { text: "Neapel", correct: false }, { text: "Turin", correct: true }], explanation: "Der niederländische Verteidiger kam von Juventus Turin an die Isar." },
    { question: "Welcher deutsche Nationalspieler kam 2020 von Manchester City an die Isar?", answers: [{ text: "Ilkay Gündogan", correct: false }, { text: "Leroy Sané", correct: true }, { text: "Antonio Rüdiger", correct: false }, { text: "Timo Werner", correct: false }], explanation: "Nachdem ein Transfer 2019 an einer Verletzung scheiterte, kam Sané ein Jahr später zu den Bayern." },
    { question: "Welcher senegalesische Star stürmte in der Saison 2022/23 für die Bayern?", answers: [{ text: "Sadio Mané", correct: true }, { text: "Kalidou Koulibaly", correct: false }, { text: "Idrissa Gueye", correct: false }, { text: "Edouard Mendy", correct: false }], explanation: "Mané kam als großer Name vom FC Liverpool, verließ den Club jedoch nach nur einer Saison wieder." },
    { question: "Wer übernahm im März 2023 das Traineramt von Julian Nagelsmann?", answers: [{ text: "Hansi Flick", correct: false }, { text: "Thomas Tuchel", correct: true }, { text: "Jupp Heynckes", correct: false }, { text: "Xabi Alonso", correct: false }], explanation: "Tuchel übernahm mitten in der Saison und sicherte am letzten Spieltag knapp die Meisterschaft." },
    { question: "Von welchem Club kam Trainer Julian Nagelsmann im Jahr 2021 zum FC Bayern?", answers: [{ text: "TSG Hoffenheim", correct: false }, { text: "RB Leipzig", correct: true }, { text: "Borussia Dortmund", correct: false }, { text: "Eintracht Frankfurt", correct: false }], explanation: "Bayern kaufte Nagelsmann aus seinem Vertrag bei RB Leipzig heraus." },
    { question: "Unter welchem Trainer gewann Bayern 2019 das Double aus Meisterschaft und Pokal?", answers: [{ text: "Niko Kovač", correct: true }, { text: "Carlo Ancelotti", correct: false }, { text: "Hansi Flick", correct: false }, { text: "Pep Guardiola", correct: false }], explanation: "Trotz des Doubles wurde Kovač im Herbst der darauffolgenden Saison freigestellt." },
    { question: "Wer trat 2016 die Nachfolge von Pep Guardiola als Bayern-Trainer an?", answers: [{ text: "Jupp Heynckes", correct: false }, { text: "Louis van Gaal", correct: false }, { text: "Carlo Ancelotti", correct: true }, { text: "Niko Kovač", correct: false }], explanation: "Der erfahrene Italiener Ancelotti gewann in seiner ersten Saison direkt die deutsche Meisterschaft." },
    { question: "In welchem Jahr machten 'Robbery' (Robben & Ribéry) ihr letztes Spiel für den FC Bayern?", answers: [{ text: "2018", correct: false }, { text: "2019", correct: true }, { text: "2020", correct: false }, { text: "2021", correct: false }], explanation: "Beide verabschiedeten sich am letzten Spieltag der Saison 2018/19 mit einem Torfeuerwerk gegen Frankfurt." },
    { question: "Welches Team beendete 2024 die Serie von 11 Bayern-Meisterschaften in Folge?", answers: [{ text: "Borussia Dortmund", correct: false }, { text: "RB Leipzig", correct: false }, { text: "Bayer Leverkusen", correct: true }, { text: "VfB Stuttgart", correct: false }], explanation: "Unter Xabi Alonso spielte Leverkusen eine historische, ungeschlagene Saison." },
    { question: "Von welchem englischen Club wurde Rekord-Einkauf Harry Kane verpflichtet?", answers: [{ text: "Manchester United", correct: false }, { text: "FC Arsenal", correct: false }, { text: "FC Chelsea", correct: false }, { text: "Tottenham Hotspur", correct: true }], explanation: "Der Wechsel zog sich wochenlang hin, bevor Kane endlich in München landete." },
    { question: "Welches französische Sturm-Talent verpflichtete der FC Bayern 2022 von Stade Rennes?", answers: [{ text: "Kingsley Coman", correct: false }, { text: "Mathys Tel", correct: true }, { text: "Michael Olise", correct: false }, { text: "Dayot Upamecano", correct: false }], explanation: "Tel galt als eines der größten Sturmtalente Europas bei seinem Wechsel." },
    { question: "Wer kam 2023 als amtierender italienischer Meister aus Neapel für die Abwehr?", answers: [{ text: "Matthijs de Ligt", correct: false }, { text: "Lucas Hernández", correct: false }, { text: "Kim Min-jae", correct: true }, { text: "Eric Dier", correct: false }], explanation: "Der Südkoreaner Kim Min-jae wurde zuvor als bester Verteidiger der Serie A ausgezeichnet." },
    { question: "Welcher österreichische Mittelfeldspieler kam 2023 ablösefrei von RB Leipzig?", answers: [{ text: "Marcel Sabitzer", correct: false }, { text: "Konrad Laimer", correct: true }, { text: "Xaver Schlager", correct: false }, { text: "Christoph Baumgartner", correct: false }], explanation: "Laimer verstärkte das zentrale Mittelfeld der Münchner durch seine Zweikampfstärke." },
    { question: "Wer wechselte 2023 ablösefrei von Borussia Dortmund zum FC Bayern?", answers: [{ text: "Raphaël Guerreiro", correct: true }, { text: "Mats Hummels", correct: false }, { text: "Julian Brandt", correct: false }, { text: "Marco Reus", correct: false }], explanation: "Der vielseitige Portugiese Guerreiro folgte dem Ruf von Thomas Tuchel nach München." },
    { question: "Wobei verletzte sich Manuel Neuer Ende 2022 so schwer, dass er fast ein Jahr ausfiel?", answers: [{ text: "Beim Tennis", correct: false }, { text: "Beim Skitourengehen", correct: true }, { text: "Beim Radfahren", correct: false }, { text: "Beim Reiten", correct: false }], explanation: "Neuer brach sich kurz nach der WM in Katar bei einer Skitour den Unterschenkel." },
    { question: "Wer wurde im Januar 2023 als Ersatz für den verletzten Manuel Neuer verpflichtet?", answers: [{ text: "Kevin Trapp", correct: false }, { text: "Alexander Nübel", correct: false }, { text: "Yann Sommer", correct: true }, { text: "Koen Casteels", correct: false }], explanation: "Der Schweizer Yann Sommer kam von Borussia Mönchengladbach und half für ein halbes Jahr aus." },
    { question: "Welcher Torhüter vertritt Manuel Neuer seit Jahren immer wieder als zuverlässige Nummer 2?", answers: [{ text: "Tom Starke", correct: false }, { text: "Pepe Reina", correct: false }, { text: "Sven Ulreich", correct: true }, { text: "Christian Früchtl", correct: false }], explanation: "Sven Ulreich genießt in München als loyaler Vertreter großen Respekt bei den Fans." },
    { question: "Aus welchem Land stammt Eric Maxim Choupo-Moting, der von 2020 bis 2024 für Bayern spielte?", answers: [{ text: "Senegal", correct: false }, { text: "Elfenbeinküste", correct: false }, { text: "Kamerun", correct: true }, { text: "Nigeria", correct: false }], explanation: "Choupo-Moting spielte für die Nationalmannschaft Kameruns, auch wenn er in Hamburg geboren wurde." },
    { question: "Zusammen mit welchem Spieler wechselte Noussair Mazraoui 2022 von Ajax Amsterdam zu Bayern?", answers: [{ text: "Matthijs de Ligt", correct: false }, { text: "Ryan Gravenberch", correct: true }, { text: "Daley Blind", correct: false }, { text: "Frenkie de Jong", correct: false }], explanation: "Sowohl Gravenberch als auch Mazraoui kamen zeitgleich von Ajax nach München." },
    { question: "Welches Eigengewächs feierte in der Saison 2023/24 seinen Durchbruch im zentralen Mittelfeld?", answers: [{ text: "Aleksandar Pavlović", correct: true }, { text: "Angelo Stiller", correct: false }, { text: "Frans Krätzig", correct: false }, { text: "Paul Wanner", correct: false }], explanation: "Pavlović überzeugte so stark, dass er sogar für die deutsche Nationalmannschaft nominiert wurde." },
    { question: "Welcher Abwehrspieler wurde 2023/24 an Bayer Leverkusen ausgeliehen und holte dort das Double?", answers: [{ text: "Josip Stanišić", correct: true }, { text: "Tanguy Nianzou", correct: false }, { text: "Chris Richards", correct: false }, { text: "Bouna Sarr", correct: false }], explanation: "Stanišić wurde ausgerechnet beim größten Konkurrenten der Bayern zum Meisterspieler." },
    { question: "Welcher Rechtsverteidiger kam im Winter 2024 von Galatasaray Istanbul?", answers: [{ text: "Sacha Boey", correct: true }, { text: "Noussair Mazraoui", correct: false }, { text: "Nordi Mukiele", correct: false }, { text: "Kieran Trippier", correct: false }], explanation: "Bayern reagierte auf personelle Engpässe und verpflichtete den talentierten Franzosen." },
    { question: "Welchen englischen Abwehrspieler holte Bayern im Januar 2024 von Tottenham?", answers: [{ text: "Kieran Trippier", correct: false }, { text: "Kyle Walker", correct: false }, { text: "Eric Dier", correct: true }, { text: "Harry Maguire", correct: false }], explanation: "Eric Dier stieß im Winter zum Team und etablierte sich schnell in der Innenverteidigung." },
    { question: "Wer wurde im Sommer 2024 neuer Cheftrainer des FC Bayern?", answers: [{ text: "Xabi Alonso", correct: false }, { text: "Vincent Kompany", correct: true }, { text: "Roberto De Zerbi", correct: false }, { text: "Julian Nagelsmann", correct: false }], explanation: "Der ehemalige Weltklasse-Verteidiger Vincent Kompany übernahm das Zepter an der Säbener Straße." },
    { question: "Gegen welchen Club verlor der FC Bayern 2012 das 'Finale dahoam', bevor 2013 die goldene Ära startete?", answers: [{ text: "Manchester United", correct: false }, { text: "FC Barcelona", correct: false }, { text: "FC Chelsea", correct: true }, { text: "Inter Mailand", correct: false }], explanation: "Die dramatische Niederlage im Elfmeterschießen im eigenen Stadion gilt als Initialzündung für das Triple im Jahr darauf." }
];

const questionElement = document.getElementById("question");
const questionImageElement = document.getElementById("question-image");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const resultMessage = document.getElementById("result-message");
const scoreElement = document.getElementById("score");
const highscoreElement = document.getElementById("highscore");
const jokerBtn = document.getElementById("joker-btn");
const timerBar = document.getElementById("timer-bar");
const explanationBox = document.getElementById("explanation-box");
const leaderboardSection = document.getElementById("leaderboard-section");
const leaderboardList = document.getElementById("leaderboard-list");
const leaderboardForm = document.getElementById("leaderboard-form");
const playerNameInput = document.getElementById("player-name");
const saveScoreBtn = document.getElementById("save-score-btn");

let currentQuestionIndex = 0;
let score = 0;
let currentStreak = 0;
let currentQuizQuestions = [];
let timerInterval;
let timeLeft = 15; // 15 Sekunden pro Frage
const TIME_LIMIT = 15;
let jokerUsed = false;
let totalTime = 0;
let questionStartTime = 0;

// Highscore aus dem lokalen Browser-Speicher laden
let highscore = parseInt(localStorage.getItem("bayernHighscore")) || 0;
highscoreElement.innerText = highscore;

function updateScoreDisplay() {
    scoreElement.innerText = score;
    let streakDisplay = document.getElementById("streak-display");
    if (!streakDisplay) {
        streakDisplay = document.createElement("span");
        streakDisplay.id = "streak-display";
        streakDisplay.style.marginLeft = "10px";
        streakDisplay.style.fontWeight = "bold";
        streakDisplay.style.color = "#ffaa00";
        scoreElement.after(streakDisplay);
    }
    
    if (currentStreak >= 3) {
        streakDisplay.innerText = `🔥 ${currentStreak}x Combo! (2x Punkte)`;
    } else if (currentStreak > 0) {
        streakDisplay.innerText = `🔥 ${currentStreak}x`;
    } else {
        streakDisplay.innerText = "";
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    currentStreak = 0;
    totalTime = 0;
    jokerUsed = false;
    jokerBtn.disabled = false;
    updateScoreDisplay();
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
    totalTime += TIME_LIMIT;
    playSound('wrong');
    resultMessage.textContent = "Zeit abgelaufen!";
    resultMessage.style.color = "#DC052D";
    
    currentStreak = 0;
    updateScoreDisplay();
    
    const currentQuestion = currentQuizQuestions[currentQuestionIndex];

    // Deaktiviere Buttons und zeige richtige Antwort
    Array.from(answerButtonsElement.children).forEach(button => {
        const idx = parseInt(button.dataset.index, 10);
        if (currentQuestion.answers[idx].correct) {
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

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        button.dataset.index = index;
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
    
    const currentQuestion = currentQuizQuestions[currentQuestionIndex];
    const buttons = Array.from(answerButtonsElement.children);
    const wrongButtons = buttons.filter(btn => {
        const idx = parseInt(btn.dataset.index, 10);
        return !currentQuestion.answers[idx].correct;
    });
    
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
    cancelAnimationFrame(timerInterval); // Timer stoppen
    
    let timeTaken = Math.min((Date.now() - questionStartTime) / 1000, TIME_LIMIT);
    totalTime += timeTaken;

    const selectedButton = e.target;
    const idx = parseInt(selectedButton.dataset.index, 10);
    const currentQuestion = currentQuizQuestions[currentQuestionIndex];
    const isCorrect = currentQuestion.answers[idx].correct;
    
    if (isCorrect) {
        playSound('correct');
        selectedButton.style.backgroundColor = '#28a745';
        selectedButton.style.borderColor = '#28a745';
        selectedButton.style.color = '#ffffff';
        resultMessage.textContent = "Richtig! Toll gemacht!";
        resultMessage.style.color = "#28a745";
        
        currentStreak++;
        const points = currentStreak >= 3 ? 2 : 1;
        score += points;
        updateScoreDisplay();

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
        
        currentStreak = 0;
        updateScoreDisplay();
    }

    // Alle Buttons deaktivieren
    Array.from(answerButtonsElement.children).forEach(button => {
        const buttonIdx = parseInt(button.dataset.index, 10);
        if (currentQuestion.answers[buttonIdx].correct && !isCorrect) {
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
    
    if (ratio >= 1) {
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
    
    // Tools ausblenden beim Endbildschirm
    document.querySelector('.tools-header').style.display = 'none';
    
    leaderboardSection.style.display = "block";
    leaderboardForm.style.display = "block";
    playerNameInput.value = "";
    renderLeaderboard();

    nextButton.innerText = "Revanche starten";
    nextButton.style.display = "block";
}

function renderLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("bayernLeaderboard")) || [];
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
    const leaderboard = JSON.parse(localStorage.getItem("bayernLeaderboard")) || [];

    leaderboard.push({ name: name, score: score, time: totalTime });

    // Sortieren: Erst nach Punkten absteigend, dann nach Zeit aufsteigend
    leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.time - b.time;
    });

    // Top 10 behalten
    const top10 = leaderboard.slice(0, 10);
    localStorage.setItem("bayernLeaderboard", JSON.stringify(top10));

    leaderboardForm.style.display = "none";
    renderLeaderboard();
});

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
