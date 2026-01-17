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
      gameSlug: "caro-4",
      code: "FIRST_PLAY_CARO_4",
      name: "First Caro 4x4",
      description: "Play Caro 4x4 for the first time",
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
      gameSlug: "match-3",
      code: "FIRST_PLAY_MATCH_3",
      name: "First Candy Rush",
      description: "Play Candy Rush for the first time",
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
      gameSlug: "memory-card",
      code: "FIRST_PLAY_MEMORY_CARD",
      name: "First Memory Card",
      description: "Play Memory Card for the first time",
      icon: "memory-card",
      enabled: true
    },
    {
      gameSlug: "free-draw",
      code: "FIRST_PLAY_FREE_DRAW",
      name: "First Free Draw",
      description: "Play Free Draw for the first time",
      icon: "free-draw",
      enabled: true
    }
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
