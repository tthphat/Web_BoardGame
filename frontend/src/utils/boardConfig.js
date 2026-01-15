/**
 * Board Game Configuration
 * Cấu hình kích thước bàn game (ma trận điểm)
 */

export const BOARD_SIZES = {
  MEDIUM: {
    cols: 13,
    rows: 13,
    dotSize: 27,  // px
    gap: 8,       // px
  },
  LARGE: {
    cols: 21,
    rows: 15,
    dotSize: 24,
    gap: 6,
  },
  EXTRA_LARGE: {
    cols: 30,
    rows: 18,
    dotSize: 19,
    gap: 6,
  }
};

// Hardcode hiện tại - sau này Admin sẽ chỉnh từ DB
export const CURRENT_BOARD_SIZE = 'EXTRA_LARGE';

export const getBoardConfig = () => {
  return BOARD_SIZES[CURRENT_BOARD_SIZE];
};
