export async function seed(knex) {
  await knex("achievements").del();

  await knex("achievements").insert([
    {
      code: "FIRST_PLAY_TIC_TAC_TOE",
      name: "First Tic Tac Toe",
      description: "Play Tic Tac Toe for the first time",
      icon: "tic-tac-toe",
      enabled: true
    },
    {
      code: "FIRST_PLAY_CARO_4",
      name: "First Caro 4x4",
      description: "Play Caro 4x4 for the first time",
      icon: "caro-4",
      enabled: true
    },
    {
      code: "FIRST_PLAY_CARO_5",
      name: "First Caro 5x5",
      description: "Play Caro 5x5 for the first time",
      icon: "caro-5",
      enabled: true
    },
    {
      code: "FIRST_PLAY_MATCH_3",
      name: "First Candy Rush",
      description: "Play Candy Rush for the first time",
      icon: "match-3",
      enabled: true
    },
    {
      code: "FIRST_PLAY_SNAKE",
      name: "First Snake",
      description: "Play Snake for the first time",
      icon: "snake",
      enabled: true
    },
    {
      code: "FIRST_PLAY_MEMORY_CARD",
      name: "First Memory Card",
      description: "Play Memory Card for the first time",
      icon: "memory-card",
      enabled: true
    },
    {
      code: "FIRST_PLAY_FREE_DRAW",
      name: "First Free Draw",
      description: "Play Free Draw for the first time",
      icon: "free-draw",
      enabled: true
    }
  ]);
}
