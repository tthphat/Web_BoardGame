import { AchievementService } from "./achievement.service.js";

/**
 * Achievement Checker Service
 * 
 * Kiến trúc mở rộng cho hệ thống achievement.
 * Mỗi checker là một function kiểm tra điều kiện và trả về achievement code nếu thỏa mãn.
 * 
 * Để thêm achievement mới:
 * 1. Thêm achievement vào database (seeds)
 * 2. Tạo checker function trong ACHIEVEMENT_CHECKERS
 * 3. Done! Logic sẽ tự động chạy khi game finish
 */

// ============================================
// ACHIEVEMENT CHECKER DEFINITIONS
// ============================================

/**
 * Mỗi checker nhận vào context và trả về:
 * - null nếu không đủ điều kiện
 * - { code, meta } nếu đủ điều kiện để cấp achievement
 * 
 * Context chứa: { gameSlug, userId, result, stats }
 */
const ACHIEVEMENT_CHECKERS = [
    // ==========================================
    // FIRST PLAY ACHIEVEMENTS
    // ==========================================
    {
        name: "First Play",
        description: "Cấp khi chơi game lần đầu tiên",
        check: (context) => {
            const { gameSlug, result } = context;
            const mapping = {
                "tic-tac-toe": "FIRST_PLAY_TIC_TAC_TOE",
                "caro-4": "FIRST_PLAY_CARO_4",
                "caro-5": "FIRST_PLAY_CARO_5",
                "match-3": "FIRST_PLAY_MATCH_3",
                "snake": "FIRST_PLAY_SNAKE",
                "memory-card": "FIRST_PLAY_MEMORY_CARD",
                "free-draw": "FIRST_PLAY_FREE_DRAW"
            };

            const code = mapping[gameSlug];
            if (!code) return null;

            return {
                code,
                meta: { gameSlug, result, date: new Date() }
            };
        }
    },

    // ==========================================
    // PLAY COUNT ACHIEVEMENTS (3 games)
    // ==========================================
    {
        name: "Play 3 Games",
        description: "Cấp khi chơi game 3 lần",
        check: (context) => {
            const { gameSlug, stats } = context;
            if (!stats || stats.totalPlays < 3) return null;

            const mapping = {
                "tic-tac-toe": "PLAY_3_GAMES_TIC_TAC_TOE",
                "caro-4": "PLAY_3_GAMES_CARO_4",
                "caro-5": "PLAY_3_GAMES_CARO_5",
                "match-3": "PLAY_3_GAMES_MATCH_3",
                "snake": "PLAY_3_GAMES_SNAKE",
                "memory-card": "PLAY_3_GAMES_MEMORY_CARD"
            };

            const code = mapping[gameSlug];
            if (!code) return null;

            return {
                code,
                meta: { gameSlug, totalPlays: stats.totalPlays, date: new Date() }
            };
        }
    },

    // ==========================================
    // PLAY COUNT ACHIEVEMENTS (5 games)
    // ==========================================
    {
        name: "Play 5 Games",
        description: "Cấp khi chơi game 5 lần",
        check: (context) => {
            const { gameSlug, stats } = context;
            if (!stats || stats.totalPlays < 5) return null;

            const mapping = {
                "tic-tac-toe": "PLAY_5_GAMES_TIC_TAC_TOE",
                "caro-4": "PLAY_5_GAMES_CARO_4",
                "caro-5": "PLAY_5_GAMES_CARO_5",
                "match-3": "PLAY_5_GAMES_MATCH_3",
                "snake": "PLAY_5_GAMES_SNAKE",
                "memory-card": "PLAY_5_GAMES_MEMORY_CARD"
            };

            const code = mapping[gameSlug];
            if (!code) return null;

            return {
                code,
                meta: { gameSlug, totalPlays: stats.totalPlays, date: new Date() }
            };
        }
    },
];

// ============================================
// ACHIEVEMENT CHECKER SERVICE
// ============================================

export class AchievementCheckerService {
    /**
     * Chạy tất cả achievement checkers và cấp achievement nếu đủ điều kiện
     * 
     * @param {object} knex - Knex instance
     * @param {object} context - Context chứa thông tin game: { gameSlug, userId, result, stats }
     * @returns {Promise<Array>} - Danh sách achievements đã được cấp
     */
    static async checkAndGrantAchievements(knex, context) {
        const { userId } = context;
        const earnedAchievements = [];

        for (const checker of ACHIEVEMENT_CHECKERS) {
            try {
                const result = checker.check(context);

                if (result) {
                    const achievement = await AchievementService.grantAchievementService(
                        knex,
                        userId,
                        result.code,
                        result.meta
                    );

                    if (achievement) {
                        earnedAchievements.push(achievement);
                        console.log(`[Achievement] Granted "${achievement.name}" via checker "${checker.name}"`);
                    }
                }
            } catch (error) {
                console.error(`[Achievement] Error in checker "${checker.name}":`, error);
            }
        }

        return earnedAchievements;
    }

    /**
     * Lấy danh sách tất cả checkers (để debug hoặc admin)
     */
    static getAvailableCheckers() {
        return ACHIEVEMENT_CHECKERS.map(c => ({
            name: c.name,
            description: c.description
        }));
    }
}
