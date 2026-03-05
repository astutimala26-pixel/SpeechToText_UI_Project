window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const micBtn = document.querySelector("#micBtn");
const transcriptDiv = document.querySelector("#transcript");
const languageSelect = document.querySelector("#language");
const statusDiv = document.querySelector("#status");
const audioInput = document.querySelector("#audioFile");
const uploadBtn = document.querySelector("#uploadBtn");

let recognition;
let isListening = false;
let startTime; 

let totalUploads = parseInt(localStorage.getItem('totalUploads')) || 0;
let totalWords = parseInt(localStorage.getItem('totalWords')) || 0;
let totalDuration = parseFloat(localStorage.getItem('totalDuration')) || 0;

if (window.SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true; 
  recognition.interimResults = true;

  micBtn.addEventListener("click", () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.lang = languageSelect.value;
      recognition.start();
      startTime = Date.now(); 
      statusDiv.innerText = "Listening...";
    }
  });

  recognition.addEventListener("result", (e) => {
    const transcript = Array.from(e.results).map(result => result[0].transcript).join("");
    transcriptDiv.innerText = transcript;
  });

  recognition.addEventListener("start", () => {
    isListening = true;
    micBtn.innerText = "🛑 Stop";
    micBtn.classList.replace("btn-success", "btn-danger");
  });

  recognition.addEventListener("end", () => {
    isListening = false;
    micBtn.innerText = "🎤 Start";
    micBtn.classList.replace("btn-danger", "btn-success");
    statusDiv.innerText = "Stopped";

    const sessionDuration = (Date.now() - startTime) / 60000;
    updateStats(transcriptDiv.innerText, sessionDuration);
  });
}

uploadBtn.addEventListener("click", () => {
  const file = audioInput.files[0];
  if (!file) {
    alert("Please select an audio file.");
    return;
  }
  const simulatedText = "This is a simulated transcription of your uploaded file.";
  transcriptDiv.innerText = simulatedText;
  updateStats(simulatedText, 2.5); 
});

function updateStats(transcript, duration) {
  if (!transcript.trim()) return;
  totalUploads += 1;
  totalWords += transcript.trim().split(/\s+/).length;
  totalDuration += duration;

  localStorage.setItem('totalUploads', totalUploads);
  localStorage.setItem('totalWords', totalWords);
  localStorage.setItem('totalDuration', totalDuration);
  localStorage.setItem('avgDuration', (totalDuration / totalUploads).toFixed(1) + " min");
}