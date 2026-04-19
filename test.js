const fs = require('fs');
const { JSDOM } = require('jsdom');
const assert = require('assert');

const html = fs.readFileSync('./index.html', 'utf8');
const script = fs.readFileSync('./script.js', 'utf8');

function setupDOM() {
  const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/" });
  const window = dom.window;

  // Mock localStorage
  let store = {};
  window.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; }
  };

  // Mock AudioContext
  window.AudioContext = class {
    constructor() {
      this.state = 'running';
      this.currentTime = 0;
    }
    createOscillator() {
      return {
        type: '',
        connect: () => {},
        start: () => {},
        stop: () => {},
        frequency: {
          setValueAtTime: () => {},
          linearRampToValueAtTime: () => {},
          exponentialRampToValueAtTime: () => {}
        }
      };
    }
    createGain() {
      return {
        connect: () => {},
        gain: {
          setValueAtTime: () => {},
          exponentialRampToValueAtTime: () => {}
        }
      };
    }
    resume() {}
  };
  window.webkitAudioContext = window.AudioContext;

  return dom;
}

function runTests() {
  let testsPassed = 0;
  let testsFailed = 0;

  function runTest(name, testFn) {
    try {
      const dom = setupDOM();
      dom.window.eval(script);
      testFn(dom.window.document, dom.window);
      console.log(`✅ ${name}`);
      testsPassed++;
    } catch (e) {
      console.error(`❌ ${name}`);
      console.error(e);
      testsFailed++;
    }
  }

  // Test 1: Verify initial render
  runTest('Verify initial render of the quiz', (document) => {
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');

    assert.ok(questionElement, "Question element should exist");
    assert.ok(answerButtonsElement, "Answer buttons element should exist");

    const buttons = answerButtonsElement.querySelectorAll('button');
    assert.strictEqual(buttons.length, 4, "Should render exactly 4 answer buttons");

    let correctButtons = 0;
    buttons.forEach(btn => {
      if (btn.dataset.correct === "true") correctButtons++;
    });
    assert.strictEqual(correctButtons, 1, "There should be exactly 1 correct answer button");
  });

  // Test 2: Simulate clicking correct answer
  runTest('Clicking correct answer increases score and shows correct styling', (document) => {
    const answerButtonsElement = document.getElementById('answer-buttons');
    const scoreElement = document.getElementById('score');
    const resultMessage = document.getElementById('result-message');

    const buttons = answerButtonsElement.querySelectorAll('button');
    let correctButton = Array.from(buttons).find(btn => btn.dataset.correct === "true");

    assert.ok(correctButton, "Could not find correct button");

    const initialScore = parseInt(scoreElement.innerText);

    // Simulate click
    correctButton.click();

    const newScore = parseInt(scoreElement.innerText);
    assert.strictEqual(newScore, initialScore + 1, "Score should increase by 1");

    // Verify UI updates
    assert.strictEqual(correctButton.style.backgroundColor, 'rgb(40, 167, 69)', "Button should turn green");
    assert.strictEqual(resultMessage.textContent, "Richtig! Toll gemacht!", "Should show correct message");

    // Verify next button appears
    const nextButton = document.getElementById('next-btn');
    assert.strictEqual(nextButton.style.display, "block", "Next button should be visible");
  });

  // Test 3: Simulate clicking wrong answer
  runTest('Clicking wrong answer does not increase score and shows correct styling', (document) => {
    const answerButtonsElement = document.getElementById('answer-buttons');
    const scoreElement = document.getElementById('score');
    const resultMessage = document.getElementById('result-message');

    const buttons = answerButtonsElement.querySelectorAll('button');
    let wrongButton = Array.from(buttons).find(btn => btn.dataset.correct !== "true");

    assert.ok(wrongButton, "Could not find a wrong button");

    const initialScore = parseInt(scoreElement.innerText);

    // Simulate click
    wrongButton.click();

    const newScore = parseInt(scoreElement.innerText);
    assert.strictEqual(newScore, initialScore, "Score should NOT increase");

    // Verify UI updates
    assert.strictEqual(wrongButton.style.backgroundColor, 'rgb(220, 5, 45)', "Button should turn red");
    assert.strictEqual(resultMessage.textContent, "Leider falsch!", "Should show wrong message");

    // Verify next button appears
    const nextButton = document.getElementById('next-btn');
    assert.strictEqual(nextButton.style.display, "block", "Next button should be visible");
  });

  // Test 4: 50:50 Joker
  runTest('50:50 Joker functionality disables and fades out 2 wrong answers', (document) => {
    const jokerBtn = document.getElementById('joker-btn');
    const answerButtonsElement = document.getElementById('answer-buttons');

    assert.ok(!jokerBtn.disabled, "Joker button should be enabled initially");

    // Click joker
    jokerBtn.click();

    assert.ok(jokerBtn.disabled, "Joker button should be disabled after use");

    const buttons = answerButtonsElement.querySelectorAll('button');
    let disabledWrongButtons = 0;

    buttons.forEach(btn => {
      if (btn.dataset.correct !== "true" && btn.disabled === true && btn.classList.contains("fade-out")) {
        disabledWrongButtons++;
      }
    });

    assert.strictEqual(disabledWrongButtons, 2, "Exactly 2 wrong buttons should be disabled and faded out");

    // Clicking it again should do nothing (button is disabled in UI but we can test the click handler directly just in case)
    jokerBtn.click();

    let disabledWrongButtonsAfterSecondClick = 0;
    answerButtonsElement.querySelectorAll('button').forEach(btn => {
      if (btn.dataset.correct !== "true" && btn.disabled === true && btn.classList.contains("fade-out")) {
        disabledWrongButtonsAfterSecondClick++;
      }
    });

    assert.strictEqual(disabledWrongButtonsAfterSecondClick, 2, "Should still be exactly 2 wrong buttons disabled");
  });

  // Test 5: Timer behavior (mocking time)
  runTest('Timer behavior and timeout', (document, window) => {
    const answerButtonsElement = document.getElementById('answer-buttons');
    const resultMessage = document.getElementById('result-message');

    // Fast forward time by overriding the interval locally or just triggering timeout manually
    // Since timerInterval is local to script.js, we can trigger the timeout function directly
    // Because we eval script.js, timeOut is a global function on the window
    window.timeOut();

    assert.strictEqual(resultMessage.textContent, "Zeit abgelaufen!", "Should show timeout message");

    const buttons = answerButtonsElement.querySelectorAll('button');
    buttons.forEach(btn => {
        assert.strictEqual(btn.disabled, true, "All buttons should be disabled after timeout");
    });
  });

  console.log(`\nTest Summary: ${testsPassed} passed, ${testsFailed} failed`);

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests();
