export async function seed(knex) {
  // await knex("board_configs").del(); // Removed to avoid FK violation

  await knex("board_configs").insert([
    {
      code: "MEDIUM",
      cols: 13,
      rows: 13,
      dot_size: 27,
      gap: 8
    },
    {
      code: "LARGE",
      cols: 21,
      rows: 15,
      dot_size: 24,
      gap: 6,
      is_active: false,
    },
    {
      code: "EXTRA_LARGE",
      cols: 30,
      rows: 18,
      dot_size: 19,
      gap: 6,
      is_active: false,
    }
  ]).onConflict("code").merge();
}