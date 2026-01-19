/**
 * GAME REGISTRY - Central configuration for all games
 * 
 * Mỗi game được định nghĩa với:
 * - name: Tên hiển thị
 * - slug: ID cho API/database
 * - refKey: Key để map với ref trong GameMatrix
 * - fullboard: Có dùng toàn bộ board không
 * - useFullCoords: Có dùng full coordinates không (cho fullboard games)
 * - hideOutsideDots: Ẩn các dots ngoài vùng chơi không
 * - hasWrapper: Game có wrapper component không
 * - externalState: Game dùng state từ bên ngoài (Memory, Drawing)
 * - initialState: State ban đầu của game
 * - getStatusText: Hàm tạo text trạng thái
 */

// Game configurations
export const GAME_REGISTRY = {
  HEART: {
    name: 'Welcome',
    slug: 'heart',
    refKey: null,
    fullboard: false,
    useFullCoords: false,
    hideOutsideDots: false,
    hasWrapper: false,
    externalState: null,
    initialState: {},
    getStatusText: () => '',
  },
  SNAKE: {
    name: 'Snake',
    slug: 'snake',
    refKey: 'snake',  // Changed from null
    fullboard: true,  // Changed from false - Snake uses full board
    useFullCoords: true,  // Snake uses full coordinates
    hideOutsideDots: false,
    hasWrapper: true,  // Changed from false - now has SnakeWrapper
    externalState: null,
    initialState: { score: 0, isGameOver: false },
    getStatusText: (state, isPlaying) => {
      if (!isPlaying) return '';
      if (state.isGameOver) return '- GAME OVER!';
      return `- Playing`;
    },
  },
  DRAWING: {
    name: 'Free Draw',
    slug: 'free-draw',
    refKey: null,
    fullboard: true,
    useFullCoords: true,
    hideOutsideDots: false,
    hasWrapper: false,
    externalState: 'drawingState',
    initialState: {},
    getStatusText: (state, isPlaying) => {
      if (!isPlaying) return '';
      return `- ${state?.isErasing ? 'ERASING' : state?.selectedColor || 'Drawing'}`;
    },
  },
  CARO5: {
    name: 'Caro 5x5',
    slug: 'caro-5',
    refKey: 'caro5',
    fullboard: true,
    useFullCoords: true,
    hideOutsideDots: false,
    hasWrapper: true,
    externalState: null,
    initialState: { currentPlayer: 'BLUE', winner: null },
    getStatusText: (state, isPlaying) => {
      if (!isPlaying) return '';
      if (state.winner === 'DRAW') return '- HÒA!';
      if (state.winner === 'BLUE') return '- XANH THẮNG!';
      if (state.winner === 'RED') return '- ĐỎ THẮNG!';
      return `- Lượt ${state.currentPlayer === 'BLUE' ? 'XANH' : 'ĐỎ'}`;
    },
  },
  CARO4: {
    name: 'Caro 4x4',
    slug: 'caro-4',
    refKey: 'caro4',
    fullboard: true,
    useFullCoords: true,
    hideOutsideDots: false,
    hasWrapper: true,
    externalState: null,
    initialState: { currentPlayer: 'BLUE', winner: null },
    getStatusText: (state, isPlaying) => {
      if (!isPlaying) return '';
      if (state.winner === 'DRAW') return '- HÒA!';
      if (state.winner === 'BLUE') return '- XANH THẮNG!';
      if (state.winner === 'RED') return '- ĐỎ THẮNG!';
      return `- Lượt ${state.currentPlayer === 'BLUE' ? 'XANH' : 'ĐỎ'}`;
    },
  },
  TICTACTOE: {
    name: 'Tic Tac Toe',
    slug: 'tic-tac-toe',
    refKey: 'ticTacToe',
    fullboard: false,
    useFullCoords: false,
    hideOutsideDots: true,
    hasWrapper: true,
    externalState: null,
    initialState: { currentPlayer: 'X', winner: null },
    getStatusText: (state, isPlaying) => {
      if (!isPlaying) return '';
      if (state.winner === 'DRAW') return '- DRAW!';
      if (state.winner) return `- ${state.winner} WINS!`;
      return `- ${state.currentPlayer}'s turn`;
    },
  },
  MATCH3: {
    name: 'Candy Rush',
    slug: 'match-3',
    refKey: 'match3',
    fullboard: false,
    useFullCoords: false,
    hideOutsideDots: true,
    hasWrapper: true,
    externalState: null,
    initialState: { score: 0, timeLeft: 60, isGameOver: false },
    getStatusText: (state, isPlaying) => {
      if (!isPlaying) return '';
      if (state.isGameOver) return '- TIME UP!';
      return '- Playing';
    },
  },
  MEMORY: {
    name: 'Memory Card',
    slug: 'memory-card',
    refKey: null,
    fullboard: false,
    useFullCoords: false,
    hideOutsideDots: true,
    hasWrapper: false,
    externalState: 'activeGameState',
    initialState: { score: 0 },
    getStatusText: (state, isPlaying) => isPlaying ? '(PLAYING)' : '',
  },
};

// Danh sách tên screens (dùng cho navigation)
export const GAME_SCREENS = Object.keys(GAME_REGISTRY);

// Danh sách games dùng fullboard
export const FULLBOARD_GAMES = Object.entries(GAME_REGISTRY)
  .filter(([, config]) => config.fullboard)
  .map(([key]) => key);

// Danh sách games cần ẩn dots ngoài vùng chơi
export const HIDE_OUTSIDE_DOTS_GAMES = Object.entries(GAME_REGISTRY)
  .filter(([, config]) => config.hideOutsideDots)
  .map(([key]) => key);

// Helper: Lấy config của game
export const getGameConfig = (screen) => GAME_REGISTRY[screen] || null;

// Helper: Kiểm tra game có dùng fullboard không
export const isFullboardGame = (screen) => GAME_REGISTRY[screen]?.fullboard || false;

// Helper: Kiểm tra game có wrapper không
export const hasGameWrapper = (screen) => GAME_REGISTRY[screen]?.hasWrapper || false;

// Helper: Lấy refKey của game
export const getGameRefKey = (screen) => GAME_REGISTRY[screen]?.refKey || null;
