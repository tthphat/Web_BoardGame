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
      sender_id: phat.id,
      receiver_id: quan.id,
      status: "accepted"
    },
    {
      sender_id: quan.id,
      receiver_id: phat.id,
      status: "accepted"
    },

    // Phát → Phúc (đang chờ)
    {
      sender_id: phat.id,
      receiver_id: phuc.id,
      status: "pending"
    },

    // Phú ↔ Quân (đã là bạn)
    {
      sender_id: phu.id,
      receiver_id: quan.id,
      status: "accepted"
    },
    {
      sender_id: quan.id,
      receiver_id: phu.id,
      status: "accepted"
    }
  ]);
}
