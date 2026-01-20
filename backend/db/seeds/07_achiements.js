export async function seed(knex) {
  // 1. Get all games to map slug -> id
  const games = await knex("games").select("id", "slug");
  const gameMap = games.reduce((acc, game) => {
    acc[game.slug] = game.id;
    return acc;
  }, {});

  // 2. Clear existing achievements
  await knex("achievements").del();

  // 3. Define achievements with their corresponding game slug
  const achievements = [
    {
      gameSlug: "tic-tac-toe",
      code: "FIRST_PLAY_TIC_TAC_TOE",
      name: "First Tic Tac Toe",
      description: "Play Tic Tac Toe for the first time",
      icon: "tic-tac-toe",
      enabled: true
    },
    {
      gameSlug: "tic-tac-toe",
      code: "PLAY_3_GAMES_TIC_TAC_TOE",
      name: "Tic Tac Toe Amateur",
      description: "Play Tic Tac Toe 3 times",
      icon: "tic-tac-toe",
      enabled: true
    },
    {
      gameSlug: "tic-tac-toe",
      code: "PLAY_5_GAMES_TIC_TAC_TOE",
      name: "Tic Tac Toe Enthusiast",
      description: "Play Tic Tac Toe 5 times",
      icon: "tic-tac-toe",
      enabled: true
    },
    {
      gameSlug: "caro-4",
      code: "FIRST_PLAY_CARO_4",
      name: "First Caro 4x4",
      description: "Play Caro 4x4 for the first time",
      icon: "caro-4",
      enabled: true
    },
    {
      gameSlug: "caro-4",
      code: "PLAY_3_GAMES_CARO_4",
      name: "Caro 4x4 Amateur",
      description: "Play Caro 4x4 3 times",
      icon: "caro-4",
      enabled: true
    },
    {
      gameSlug: "caro-4",
      code: "PLAY_5_GAMES_CARO_4",
      name: "Caro 4x4 Enthusiast",
      description: "Play Caro 4x4 5 times",
      icon: "caro-4",
      enabled: true
    },
    {
      gameSlug: "caro-5",
      code: "FIRST_PLAY_CARO_5",
      name: "First Caro 5x5",
      description: "Play Caro 5x5 for the first time",
      icon: "caro-5",
      enabled: true
    },
    {
      gameSlug: "caro-5",
      code: "PLAY_3_GAMES_CARO_5",
      name: "Caro 5x5 Amateur",
      description: "Play Caro 5x5 3 times",
      icon: "caro-5",
      enabled: true
    },
    {
      gameSlug: "caro-5",
      code: "PLAY_5_GAMES_CARO_5",
      name: "Caro 5x5 Enthusiast",
      description: "Play Caro 5x5 5 times",
      icon: "caro-5",
      enabled: true
    },
    {
      gameSlug: "match-3",
      code: "FIRST_PLAY_MATCH_3",
      name: "First Candy Rush",
      description: "Play Candy Rush for the first time",
      icon: "match-3",
      enabled: true
    },
    {
      gameSlug: "match-3",
      code: "PLAY_3_GAMES_MATCH_3",
      name: "Candy Rush Amateur",
      description: "Play Candy Rush 3 times",
      icon: "match-3",
      enabled: true
    },
    {
      gameSlug: "match-3",
      code: "PLAY_5_GAMES_MATCH_3",
      name: "Candy Rush Enthusiast",
      description: "Play Candy Rush 5 times",
      icon: "match-3",
      enabled: true
    },
    {
      gameSlug: "snake",
      code: "FIRST_PLAY_SNAKE",
      name: "First Snake",
      description: "Play Snake for the first time",
      icon: "snake",
      enabled: true
    },
    {
      gameSlug: "snake",
      code: "PLAY_3_GAMES_SNAKE",
      name: "Snake Amateur",
      description: "Play Snake 3 times",
      icon: "snake",
      enabled: true
    },
    {
      gameSlug: "snake",
      code: "PLAY_5_GAMES_SNAKE",
      name: "Snake Enthusiast",
      description: "Play Snake 5 times",
      icon: "snake",
      enabled: true
    },
    {
      gameSlug: "memory-card",
      code: "FIRST_PLAY_MEMORY_CARD",
      name: "First Memory Card",
      description: "Play Memory Card for the first time",
      icon: "memory-card",
      enabled: true
    },
    {
      gameSlug: "memory-card",
      code: "PLAY_3_GAMES_MEMORY_CARD",
      name: "Memory Card Amateur",
      description: "Play Memory Card 3 times",
      icon: "memory-card",
      enabled: true
    },
    {
      gameSlug: "memory-card",
      code: "PLAY_5_GAMES_MEMORY_CARD",
      name: "Memory Card Enthusiast",
      description: "Play Memory Card 5 times",
      icon: "memory-card",
      enabled: true
    },
  ];

  // 4. Map gameSlug to game_id and insert
  const achievementsToInsert = achievements
    .filter(a => gameMap[a.gameSlug]) // Ensure game exists
    .map(a => ({
      game_id: gameMap[a.gameSlug],
      code: a.code,
      name: a.name,
      description: a.description,
      icon: a.icon,
      enabled: a.enabled
    }));

  if (achievementsToInsert.length > 0) {
    await knex("achievements").insert(achievementsToInsert);
  }
}
