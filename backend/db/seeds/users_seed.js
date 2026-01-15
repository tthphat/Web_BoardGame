import bcrypt from "bcrypt";

export async function seed(knex) {
  await knex("users").del();

  const passwordHash = await bcrypt.hash("123456", 10);

  await knex("users").insert([
    {
      id: knex.raw("gen_random_uuid()"),
      username: "admin",
      email: "admin@gmail.com",
      password: passwordHash,
      role: "admin"
    },
    {
      id: knex.raw("gen_random_uuid()"),
      username: "truong thanh phat",
      email: "phat@gmail.com",
      password: passwordHash,
      role: "user"
    },
    {
      id: knex.raw("gen_random_uuid()"),
      username: "bui minh quan",
      email: "quan@gmail.com",
      password: passwordHash,
      role: "user"
    },
    {
      id: knex.raw("gen_random_uuid()"),
      username: "buu huynh vinh phuc",
      email: "phuc@gmail.com",
      password: passwordHash,
      role: "user"
    },
    {
      id: knex.raw("gen_random_uuid()"),
      username: "thai thien phu",
      email: "phu@gmail.com",
      password: passwordHash,
      role: "user"
    }
  ]);
}
