$ cat /Users/shivani.thakur/voice-task-bot/js/app.js

/* =====================================================================
   app.js — app logic for the voice task bot.
   No frameworks, no build step, plain browser JS only.
   ===================================================================== */

/* ---------------------------------------------------------------------
 * >>> EDIT THIS ONE LINE AFTER YOU DEPLOY YOUR GOOGLE APPS SCRIPT <<<
 * Paste the "Web app URL" you get after deploying google-apps-script.js
 * (see SETUP.md). Until you do, results just won't be logged to the
 * Google Sheet — the app on the phone still works fine either way.
 * ------------------------------------------------------------------- */
const SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxhTj0VG8iYTzUfssuPJ57WhqwTaIKFqo_kj2xRAeWpdRzUmbu4uWc84Dwrn-sPB1XK/exec";

/* ---------------------------------------------------------------------
 * State
 * ------------------------------------------------------------------- */
let queue = [];          // ordered list of today's task objects
let currentIndex = 0;    // which task in the queue we're on
let results = [];        // { id, textHi, image, status: 'yes' | 'no' }
let hindiVoice = null;   // cached best-matching Hindi voice, once found
let speechToken = 0;     // bumped on every speakHindi() call, see below

/* ---------------------------------------------------------------------
 * DOM references
 * ------------------------------------------------------------------- */
const startScreen = document.getElementById("start-screen");
const taskScreen = document.getElementById("task-screen");
const summaryScreen = document.getElementById("summary-screen");

const startBtn = document.getElementById("start-btn");
const progressDotsEl = document.getElementById("progress-dots");
const taskImageEl = document.getElementById("task-image");
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");
const summaryGridEl = document.getElementById("summary-grid");

/* ---------------------------------------------------------------------
 * Day-of-week helper
 * ------------------------------------------------------------------- */
function getTodayKey() {
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return dayNames[new Date().getDay()];
}

/* Build today's queue: everyday tasks first, then today's extra tasks —
   both groups keep the exact order they appear in tasks-config.js. */
function buildQueue() {
  const today = getTodayKey();
  return TASKS.filter(function (t) {
    return t.day.indexOf("everyday") !== -1 || t.day.indexOf(today) !== -1;
  });
}

/* ---------------------------------------------------------------------
 * Screen switching
 * ------------------------------------------------------------------- */
function showScreen(el) {
  [startScreen, taskScreen, summaryScreen].forEach(function (s) {
    s.classList.remove("active");
  });
  el.classList.add("active");
}

/* ---------------------------------------------------------------------
 * Speech synthesis (Hindi)
 * ------------------------------------------------------------------- */
function pickHindiVoice() {
  const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  if (!voices || voices.length === 0) return null;
  // Prefer an exact hi-IN voice, then anything tagged "hi", then null (fallback to default).
  return (
    voices.find(function (v) { return v.lang && v.lang.toLowerCase() === "hi-in"; }) ||
    voices.find(function (v) { return v.lang && v.lang.toLowerCase().indexOf("hi") === 0; }) ||
    null
  );
}

/* onComplete (optional) fires once the sentence has finished being
 * spoken — used to keep the answer buttons locked until the person has
 * actually heard the question, so they can't just tap-tap-tap through
 * without listening. speechToken guards against a stale callback from a
 * previous, since-superseded call (e.g. cancel() firing an old onend,
 * or the fallback timer below) wrongly unlocking the CURRENT task. */
function speakHindi(text, onComplete) {
  const myToken = ++speechToken;
  const finish = function () {
    if (myToken === speechToken && onComplete) onComplete();
  };

  if (!("speechSynthesis" in window)) {
    finish(); // no TTS support — don't leave the person stuck unable to answer
    return;
  }

  try {
    window.speechSynthesis.cancel(); // stop anything currently queued/speaking
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "hi-IN"; // always set, even if we fall back to default voice
    if (!hindiVoice) hindiVoice = pickHindiVoice();
    if (hindiVoice) utter.voice = hindiVoice;
    utter.rate = 0.95;
    utter.pitch = 1.0;
    utter.onend = finish;
    utter.onerror = finish;
    window.speechSynthesis.speak(utter);

    // Safety net: some Android/Chrome versions don't reliably fire
    // "onend" for speechSynthesis. If that happens, unlock anyway after
    // a generous estimated speaking duration rather than leaving the
    // person stuck forever.
    const estimatedMs = Math.max(1200, text.length * 90) + 1500;
    setTimeout(finish, estimatedMs);
  } catch (err) {
    console.error("Speech synthesis failed:", err);
    finish();
  }
}

// Voice lists load asynchronously on some browsers — refresh our cached
// pick once they arrive so the very first utterance can use it too.
if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = function () {
    hindiVoice = pickHindiVoice();
  };
}

/* ---------------------------------------------------------------------
 * Progress dots
 * ------------------------------------------------------------------- */
function renderProgressDots() {
  progressDotsEl.innerHTML = "";
  queue.forEach(function () {
    const dot = document.createElement("div");
    dot.className = "dot";
    progressDotsEl.appendChild(dot);
  });
}

