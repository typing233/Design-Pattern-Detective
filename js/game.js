const LEVELS = [
  { id: 1, name: '入门', timer: 30, questions: 5, difficulty: [1], hideTitle: false },
  { id: 2, name: '进阶', timer: 25, questions: 8, difficulty: [1, 2], hideTitle: false },
  { id: 3, name: '高手', timer: 20, questions: 10, difficulty: [2, 3], hideTitle: false },
  { id: 4, name: '精英', timer: 18, questions: 12, difficulty: [1, 2, 3], hideTitle: false },
  { id: 5, name: '大师', timer: 15, questions: 15, difficulty: [1, 2, 3], hideTitle: true },
];

class PatternGame {
  constructor() {
    this.reset();
  }

  reset() {
    this.questions = [];
    this.currentQuestion = null;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.totalQuestions = 10;
    this.answered = 0;
    this.correctCount = 0;
    this.history = [];
    this.isFinished = false;
    this.streak = 0;
    this.bestStreak = 0;
    this.combo = 1;
    this.level = null;
    this.mode = 'free';
    this.timerDuration = 30;
    this.hideTitle = false;
  }

  init(options = {}) {
    this.reset();
    if (options.level) {
      const lvl = LEVELS.find(l => l.id === options.level);
      if (lvl) {
        this.level = lvl.id;
        this.mode = 'level';
        this.timerDuration = lvl.timer;
        this.hideTitle = lvl.hideTitle;
        this.questions = this.generateQuestions(lvl.questions, lvl.difficulty);
      }
    } else {
      this.mode = 'free';
      this.timerDuration = options.timer || 30;
      this.hideTitle = false;
      this.questions = this.generateQuestions(options.count || 10);
    }
    this.totalQuestions = this.questions.length;
    this.currentQuestion = this.questions[0];
  }

