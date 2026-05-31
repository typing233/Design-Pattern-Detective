const ProgressManager = (() => {
  const KEYS = {
    profile: 'dpd_profile',
    history: 'dpd_history',
    leaderboard: 'dpd_leaderboard'
  };

  function getProfile() {
    const data = localStorage.getItem(KEYS.profile);
    if (data) return JSON.parse(data);
    return {
      name: '匿名侦探',
      totalGames: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      bestScore: 0,
      bestStreak: 0,
      levelsUnlocked: 1,
      levelsCompleted: [],
      patternStats: {}
    };
  }

  function saveProfile(profile) {
    localStorage.setItem(KEYS.profile, JSON.stringify(profile));
  }

  function setPlayerName(name) {
    const profile = getProfile();
    profile.name = name || '匿名侦探';
    saveProfile(profile);
  }

  function recordGame(result) {
    const profile = getProfile();
    profile.totalGames++;
    profile.totalCorrect += result.correctCount;
    profile.totalAnswered += result.totalQuestions;
    if (result.score > profile.bestScore) profile.bestScore = result.score;
    if (result.bestStreak > profile.bestStreak) profile.bestStreak = result.bestStreak;

    if (result.history) {
      result.history.forEach(item => {
        const patternId = item.question.correctAnswer;
        if (!profile.patternStats[patternId]) {
          profile.patternStats[patternId] = { correct: 0, total: 0 };
        }
        profile.patternStats[patternId].total++;
        if (item.result.isCorrect) profile.patternStats[patternId].correct++;
      });
    }

    if (result.level && result.accuracy >= 70) {
      if (!profile.levelsCompleted.includes(result.level)) {
        profile.levelsCompleted.push(result.level);
      }
      if (result.level >= profile.levelsUnlocked && result.level < 5) {
        profile.levelsUnlocked = result.level + 1;
      }
    }

    saveProfile(profile);
    addToHistory(result);
    updateLeaderboard(profile.name, result.score);
  }

  function getHistory() {
    const data = localStorage.getItem(KEYS.history);
    return data ? JSON.parse(data) : [];
  }

  function addToHistory(result) {
    const history = getHistory();
    history.unshift({
      date: new Date().toISOString(),
      score: result.score,
      correct: result.correctCount,
      total: result.totalQuestions,
      accuracy: result.accuracy,
      level: result.level || null,
      mode: result.mode || 'free'
    });
    if (history.length > 50) history.length = 50;
    localStorage.setItem(KEYS.history, JSON.stringify(history));
  }

  function getLeaderboard() {
    const data = localStorage.getItem(KEYS.leaderboard);
    return data ? JSON.parse(data) : [];
  }

  function updateLeaderboard(name, score) {
    const board = getLeaderboard();
    board.push({ name, score, date: new Date().toISOString() });
    board.sort((a, b) => b.score - a.score);
    if (board.length > 10) board.length = 10;
    localStorage.setItem(KEYS.leaderboard, JSON.stringify(board));
  }

  function getOverallAccuracy() {
    const profile = getProfile();
    if (profile.totalAnswered === 0) return 0;
    return Math.round((profile.totalCorrect / profile.totalAnswered) * 100);
  }

  function getPatternAccuracy() {
    const profile = getProfile();
    const stats = [];
    for (const [patternId, data] of Object.entries(profile.patternStats)) {
      const pattern = typeof PATTERNS_DATA !== 'undefined'
        ? PATTERNS_DATA.find(p => p.id === patternId)
        : null;
      stats.push({
        id: patternId,
        name: pattern ? pattern.name : patternId,
        correct: data.correct,
        total: data.total,
        accuracy: Math.round((data.correct / data.total) * 100)
      });
    }
    return stats.sort((a, b) => a.accuracy - b.accuracy);
  }

  function resetProgress() {
    localStorage.removeItem(KEYS.profile);
    localStorage.removeItem(KEYS.history);
    localStorage.removeItem(KEYS.leaderboard);
  }

  return {
    getProfile,
    saveProfile,
    setPlayerName,
    recordGame,
    getHistory,
    getLeaderboard,
    getOverallAccuracy,
    getPatternAccuracy,
    resetProgress
  };
})();
