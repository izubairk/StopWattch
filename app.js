let running = false;
let startTime = 0;
let interval;

let triggerCount = 0;

let forcedNumber = Number(localStorage.getItem("forced")) || 30;
let triggerNumber = Number(localStorage.getItem("trigger")) || 1;

const mmEl = document.getElementById("mm");
const ssEl = document.getElementById("ss");
const msEl = document.getElementById("ms");

const startStopBtn = document.getElementById("startStop");
const settings = document.getElementById("settings");

function updateDisplay(ms) {
  let totalMs = ms;
  let minutes = Math.floor(totalMs / 60000);
  let seconds = Math.floor((totalMs % 60000) / 1000);
  let milliseconds = Math.floor((totalMs % 1000) / 10);

  mmEl.textContent = String(minutes).padStart(2, "0");
  ssEl.textContent = String(seconds).padStart(2, "0");
  msEl.textContent = String(milliseconds).padStart(2, "0");
}

startStopBtn.onclick = () => {
  if (!running) {
    running = true;
    startTime = Date.now();
    startStopBtn.textContent = "Stop";

    interval = setInterval(() => {
      updateDisplay(Date.now() - startTime);
    }, 10);

  } else {
    running = false;
    clearInterval(interval);
    startStopBtn.textContent = "Start";

    triggerCount++;

    let totalMs = Date.now() - startTime;
    let seconds = Math.floor((totalMs % 60000) / 1000);
    let milliseconds = Math.floor((totalMs % 1000) / 10);

    if (triggerCount === triggerNumber && forcedNumber >= 30) {
      let target = forcedNumber;
      let newSeconds = Math.min(59, target);
      let newMilliseconds = target - newSeconds;

      if (newMilliseconds < 0) newMilliseconds = 0;
      if (newMilliseconds > 99) newMilliseconds = 99;

      ssEl.textContent = String(newSeconds).padStart(2, "0");
      msEl.textContent = String(newMilliseconds).padStart(2, "0");

      triggerCount = 0; // auto-reset after success
    }
  }
};

// Long press on minutes opens settings
let pressTimer;
mmEl.addEventListener("touchstart", () => {
  pressTimer = setTimeout(() => {
    settings.classList.remove("hidden");
  }, 1000);
});
mmEl.addEventListener("touchend", () => clearTimeout(pressTimer));

// Save settings
document.getElementById("save").onclick = () => {
  forcedNumber = Number(document.getElementById("forced").value);
  triggerNumber = Number(document.getElementById("trigger").value);

  localStorage.setItem("forced", forcedNumber);
  localStorage.setItem("trigger", triggerNumber);

  settings.classList.add("hidden");
};