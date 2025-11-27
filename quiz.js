let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
const timeLimit = 80; // 80 วินาทีต่อข้อ

async function loadQuestions() {
  const res = await fetch("questions_set1.json");
  questions = await res.json();
  showQuestion();
}

function showQuestion() {
  clearInterval(timer);
  if (currentIndex >= questions.length) {
    document.getElementById("question-box").style.display = "none";
    document.getElementById("controls").style.display = "none";
    document.getElementById("score").innerText = `คุณทำได้ ${score}/${questions.length} คะแนน`;
    return;
  }

  const q = questions[currentIndex];
  document.getElementById("question").innerText = q.question;
  const choicesBox = document.getElementById("choices");
  choicesBox.innerHTML = "";

  q.choices.forEach((choice, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.innerText = choice;
    btn.onclick = () => checkAnswer(i);
    li.appendChild(btn);
    choicesBox.appendChild(li);
  });

  startTimer();
}

function checkAnswer(selectedIndex) {
  const q = questions[currentIndex];
  if (selectedIndex === q.answerIndex) {
    score++;
  }
  currentIndex++;
  showQuestion();
}

function startTimer() {
  let timeLeft = timeLimit;
  timer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timer);
      currentIndex++;
      showQuestion();
    }
  }, 1000);
}

document.getElementById("next-btn").onclick = () => {
  currentIndex++;
  showQuestion();
};

loadQuestions();