function updateProgressDot(index, status) {
  const dot = progressDotsEl.children[index];
  if (!dot) return;
  dot.classList.add(status === "yes" ? "filled-yes" : "filled-no");
}

/* ---------------------------------------------------------------------
 * Task flow
 * ------------------------------------------------------------------- */
function startDay() {
  queue = buildQueue();
  currentIndex = 0;
  results = [];
  renderProgressDots();
  showScreen(taskScreen);
  showCurrentTask();
}

function showCurrentTask() {
  const task = queue[currentIndex];
  taskImageEl.src = "images/" + task.image;
  taskImageEl.alt = "";
  setAnswerButtonsEnabled(false);
  speakHindi(task.textHi, function () {
    setAnswerButtonsEnabled(true);
  });
}

// Locks the yes/no buttons (visually + functionally) until the current
// question has finished being spoken, so people can't answer before
// hearing it.
function setAnswerButtonsEnabled(enabled) {
  btnYes.disabled = !enabled;
  btnNo.disabled = !enabled;
}

function answerCurrentTask(status) {
  const task = queue[currentIndex];
  results.push({
    id: task.id,
    textHi: task.textHi,
    image: task.image,
    status: status
  });
  updateProgressDot(currentIndex, status);
  currentIndex++;

  if (currentIndex < queue.length) {
    showCurrentTask();
  } else {
    finishDay();
  }
}

btnYes.addEventListener("click", function () { answerCurrentTask("yes"); });
btnNo.addEventListener("click", function () { answerCurrentTask("no"); });

/* ---------------------------------------------------------------------
 * Summary screen
 * ------------------------------------------------------------------- */
function finishDay() {
  renderSummaryGrid();
  showScreen(summaryScreen);

  const doneCount = results.filter(function (r) { return r.status === "yes"; }).length;
  const missedCount = results.length - doneCount;
  const summarySentence =
    "आज आपने " + doneCount + " काम पूरे किए, " + missedCount + " काम बाकी हैं।";
  speakHindi(summarySentence);

  sendResultsToSheet(doneCount, missedCount);
}

function renderSummaryGrid() {
  summaryGridEl.innerHTML = "";
  results.forEach(function (r) {
    const cell = document.createElement("div");
    cell.className = "summary-cell";

    const img = document.createElement("img");
    img.className = "summary-task-img";
    img.src = "images/" + r.image;
    img.alt = "";
    cell.appendChild(img);

    const badge = document.createElement("img");
    badge.className = "overlay-badge";
    badge.src = r.status === "yes" ? "images/checkmark.svg" : "images/cross.svg";
    badge.alt = "";
    cell.appendChild(badge);

    summaryGridEl.appendChild(cell);
  });
}

// Tap anywhere on the summary screen to go back to the start screen
// (ready for tomorrow).
summaryScreen.addEventListener("click", function () {
  window.speechSynthesis && window.speechSynthesis.cancel();
  showScreen(startScreen);
});

/* ---------------------------------------------------------------------
 * Google Sheet logging (best-effort, fire-and-forget)
 * ------------------------------------------------------------------- */
function sendResultsToSheet(doneCount, missedCount) {
  if (!SHEET_WEBHOOK_URL || SHEET_WEBHOOK_URL.indexOf("PASTE_YOUR_") === 0) {
    console.log("Sheet webhook not configured yet — skipping upload.");
    return;
  }

  const now = new Date();
  const payload = {
    timestamp: now.toISOString(),
    date: now.toLocaleDateString("en-CA"), // YYYY-MM-DD, locale-independent-ish
    day: getTodayKey(),
    doneCount: doneCount,
    missedCount: missedCount,
    tasks: results // [{ id, textHi, image, status }, ...]
  };

  // NOTE: we use mode: 'no-cors' with a text/plain body on purpose.
  // Google Apps Script web apps don't send back CORS headers that a
  // plain cross-origin fetch would accept, and a JSON content-type
  // would trigger a CORS *preflight* OPTIONS request that Apps Script
  // does not handle. Using text/plain avoids the preflight entirely,
  // and no-cors means we simply can't read the response (that's fine —
  // we don't need to; doPost() on the other end still receives and
  // parses the JSON string from e.postData.contents).
  fetch(SHEET_WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  }).catch(function (err) {
    // Fail silently in the UI (no internet, etc.) — just log it.
    // Do not retry: we don't want to pile up requests or alarm the user.
    console.error("Could not upload results to Google Sheet:", err);
  });
}

/* ---------------------------------------------------------------------
 * Start button — the required user-gesture that also unlocks
 * speechSynthesis audio on Android Chrome.
 * ------------------------------------------------------------------- */
startBtn.addEventListener("click", function () {
  // "Warm up" speech synthesis with a near-silent utterance triggered
  // directly inside this click handler, which some Android/Chrome
  // versions require before later programmatic speech will play.
  if ("speechSynthesis" in window) {
    hindiVoice = pickHindiVoice();
  }
  startDay();
});

/* ---------------------------------------------------------------------
 * Register the service worker for offline use.
 * ------------------------------------------------------------------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("service-worker.js").catch(function (err) {
      console.error("Service worker registration failed:", err);
    });
  });
}
