import Achievement from './Achievement';

interface UserStatistics {
  totalWins: number;
  totalLosses: number;
  winRate: number;
  ladderRank: number;
  achievements: Achievement[];
}

export default UserStatistics;