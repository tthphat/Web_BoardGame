export async function seed(knex) {
  await knex("game_sessions").del();

  const phat = await knex("users")
    .where({ username: "truong thanh phat" })
    .first();

  const quan = await knex("users")
    .where({ username: "bui minh quan" })
    .first();

  const ticTacToe = await knex("games")
    .where({ slug: "tic-tac-toe" })
    .first();

  const caro5 = await knex("games")
    .where({ slug: "caro-5" })
    .first();

  await knex("game_sessions").insert([
    {
      id: knex.raw("gen_random_uuid()"),
      user_id: phat.id,
      game_id: ticTacToe.id,
      state: JSON.stringify({
        board: ["X", "", "O", "", "X", "", "", "", "O"],
        turn: "X",
        moves: 5
      }),
      score: 10,
      status: "playing"
    },
    {
      id: knex.raw("gen_random_uuid()"),
      user_id: quan.id,
      game_id: caro5.id,
      state: JSON.stringify({
        board: Array(25).fill("").map((v, i) =>
          i === 12 ? "X" : ""
        ),
        turn: "O",
        moves: 1
      }),
      score: 20,
      status: "finished"
    }
  ]);
}
