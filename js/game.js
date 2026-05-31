class PatternGame {
  constructor() {
    this.questions = [];
    this.currentQuestion = null;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.totalQuestions = 10;
    this.answered = 0;
    this.correctCount = 0;
    this.history = [];
    this.isFinished = false;
  }

  init(totalQuestions = 10) {
    this.questions = this.generateQuestions(totalQuestions);
    this.totalQuestions = this.questions.length;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.answered = 0;
    this.correctCount = 0;
    this.history = [];
    this.isFinished = false;
    this.currentQuestion = this.questions[0];
  }

  generateQuestions(count) {
    const allQuestions = [];

    PATTERNS_DATA.forEach((pattern) => {
      pattern.examples.forEach((example, idx) => {
        allQuestions.push({
          id: `${pattern.id}-${idx}`,
          code: example.code,
          codeTitle: example.title,
          correctAnswer: pattern.id,
          correctName: pattern.name,
          explanation: pattern.description,
          category: pattern.category,
        });
      });
    });

    return this.shuffle(allQuestions).slice(0, count);
  }

  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  getOptions() {
    if (!this.currentQuestion) return [];

    const correctId = this.currentQuestion.correctAnswer;
    const otherPatterns = PATTERNS_DATA.filter((p) => p.id !== correctId);
    const wrongOptions = this.shuffle(otherPatterns)
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        name: p.name,
        nameEn: p.nameEn,
      }));

    const correctPattern = PATTERNS_DATA.find((p) => p.id === correctId);
    const allOptions = [
      ...wrongOptions,
      { id: correctPattern.id, name: correctPattern.name, nameEn: correctPattern.nameEn },
    ];

    return this.shuffle(allOptions);
  }

  submitAnswer(answerId) {
    if (!this.currentQuestion || this.isFinished) return null;

    const isCorrect = answerId === this.currentQuestion.correctAnswer;
    this.answered++;

    if (isCorrect) {
      this.correctCount++;
      this.score += 10;
    }

    const result = {
      isCorrect,
      correctAnswer: this.currentQuestion.correctAnswer,
      correctName: this.currentQuestion.correctName,
      explanation: this.currentQuestion.explanation,
      selectedAnswer: answerId,
      selectedName: PATTERNS_DATA.find((p) => p.id === answerId)?.name || '',
    };

    this.history.push({
      question: this.currentQuestion,
      result,
    });

    return result;
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex >= this.totalQuestions) {
      this.isFinished = true;
      this.currentQuestion = null;
      return false;
    }
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    return true;
  }

  getProgress() {
    return {
      current: this.currentQuestionIndex + 1,
      total: this.totalQuestions,
      score: this.score,
      correctCount: this.correctCount,
      answered: this.answered,
      accuracy: this.answered > 0 ? Math.round((this.correctCount / this.answered) * 100) : 0,
    };
  }

  getResults() {
    return {
      score: this.score,
      totalQuestions: this.totalQuestions,
      correctCount: this.correctCount,
      accuracy: Math.round((this.correctCount / this.totalQuestions) * 100),
      history: this.history,
    };
  }
}

// --- UI Controller ---

class GameUI {
  constructor() {
    this.game = new PatternGame();
    this.currentOptions = [];
    this.selectedAnswer = null;
    this.hasSubmitted = false;
  }

  start(questionCount = 10) {
    this.game.init(questionCount);
    this.selectedAnswer = null;
    this.hasSubmitted = false;
    this.renderQuestion();
    this.updateProgress();
    this.hideResults();
    document.getElementById("game-area").style.display = "block";
  }

