export async function seed(knex) {
  await knex("games").del();

  await knex("games").insert([
    {
      name: "Tic Tac Toe",
      slug: "tic-tac-toe",
      board_size: 3,
      enabled: true
    },
    {
      name: "Caro 4x4",
      slug: "caro-4",
      board_size: 4,
      enabled: true
    },
    {
      name: "Caro 5x5",
      slug: "caro-5",
      board_size: 5,
      enabled: true
    },
    {
      name: "Candy Rush",
      slug: "match-3",
      board_size: 8,
      enabled: true
    },
    {
      name: "Snake",
      slug: "snake",
      board_size: 20,
      enabled: true
    },
    {
      name: "Memory Card",
      slug: "memory-card",
      board_size: 4,
      enabled: true
    },
    {
      name: "Free Draw",
      slug: "free-draw",
      board_size: 16,
      enabled: true
    }
  ]);
}