  generateQuestions(count, difficulties = null) {
    const allQuestions = [];
    PATTERNS_DATA.forEach(pattern => {
      pattern.examples.forEach((example, idx) => {
        if (difficulties && !difficulties.includes(example.difficulty || pattern.difficulty)) return;
        allQuestions.push({
          id: `${pattern.id}-${idx}`,
          code: example.code,
          codeTitle: example.title,
          correctAnswer: pattern.id,
          correctName: pattern.name,
          explanation: pattern.description,
          category: pattern.category,
          difficulty: example.difficulty || pattern.difficulty
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
    const otherPatterns = PATTERNS_DATA.filter(p => p.id !== correctId);
    const wrongOptions = this.shuffle(otherPatterns).slice(0, 3).map(p => ({
      id: p.id, name: p.name, nameEn: p.nameEn
    }));
    const correctPattern = PATTERNS_DATA.find(p => p.id === correctId);
    return this.shuffle([
      ...wrongOptions,
      { id: correctPattern.id, name: correctPattern.name, nameEn: correctPattern.nameEn }
    ]);
  }

  submitAnswer(answerId, timeLeft) {
    if (!this.currentQuestion || this.isFinished) return null;

    const isCorrect = answerId === this.currentQuestion.correctAnswer;
    this.answered++;

    if (isCorrect) {
      this.correctCount++;
      this.streak++;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;
      this.combo = Math.min(1 + (this.streak - 1) * 0.5, 3);
      const timeBonus = Math.round((timeLeft / this.timerDuration) * 5);
      const baseScore = 10;
      const points = Math.round((baseScore + timeBonus) * this.combo);
      this.score += points;
    } else {
      this.streak = 0;
      this.combo = 1;
    }

    const result = {
      isCorrect,
      correctAnswer: this.currentQuestion.correctAnswer,
      correctName: this.currentQuestion.correctName,
      explanation: this.currentQuestion.explanation,
      selectedAnswer: answerId,
      selectedName: PATTERNS_DATA.find(p => p.id === answerId)?.name || '',
      streak: this.streak,
      combo: this.combo,
      pointsEarned: isCorrect ? Math.round((10 + Math.round((timeLeft / this.timerDuration) * 5)) * this.combo) : 0
    };

    this.history.push({ question: this.currentQuestion, result });
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
      streak: this.streak,
      combo: this.combo
    };
  }

  getResults() {
    return {
      score: this.score,
      totalQuestions: this.totalQuestions,
      correctCount: this.correctCount,
      accuracy: Math.round((this.correctCount / this.totalQuestions) * 100),
      history: this.history,
      bestStreak: this.bestStreak,
      level: this.level,
      mode: this.mode
    };
  }
}

class GameUI {
  constructor() {
    this.game = new PatternGame();
    this.currentOptions = [];
    this.selectedAnswer = null;
    this.hasSubmitted = false;
    this.timer = null;
    this.timeLeft = 30;
    this.timerInterval = null;
  }

  startLevel(levelId) {
    this.game.init({ level: levelId });
    this.beginGame();
  }

  startFree(count = 10) {
    this.game.init({ count });
    this.beginGame();
  }

  beginGame() {
    this.selectedAnswer = null;
    this.hasSubmitted = false;
    this.renderQuestion();
    this.updateProgress();
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    document.getElementById('results-area').style.display = 'none';
  }

  renderQuestion() {
    const q = this.game.currentQuestion;
    if (!q) return;

    this.selectedAnswer = null;
    this.hasSubmitted = false;

    document.getElementById('question-number').textContent =
      `第 ${this.game.currentQuestionIndex + 1}/${this.game.totalQuestions} 题`;

    const titleEl = document.getElementById('code-title');
    if (this.game.hideTitle) {
      titleEl.textContent = '（隐藏提示 - 大师模式）';
    } else {
      titleEl.textContent = q.codeTitle;
    }

    document.getElementById('code-display').textContent = q.code;
    if (window.hljs) {
      document.getElementById('code-display').removeAttribute('data-highlighted');
      hljs.highlightElement(document.getElementById('code-display'));
    }

    this.currentOptions = this.game.getOptions();
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    this.currentOptions.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span>
        <span class="option-text"><strong>${option.name}</strong><small>${option.nameEn}</small></span>`;
      btn.onclick = () => this.selectOption(option.id, btn);
      optionsContainer.appendChild(btn);
    });

    document.getElementById('feedback-area').style.display = 'none';
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('submit-btn').style.display = 'inline-block';
    document.getElementById('next-btn').style.display = 'none';

    this.startTimer();
  }

  startTimer() {
    this.stopTimer();
    this.timeLeft = this.game.timerDuration;
    const timerBar = document.getElementById('timer-bar-fill');
    const timerText = document.getElementById('timer-text');
    const timerContainer = document.getElementById('timer-bar');

    if (timerBar) timerBar.style.width = '100%';
    if (timerText) timerText.textContent = this.timeLeft + 's';
    if (timerContainer) timerContainer.classList.remove('urgent');

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      const pct = (this.timeLeft / this.game.timerDuration) * 100;
      if (timerBar) timerBar.style.width = pct + '%';
      if (timerText) timerText.textContent = this.timeLeft + 's';

      if (this.timeLeft <= 5 && timerContainer) {
        timerContainer.classList.add('urgent');
      }

      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.timeUp();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  timeUp() {
    if (this.hasSubmitted) return;
    this.hasSubmitted = true;

    const result = this.game.submitAnswer('__timeout__', 0);
    this.showFeedback(result, true);
    this.updateProgress();
  }

  selectOption(optionId, btnElement) {
    if (this.hasSubmitted) return;
    this.selectedAnswer = optionId;
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    btnElement.classList.add('selected');
    document.getElementById('submit-btn').disabled = false;
  }

  submit() {
    if (!this.selectedAnswer || this.hasSubmitted) return;
    this.hasSubmitted = true;
    this.stopTimer();

    const result = this.game.submitAnswer(this.selectedAnswer, this.timeLeft);
    this.showFeedback(result, false);
    this.updateProgress();
  }

  showFeedback(result, isTimeout) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
      const optId = this.currentOptions[idx].id;
      if (optId === result.correctAnswer) btn.classList.add('correct');
      else if (optId === this.selectedAnswer && !result.isCorrect) btn.classList.add('wrong');
      btn.onclick = null;
    });

    const feedback = document.getElementById('feedback-area');
    feedback.style.display = 'block';

    if (isTimeout) {
      feedback.className = 'feedback-area timeout';
      document.getElementById('feedback-icon').textContent = '⏰';
      document.getElementById('feedback-title').textContent = `时间到！正确答案是：${result.correctName}`;
    } else if (result.isCorrect) {
      feedback.className = 'feedback-area correct';
      document.getElementById('feedback-icon').textContent = '✓';
      let title = '回答正确！';
      if (result.combo > 1) title += ` 连击 x${result.combo.toFixed(1)}`;
      title += ` +${result.pointsEarned}分`;
      document.getElementById('feedback-title').textContent = title;
      document.getElementById('game-area').classList.add('flash-correct');
      setTimeout(() => document.getElementById('game-area').classList.remove('flash-correct'), 500);
    } else {
      feedback.className = 'feedback-area wrong';
      document.getElementById('feedback-icon').textContent = '✗';
      document.getElementById('feedback-title').textContent = `回答错误！正确答案是：${result.correctName}`;
      document.getElementById('game-area').classList.add('shake');
      setTimeout(() => document.getElementById('game-area').classList.remove('shake'), 500);
    }

    document.getElementById('feedback-explanation').textContent = result.explanation;
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'inline-block';

    this.updateComboDisplay(result);
  }

  updateComboDisplay(result) {
    const comboEl = document.getElementById('combo-display');
    if (!comboEl) return;
    if (result.isCorrect && result.streak >= 2) {
      comboEl.textContent = `🔥 ${result.streak} 连击`;
      comboEl.classList.add('active');
      comboEl.classList.remove('break');
    } else if (!result.isCorrect && this.game.streak === 0) {
      comboEl.textContent = '连击中断';
      comboEl.classList.add('break');
      comboEl.classList.remove('active');
      setTimeout(() => comboEl.classList.remove('break'), 1000);
    } else {
      comboEl.classList.remove('active', 'break');
      comboEl.textContent = '';
    }
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
    const pct = (progress.answered / progress.total) * 100;
    document.getElementById('progress-bar-fill').style.width = pct + '%';
    document.getElementById('score-display').textContent = progress.score;
    document.getElementById('accuracy-display').textContent = progress.accuracy + '%';

    const streakEl = document.getElementById('streak-display');
    if (streakEl) streakEl.textContent = progress.streak;
  }

  showResults() {
    this.stopTimer();
    document.getElementById('game-area').style.display = 'none';
    const results = this.game.getResults();
    const resultsDiv = document.getElementById('results-area');
    resultsDiv.style.display = 'block';

    document.getElementById('final-score').textContent = results.score;
    document.getElementById('final-correct').textContent = `${results.correctCount}/${results.totalQuestions}`;
    document.getElementById('final-accuracy').textContent = results.accuracy + '%';
    document.getElementById('final-streak').textContent = results.bestStreak;

    let grade = '';
    if (results.accuracy >= 90) grade = '🏆 设计模式大师！';
    else if (results.accuracy >= 70) grade = '⭐ 模式达人！';
    else if (results.accuracy >= 50) grade = '📖 初窥门径';
    else grade = '💪 继续加油！';
    document.getElementById('final-grade').textContent = grade;

    if (results.level && results.accuracy >= 70) {
      const unlockMsg = document.getElementById('unlock-message');
      if (unlockMsg && results.level < 5) {
        unlockMsg.textContent = `✅ 关卡 ${results.level} 通过！已解锁下一关`;
        unlockMsg.style.display = 'block';
      }
    }

    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    results.history.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = `history-item ${item.result.isCorrect ? 'correct' : 'wrong'}`;
      div.innerHTML = `
        <span class="history-num">${idx + 1}</span>
        <span class="history-icon">${item.result.isCorrect ? '✓' : '✗'}</span>
        <span class="history-detail">
          <strong>${item.question.codeTitle}</strong>
          <span>正确答案: ${item.result.correctName}${
        !item.result.isCorrect ? ` | 你的答案: ${item.result.selectedName || '超时'}` : ''
      }</span>
        </span>`;
      historyList.appendChild(div);
    });

    ProgressManager.recordGame(results);
  }

  restart() {
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('results-area').style.display = 'none';
    this.stopTimer();
    renderLevelSelect();
  }
}

function renderLevelSelect() {
  const profile = ProgressManager.getProfile();
  const container = document.getElementById('level-select');
  if (!container) return;

  container.innerHTML = LEVELS.map(lvl => {
    const locked = lvl.id > profile.levelsUnlocked;
    const completed = profile.levelsCompleted.includes(lvl.id);
    return `<button class="level-btn ${locked ? 'locked' : ''} ${completed ? 'completed' : ''}"
      data-level="${lvl.id}" ${locked ? 'disabled' : ''}>
      <span class="level-num">${locked ? '🔒' : (completed ? '✅' : lvl.id)}</span>
      <span class="level-name">${lvl.name}</span>
      <span class="level-info">${lvl.questions}题 · ${lvl.timer}s</span>
    </button>`;
  }).join('');
}

let gameUI;

document.addEventListener('DOMContentLoaded', () => {
  gameUI = new GameUI();
  renderLevelSelect();

  document.getElementById('level-select')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.level-btn');
    if (!btn || btn.disabled) return;
    gameUI.startLevel(parseInt(btn.dataset.level));
  });

  document.getElementById('free-mode-btn')?.addEventListener('click', () => {
    const count = parseInt(document.getElementById('question-count')?.value || '10');
    gameUI.startFree(count);
  });

  document.getElementById('submit-btn')?.addEventListener('click', () => gameUI.submit());
  document.getElementById('next-btn')?.addEventListener('click', () => gameUI.next());
  document.getElementById('play-again-btn')?.addEventListener('click', () => gameUI.restart());
});
