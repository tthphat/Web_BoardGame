export async function seed(knex) {
  await knex("friends").del();

  const phat = await knex("users")
    .where({ username: "truong thanh phat" })
    .first();

  const quan = await knex("users")
    .where({ username: "bui minh quan" })
    .first();

  const phuc = await knex("users")
    .where({ username: "buu huynh vinh phuc" })
    .first();

  const phu = await knex("users")
    .where({ username: "thai thien phu" })
    .first();

  // CHECK AN TOÀN
  if (!phat || !quan || !phuc || !phu) {
    throw new Error("Seed friends failed: user not found");
  }

  await knex("friends").insert([
    // Phát ↔ Quân (đã là bạn)
    {
      user_id: phat.id,
      friend_id: quan.id,
      status: "accepted"
    },
    {
      user_id: quan.id,
      friend_id: phat.id,
      status: "accepted"
    },

    // Phát → Phúc (đang chờ)
    {
      user_id: phat.id,
      friend_id: phuc.id,
      status: "pending"
    },

    // Phú ↔ Quân (đã là bạn)
    {
      user_id: phu.id,
      friend_id: quan.id,
      status: "accepted"
    },
    {
      user_id: quan.id,
      friend_id: phu.id,
      status: "accepted"
    }
  ]);
}
