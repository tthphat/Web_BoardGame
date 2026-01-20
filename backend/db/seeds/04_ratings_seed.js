export async function seed(knex) {
  await knex("ratings").del();

  // Get Users
  const phat = await knex("users").where({ username: "truong thanh phat" }).first();
  const quan = await knex("users").where({ username: "bui minh quan" }).first();
  const phuc = await knex("users").where({ username: "buu huynh vinh phuc" }).first();

  // Get Games
  const ticTacToe = await knex("games").where({ slug: "tic-tac-toe" }).first();
  const caro5 = await knex("games").where({ slug: "caro-5" }).first();
  const snake = await knex("games").where({ slug: "snake" }).first();
  const match3 = await knex("games").where({ slug: "match-3" }).first();
  const memory = await knex("games").where({ slug: "memory-card" }).first();
  const caro4 = await knex("games").where({ slug: "caro-4" }).first();
  const drawing = await knex("games").where({ slug: "free-draw" }).first();

  const ratings = [];

  // Tic Tac Toe
  if (ticTacToe) {
    ratings.push(
      { id: knex.raw("gen_random_uuid()"), user_id: phat.id, game_id: ticTacToe.id, rating: 5, comment: "Game đơn giản, dễ chơi và rất vui." },
      { id: knex.raw("gen_random_uuid()"), user_id: phuc.id, game_id: ticTacToe.id, rating: 5, comment: "Phù hợp chơi nhanh, giao diện rõ ràng." }
    );
  }

  // Caro 5
  if (caro5) {
    ratings.push(
      { id: knex.raw("gen_random_uuid()"), user_id: quan.id, game_id: caro5.id, rating: 4, comment: "Caro 5x5 cần chiến thuật, chơi khá cuốn." }
    );
  }

  // Snake
  if (snake) {
    ratings.push(
      { id: knex.raw("gen_random_uuid()"), user_id: phat.id, game_id: snake.id, rating: 5, comment: "Rắn săn mồi huyền thoại! Càng dài càng khó." },
      { id: knex.raw("gen_random_uuid()"), user_id: quan.id, game_id: snake.id, rating: 4, comment: "Điều khiển hơi nhạy nhưng chơi vui." }
    );
  }

  // Match 3
  if (match3) {
    ratings.push(
      { id: knex.raw("gen_random_uuid()"), user_id: phuc.id, game_id: match3.id, rating: 5, comment: "Hiệu ứng đẹp, chơi giải trí tốt." }
    );
  }

  // Memory
  if (memory) {
    ratings.push(
      { id: knex.raw("gen_random_uuid()"), user_id: phat.id, game_id: memory.id, rating: 3, comment: "Hơi khó nhớ nhưng rèn luyện trí nhớ tốt." }
    );
  }

  // Caro 4
  if (caro4) {
    ratings.push(
      { id: knex.raw("gen_random_uuid()"), user_id: quan.id, game_id: caro4.id, rating: 5, comment: "Dễ hơn 5x5 một chút, phù hợp người mới." }
    );
  }

  // Drawing
  if (drawing) {
    ratings.push(
      { id: knex.raw("gen_random_uuid()"), user_id: phuc.id, game_id: drawing.id, rating: 5, comment: "Thỏa sức sáng tạo, rất thích!" }
    );
  }

  if (ratings.length > 0) {
    await knex("ratings").insert(ratings);
  }
}
