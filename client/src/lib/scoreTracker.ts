// Score and rating tracking utilities for Spark It!

export interface ActivityRating {
  activityId: number;
  rating: 'loved' | 'meh';
  timestamp: string;
}

export interface ActivityResult {
  activityId: number;
  activityTitle: string;
  winner: 'partner1' | 'partner2' | 'tie';
  timestamp: string;
}

export interface ScoreData {
  partner1Wins: number;
  partner2Wins: number;
  ties: number;
  currentStreak: {
    winner: 'partner1' | 'partner2' | 'none';
    count: number;
  };
  ratings: ActivityRating[];
  results: ActivityResult[];
}

const SCORE_STORAGE_KEY = 'spark-it-scores';

// Initialize or get score data
export function getScoreData(): ScoreData {
  const stored = localStorage.getItem(SCORE_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    partner1Wins: 0,
    partner2Wins: 0,
    ties: 0,
    currentStreak: { winner: 'none', count: 0 },
    ratings: [],
    results: []
  };
}

// Save score data
function saveScoreData(data: ScoreData): void {
  localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(data));
}

// Add activity rating
export function rateActivity(activityId: number, rating: 'loved' | 'meh'): void {
  const data = getScoreData();
  
  // Remove existing rating for this activity if any
  data.ratings = data.ratings.filter(r => r.activityId !== activityId);
  
  // Add new rating
  data.ratings.push({
    activityId,
    rating,
    timestamp: new Date().toISOString()
  });
  
  saveScoreData(data);
}

// Record activity result
export function recordWinner(
  activityId: number,
  activityTitle: string,
  winner: 'partner1' | 'partner2' | 'tie'
): void {
  const data = getScoreData();
  
  // Update win counts
  if (winner === 'partner1') {
    data.partner1Wins++;
  } else if (winner === 'partner2') {
    data.partner2Wins++;
  } else {
    data.ties++;
  }
  
  // Update streak
  if (winner === 'tie') {
    data.currentStreak = { winner: 'none', count: 0 };
  } else if (data.currentStreak.winner === winner) {
    data.currentStreak.count++;
  } else {
    data.currentStreak = { winner, count: 1 };
  }
  
  // Add to results history
  data.results.push({
    activityId,
    activityTitle,
    winner,
    timestamp: new Date().toISOString()
  });
  
  saveScoreData(data);
}

// Get favorite activities
export function getFavoriteActivities(): number[] {
  const data = getScoreData();
  return data.ratings
    .filter(r => r.rating === 'loved')
    .map(r => r.activityId);
}

// Get activity rating
export function getActivityRating(activityId: number): 'loved' | 'meh' | null {
  const data = getScoreData();
  const rating = data.ratings.find(r => r.activityId === activityId);
  return rating ? rating.rating : null;
}

// Get scoreboard summary
export function getScoreboardSummary() {
  const data = getScoreData();
  const total = data.partner1Wins + data.partner2Wins + data.ties;
  
  return {
    partner1: {
      wins: data.partner1Wins,
      percentage: total > 0 ? Math.round((data.partner1Wins / total) * 100) : 0
    },
    partner2: {
      wins: data.partner2Wins,
      percentage: total > 0 ? Math.round((data.partner2Wins / total) * 100) : 0
    },
    ties: data.ties,
    total,
    streak: data.currentStreak,
    recentResults: data.results.slice(-5).reverse()
  };
}

// Reset all scores (for testing or fresh start)
export function resetScores(): void {
  localStorage.removeItem(SCORE_STORAGE_KEY);
}
