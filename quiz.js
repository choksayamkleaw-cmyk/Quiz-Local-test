let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
const timeLimit = 80; // 80 วินาทีต่อข้อ
let results = []; // เก็บผลลัพธ์แต่ละข้อ
let skippedIndexes = []; // เก็บข้อที่ข้าม
let answeredIndexes = []; // เก็บข้อที่ตอบแล้ว

async function loadQuestions() {
  const res = await fetch("questions_set1.json");
  questions = await res.json();
  showQuestion();
}

function showQuestion() {
  clearInterval(timer);

  if (currentIndex >= questions.length) {
    const remaining = skippedIndexes.filter(i => !answeredIndexes.includes(i));
    if (remaining.length > 0) {
      currentIndex = remaining[0];
      skippedIndexes = remaining.slice(1);
      showQuestion();
      return;
    }

    // ✅ แสดงผลลัพธ์และเฉลย
    document.getElementById("question-box").style.display = "none";
    document.getElementById("controls").style.display = "none";
    document.getElementById("score").innerText = `คุณทำได้ ${score}/${questions.length} คะแนน`;

    // ล้างเฉลยเก่า (ถ้ามี)
    let explanations = document.getElementById("explanations");
    if (!explanations) {
      explanations = document.createElement("div");
      explanations.id = "explanations";
      document.getElementById("result-box").appendChild(explanations);
    }

    // เติมเฉลยใหม่
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
    explanations.innerHTML = resultHTML;

    // ✅ แสดงปุ่มเริ่มใหม่
    document.getElementById("restart-btn").style.display = "inline-block";
    return;
  }

  const q = questions[currentIndex];

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

  results[currentIndex] = {
    question: q.question,
    selected: q.choices[selectedIndex],
    correct: q.choices[q.answerIndex],
    explanation: q.explanation,
    isCorrect: isCorrect
  };

  answeredIndexes.push(currentIndex);
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
      skippedIndexes.push(currentIndex);
      currentIndex++;
      showQuestion();
    }
  }, 1000);
}

// ✅ ปุ่มย้อนกลับ
document.getElementById("back-btn").onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
};

// ✅ ปุ่มข้าม
document.getElementById("next-btn").onclick = () => {
  skippedIndexes.push(currentIndex);
  currentIndex++;
  showQuestion();
};

// ✅ ปุ่มเริ่มใหม่ → กลับไปหน้าเลือกชุดข้อสอบ
document.getElementById("restart-btn").onclick = () => {
  // รีเซ็ต state
  currentIndex = 0;
  score = 0;
  results = [];
  skippedIndexes = [];
  answeredIndexes = [];

  // ล้าง UI เฉลย
  document.getElementById("score").innerText = "";
  document.getElementById("explanations")?.remove();
  document.getElementById("restart-btn").style.display = "none";

  // ✅ กลับไปหน้าเลือกชุดข้อสอบ
  window.location.href = "select.html";
};

loadQuestions();
