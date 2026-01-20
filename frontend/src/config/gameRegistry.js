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
    helpText: {
      title: 'Welcome',
      objective: 'Navigate through the game menu',
      controls: [
        '← → or A/D: Browse games',
        'Enter: Select and start game',
        'Back: Return to menu',
      ],
      tips: 'Use the control buttons below to navigate!',
    },
  },
  SNAKE: {
    name: 'Snake',
    slug: 'snake',
    refKey: 'snake',
    fullboard: true,
    useFullCoords: true,
    hideOutsideDots: false,
    hasWrapper: true,
    externalState: null,
    initialState: { score: 0, isGameOver: false },
    getStatusText: (state, isPlaying) => {
      if (!isPlaying) return '';
      if (state.isGameOver) return '- GAME OVER!';
      return `- Playing`;
    },
    helpText: {
      title: 'Snake',
      objective: 'Control the snake to eat food and grow longer',
      controls: [
        '↑↓←→ or WASD: Move the snake',
        'Avoid hitting walls and your own body',
      ],
      tips: 'The snake grows each time it eats! Plan your path carefully.',
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
    helpText: {
      title: 'Free Draw',
      objective: 'Express your creativity on the canvas',
      controls: [
        'Click/Drag: Draw pixels',
        'Color palette: Select colors',
        'Eraser: Remove pixels',
        'Clear: Reset canvas',
      ],
      tips: 'Hold and drag to draw continuously!',
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
      if (state.winner === 'DRAW') return '- DRAW!';
      if (state.winner === 'BLUE') return '- BLUE WINS!';
      if (state.winner === 'RED') return '- RED WINS!';
      return `- ${state.currentPlayer === 'BLUE' ? 'BLUE' : 'RED'}'s turn`;
    },
    helpText: {
      title: 'Caro 5x5',
      objective: 'Get 5 pieces in a row to win',
      controls: [
        'Click on empty cell: Place your piece',
        'Blue plays first, then Red',
      ],
      tips: 'Block your opponent while building your own line!',
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
      if (state.winner === 'DRAW') return '- DRAW!';
      if (state.winner === 'BLUE') return '- BLUE WINS!';
      if (state.winner === 'RED') return '- RED WINS!';
      return `- ${state.currentPlayer === 'BLUE' ? 'BLUE' : 'RED'}'s turn`;
    },
    helpText: {
      title: 'Caro 4x4',
      objective: 'Get 4 pieces in a row to win',
      controls: [
        'Click on empty cell: Place your piece',
        'Blue plays first, then Red',
      ],
      tips: 'Think ahead and watch for diagonal wins!',
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
    helpText: {
      title: 'Tic Tac Toe',
      objective: 'Get 3 in a row to win',
      controls: [
        'Click on empty cell: Place your mark (X or O)',
        'X plays first, then O',
      ],
      tips: 'Control the center and corners for the best chances!',
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
    helpText: {
      title: 'Candy Rush',
      objective: 'Match 3 or more same-colored gems to score',
      controls: [
        'Click 2 adjacent cells: Swap gems',
        'Match 3+ gems in a row or column',
      ],
      tips: 'Look for chain reactions to get bonus points!',
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
    helpText: {
      title: 'Memory Card',
      objective: 'Find and match all card pairs',
      controls: [
        'Click on card: Flip to reveal',
        'Match 2 cards with same symbol',
      ],
      tips: 'Remember the positions of flipped cards!',
    },
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