  renderQuestion() {
    const q = this.game.currentQuestion;
    if (!q) return;

    this.selectedAnswer = null;
    this.hasSubmitted = false;

    document.getElementById("question-number").textContent =
      `第 ${this.game.currentQuestionIndex + 1}/${this.game.totalQuestions} 题`;
    document.getElementById("code-title").textContent = q.codeTitle;
    document.getElementById("code-display").textContent = q.code;

    if (window.hljs) {
      document.getElementById("code-display").removeAttribute("data-highlighted");
      hljs.highlightElement(document.getElementById("code-display"));
    }

    this.currentOptions = this.game.getOptions();
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    this.currentOptions.forEach((option, index) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span>
        <span class="option-text">${option.name}<small>${option.nameEn}</small></span>`;
      btn.onclick = () => this.selectOption(option.id, btn);
      optionsContainer.appendChild(btn);
    });

    document.getElementById("feedback-area").style.display = "none";
    document.getElementById("submit-btn").disabled = true;
    document.getElementById("submit-btn").style.display = "inline-block";
    document.getElementById("next-btn").style.display = "none";
  }

  selectOption(optionId, btnElement) {
    if (this.hasSubmitted) return;

    this.selectedAnswer = optionId;
    document.querySelectorAll(".option-btn").forEach((btn) => {
      btn.classList.remove("selected");
    });
    btnElement.classList.add("selected");
    document.getElementById("submit-btn").disabled = false;
  }

  submit() {
    if (!this.selectedAnswer || this.hasSubmitted) return;

    this.hasSubmitted = true;
    const result = this.game.submitAnswer(this.selectedAnswer);

    document.querySelectorAll(".option-btn").forEach((btn) => {
      btn.disabled = true;
      const optionId = this.currentOptions.find(
        (o) => o.name === btn.querySelector(".option-text").textContent.replace(/\s+/g, "").split(/[a-zA-Z]/)[0]
      );
    });

    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn, idx) => {
      const optId = this.currentOptions[idx].id;
      if (optId === result.correctAnswer) {
        btn.classList.add("correct");
      } else if (optId === this.selectedAnswer && !result.isCorrect) {
        btn.classList.add("wrong");
      }
      btn.onclick = null;
    });

    const feedback = document.getElementById("feedback-area");
    feedback.style.display = "block";
    feedback.className = `feedback-area ${result.isCorrect ? "correct" : "wrong"}`;
    document.getElementById("feedback-icon").textContent = result.isCorrect ? "✓" : "✗";
    document.getElementById("feedback-title").textContent = result.isCorrect
      ? "回答正确！"
      : `回答错误！正确答案是：${result.correctName}`;
    document.getElementById("feedback-explanation").textContent = result.explanation;

    document.getElementById("submit-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "inline-block";

    this.updateProgress();
  }

  next() {
    const hasNext = this.game.nextQuestion();
    if (hasNext) {
      this.renderQuestion();
      this.updateProgress();
    } else {
      this.showResults();
    }
  }

  updateProgress() {
    const progress = this.game.getProgress();
    document.getElementById("progress-bar-fill").style.width =
      `${(progress.answered / progress.total) * 100}%`;
    document.getElementById("score-display").textContent = progress.score;
    document.getElementById("accuracy-display").textContent = `${progress.accuracy}%`;
  }

  showResults() {
    document.getElementById("game-area").style.display = "none";
    const results = this.game.getResults();
    const resultsDiv = document.getElementById("results-area");
    resultsDiv.style.display = "block";

    document.getElementById("final-score").textContent = results.score;
    document.getElementById("final-correct").textContent =
      `${results.correctCount}/${results.totalQuestions}`;
    document.getElementById("final-accuracy").textContent = `${results.accuracy}%`;

    let grade = "";
    if (results.accuracy >= 90) grade = "设计模式大师！";
    else if (results.accuracy >= 70) grade = "模式达人！";
    else if (results.accuracy >= 50) grade = "初窥门径";
    else grade = "继续加油！";
    document.getElementById("final-grade").textContent = grade;

    const historyList = document.getElementById("history-list");
    historyList.innerHTML = "";
    results.history.forEach((item, idx) => {
      const div = document.createElement("div");
      div.className = `history-item ${item.result.isCorrect ? "correct" : "wrong"}`;
      div.innerHTML = `
        <span class="history-num">${idx + 1}</span>
        <span class="history-icon">${item.result.isCorrect ? "✓" : "✗"}</span>
        <span class="history-detail">
          <strong>${item.question.codeTitle}</strong>
          <span>正确答案: ${item.result.correctName}${
        !item.result.isCorrect ? ` | 你的答案: ${item.result.selectedName}` : ""
      }</span>
        </span>
      `;
      historyList.appendChild(div);
    });
  }

  hideResults() {
    document.getElementById("results-area").style.display = "none";
  }

  restart() {
    this.start(this.game.totalQuestions);
  }
}

let gameUI;

document.addEventListener("DOMContentLoaded", () => {
  gameUI = new GameUI();

  document.getElementById("start-btn")?.addEventListener("click", () => {
    const count = parseInt(document.getElementById("question-count")?.value || "10");
    gameUI.start(count);
    document.getElementById("start-screen").style.display = "none";
  });

  document.getElementById("submit-btn")?.addEventListener("click", () => {
    gameUI.submit();
  });

  document.getElementById("next-btn")?.addEventListener("click", () => {
    gameUI.next();
  });

  document.getElementById("restart-btn")?.addEventListener("click", () => {
    document.getElementById("start-screen").style.display = "flex";
    gameUI.restart();
  });

  document.getElementById("play-again-btn")?.addEventListener("click", () => {
    gameUI.restart();
  });
});
