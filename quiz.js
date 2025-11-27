let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
const timeLimit = 80; // 80 วินาทีต่อข้อ
let results = []; // ✅ เก็บผลลัพธ์แต่ละข้อ

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

    // ✅ แสดงเฉลยและคำอธิบาย
    let resultHTML = "<h2>เฉลยและคำอธิบาย</h2><ul>";
    results.forEach((r, i) => {
      resultHTML += `<li>
        <strong>ข้อ ${i+1}:</strong> ${r.question}<br>
        <span style="color:${r.isCorrect ? 'green':'red'}">
          คุณตอบ: ${r.selected} ${r.isCorrect ? '(ถูกต้อง)' : '(ผิด)'}
        </span><br>
        เฉลยที่ถูกต้อง: ${r.correct}<br>
        คำอธิบาย: ${r.explanation}
      </li><br>`;
    });
    resultHTML += "</ul>";
    document.getElementById("result-box").innerHTML += resultHTML;
    return;
  }

  const q = questions[currentIndex];

  // ✅ แสดงเลขข้อ
  document.getElementById("question-number").innerText = `ข้อที่ ${currentIndex + 1} จาก ${questions.length}`;

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
  const isCorrect = selectedIndex === q.answerIndex;
  if (isCorrect) score++;

  // ✅ เก็บผลลัพธ์แต่ละข้อ
  results.push({
    question: q.question,
    selected: q.choices[selectedIndex],
    correct: q.choices[q.answerIndex],
    explanation: q.explanation,
    isCorrect: isCorrect
  });

  currentIndex++;
  showQuestion();
}

function startTimer() {
  let timeLeft = timeLimit;
  document.getElementById("timer").innerText = `เวลาที่เหลือ: ${timeLeft} วินาที`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `เวลาที่เหลือ: ${timeLeft} วินาที`;

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
