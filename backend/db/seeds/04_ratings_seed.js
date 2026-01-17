export async function seed(knex) {
  await knex("ratings").del();

  const phat = await knex("users")
    .where({ username: "truong thanh phat" })
    .first();

  const quan = await knex("users")
    .where({ username: "bui minh quan" })
    .first();

  const phuc = await knex("users")
    .where({ username: "buu huynh vinh phuc" })
    .first();

  const ticTacToe = await knex("games")
    .where({ slug: "tic-tac-toe" })
    .first();

  const caro5 = await knex("games")
    .where({ slug: "caro-5" })
    .first();

  await knex("ratings").insert([
    {
      id: knex.raw("gen_random_uuid()"),
      user_id: phat.id,
      game_id: ticTacToe.id,
      rating: 5,
      comment: "Game đơn giản, dễ chơi và rất vui."
    },
    {
      id: knex.raw("gen_random_uuid()"),
      user_id: quan.id,
      game_id: caro5.id,
      rating: 4,
      comment: "Caro 5x5 cần chiến thuật, chơi khá cuốn."
    },
    {
      id: knex.raw("gen_random_uuid()"),
      user_id: phuc.id,
      game_id: ticTacToe.id,
      rating: 5,
      comment: "Phù hợp chơi nhanh, giao diện rõ ràng."
    }
  ]);
}
