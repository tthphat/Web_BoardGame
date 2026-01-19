import knex from "../../db/db.js";

export const UserModel = {

    // Find user by email
    async findUserByEmail(email) {
        try {
            const user = await knex("users")
                .where({ email })
                .first();

            return { data: user, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Create user
    async createUser(data) {
        try {
            const [user] = await knex("users")
                .insert(data)
                .returning(["id", "email", "username", "role"]);

            return { data: user, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Delete user
    async deleteUser(id) {
        try {
            const user = await knex("users")
                .where({ id })
                .del();

            return { data: user, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Update user
    async updateUser(id, data) {
        try {
            const user = await knex("users")
                .where({ id })
                .update(data);

            return { data: user, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Find user by id
    async findUserById(id) {
        try {
            const user = await knex("users")
                .where({ id })
                .first();

            return { data: user, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Get all users with pagination, search, and achievement count
    async getAllUsers(offset, limit, search) {
        try {
            const query = knex("users")
                .select(
                    "users.id",
                    "users.username",
                    "users.email",
                    "users.role",
                    "users.state",
                    "users.created_at",
                    "users.updated_at"
                )
                .count("user_achievements.id as achievement_count")
                .leftJoin("user_achievements", "users.id", "user_achievements.user_id")
                .where((qb) => {
                    qb.where("users.username", "ilike", `%${search}%`)
                        .orWhere("users.email", "ilike", `%${search}%`);
                })
                .andWhere("users.role", "!=", "admin")
                .groupBy("users.id")
                .orderBy("users.created_at", "desc")
                .limit(limit)
                .offset(offset);

            const users = await query;
            return { data: users, error: null };
        } catch (error) {
            console.error("Error in getAllUsers:", error);
            return { data: null, error };
        }
    },

    // Count users
    async countUsers(search) {
        try {
            const count = await knex("users")
                .where((qb) => {
                    qb.where("username", "ilike", `%${search}%`)
                        .orWhere("email", "ilike", `%${search}%`);
                })
                .andWhere("role", "!=", "admin")
                .count("id");

            return { data: count[0].count, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },


    // Get all users friend
    async getAllUsersFriend(currentUserId, offset, limit, search = "") {
        try {
            const users = await knex("users as u")
                .leftJoin("friends as f", function () {
                    this.on(function () {
                        this.on("f.sender_id", "=", knex.raw("?", [currentUserId]))
                            .andOn("f.receiver_id", "=", "u.id");
                    }).orOn(function () {
                        this.on("f.receiver_id", "=", knex.raw("?", [currentUserId]))
                            .andOn("f.sender_id", "=", "u.id");
                    });
                })
                .where("u.state", "active")
                .andWhere("u.role", "!=", "admin")
                .andWhere("u.id", "!=", currentUserId)
                .andWhere((qb) => {
                    qb.where("u.username", "ilike", `%${search}%`)
                        .orWhere("u.email", "ilike", `%${search}%`);
                })
                .select(
                    "u.id",
                    "u.username",
                    "u.email",
                    "u.role",
                    "u.created_at",
                    "f.status as friend_status",
                    knex.raw(`
                CASE
                    WHEN f.status IS NULL THEN 'none'
                    WHEN f.status = 'pending' AND f.sender_id = ? THEN 'sent'
                    WHEN f.status = 'pending' AND f.receiver_id = ? THEN 'received'
                    WHEN f.status = 'accepted' THEN 'friend'
                END as friend_state
                `, [currentUserId, currentUserId])
                )
                .offset(offset)
                .limit(limit);

            return { data: users, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Count users friend
    async countUsersFriend(currentUserId, search = "") {
        try {
            const count = await knex("users as u")
                .leftJoin("friends as f", function () {
                    this.on(function () {
                        this.on("f.sender_id", "=", knex.raw("?", [currentUserId]))
                            .andOn("f.receiver_id", "=", "u.id");
                    }).orOn(function () {
                        this.on("f.receiver_id", "=", knex.raw("?", [currentUserId]))
                            .andOn("f.sender_id", "=", "u.id");
                    });
                })
                .where("u.state", "active")
                .andWhere("u.role", "!=", "admin")
                .andWhere("u.id", "!=", currentUserId)
                .andWhere((qb) => {
                    qb.where("u.username", "ilike", `%${search}%`)
                        .orWhere("u.email", "ilike", `%${search}%`);
                })
                .countDistinct("u.id as count");

            return { data: Number(count[0].count), error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Get friend requests
    async getFriendRequests(userId, offset, limit, search = "") {
        try {
            const query = knex("friends as f")
                .join("users as u", "u.id", "f.sender_id") // user_id = người gửi
                .where("f.receiver_id", userId)            // user hiện tại là người nhận
                .andWhere("f.status", "pending");

            if (search) {
                query.andWhere((qb) => {
                    qb.where("u.username", "ilike", `%${search}%`)
                        .orWhere("u.email", "ilike", `%${search}%`);
                });
            }

            const friendRequests = await query
                .select(
                    "f.sender_id",
                    "f.receiver_id",
                    "f.status",
                    "f.created_at",
                    "u.username",
                    "u.email"
                )
                .orderBy("f.created_at", "desc") // sort theo mới nhất
                .offset(offset)
                .limit(limit);

            return { data: friendRequests, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Count friend requests
    async countFriendRequests(userId, search = "") {
        try {
            const query = knex("friends as f")
                .join("users as u", "u.id", "f.sender_id") // user_id = người gửi
                .where("f.receiver_id", userId)            // người nhận
                .andWhere("f.status", "pending");

            if (search) {
                query.andWhere((qb) => {
                    qb.where("u.username", "ilike", `%${search}%`)
                        .orWhere("u.email", "ilike", `%${search}%`);
                });
            }

            const count = await query.count("f.sender_id as count");

            return { data: Number(count[0].count), error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Get my friends
    async getMyFriends(userId, offset, limit, search = "") {
        try {
            const query = knex("friends as f")
                .join("users as u", function () {
                    this.on("u.id", "=", "f.sender_id")
                        .orOn("u.id", "=", "f.receiver_id");
                })
                .where("f.status", "accepted")
                .andWhere(function () {
                    this.where("f.sender_id", userId)
                        .orWhere("f.receiver_id", userId);
                })
                .andWhere("u.id", "!=", userId); // loại chính mình

            if (search) {
                query.andWhere((qb) => {
                    qb.where("u.username", "ilike", `%${search}%`)
                        .orWhere("u.email", "ilike", `%${search}%`);
                });
            }

            const myFriends = await query
                .select(
                    "u.id as friend_id",
                    "u.username",
                    "u.email",
                    "f.accepted_at"
                )
                .orderBy("f.accepted_at", "desc")
                .offset(offset)
                .limit(limit);

            return { data: myFriends, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Count my friends
    async countMyFriends(userId, search = "") {
        try {
            const query = knex("friends as f")
                .join("users as u", function () {
                    this.on("u.id", "=", "f.sender_id")
                        .orOn("u.id", "=", "f.receiver_id");
                })
                .where("f.status", "accepted")
                .andWhere(function () {
                    this.where("f.sender_id", userId)
                        .orWhere("f.receiver_id", userId);
                })
                .andWhere("u.id", "!=", userId); // loại chính mình

            if (search) {
                query.andWhere((qb) => {
                    qb.where("u.username", "ilike", `%${search}%`)
                        .orWhere("u.email", "ilike", `%${search}%`);
                });
            }

            const count = await query.count("u.id as count");

            return { data: Number(count[0].count), error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Add friend
    async addFriend(sender_id, receiver_id) {
        try {
            await knex("friends")
                .insert({
                    sender_id: sender_id,
                    receiver_id: receiver_id,
                    status: "pending"
                })

            return { error: null };
        } catch (error) {
            return { error };
        }
    },

    // Check existed friend request
    async checkExistedFriendRequest(sender_id, receiver_id) {
        try {
            const existed = await knex("friends")
                .where(function () {
                    this.where("sender_id", sender_id)
                        .andWhere("receiver_id", receiver_id);
                })
                .orWhere(function () {
                    this.where("sender_id", receiver_id)
                        .andWhere("receiver_id", sender_id);
                })
                .first();

            return { data: existed, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Accept friend
    async acceptFriend(receiver_id, sender_id) {
        try {
            await knex("friends")
                .where({ receiver_id: receiver_id, sender_id: sender_id })
                .update({ status: "accepted", accepted_at: new Date() })

            return { error: null };
        } catch (error) {
            return { error };
        }
    },

    // Reject friend
    async rejectFriend(receiver_id, sender_id) {
        try {
            await knex("friends")
                .where({ receiver_id: receiver_id, sender_id: sender_id })
                .delete();

            return { error: null };
        } catch (error) {
            return { error };
        }
    },

    // Remove friend
    async removeFriend(current_id, friend_id) {
        try {
            await knex("friends")
                .where({ receiver_id: friend_id, sender_id: current_id })
                .orWhere({ receiver_id: current_id, sender_id: friend_id })
                .delete();

            return { error: null };
        } catch (error) {
            return { error };
        }
    },

    // Get All My Conversations
    async getAllMyConversations(currentUserId, offset, limit, search = "") {
        try {
            const query = knex("conversation_members as cm")
                .join("conversation_members as cm2", "cm2.conversation_id", "cm.conversation_id")
                .join("users as partner", "partner.id", "cm2.user_id")
                .join("conversations as c", "c.id", "cm.conversation_id")
                .leftJoin(
                    knex.raw(`
                    LATERAL (
                        SELECT 
                        m.content,
                        m.created_at,
                        m.sender_id,
                        su.username AS sender_name
                        FROM messages m
                        JOIN users su ON su.id = m.sender_id
                        WHERE m.conversation_id = c.id
                        ORDER BY m.created_at DESC
                        LIMIT 1
                    ) lm ON true
                    `)
                )
                .where("cm.user_id", currentUserId)
                .andWhere("cm2.user_id", "!=", currentUserId);

            if (search) {
                query.andWhere((qb) => {
                    qb.where("partner.username", "ilike", `%${search}%`)
                        .orWhere("partner.email", "ilike", `%${search}%`);
                });
            }

            const conversations = await query
                .select(
                    "c.id as conversation_id",
                    "partner.id as partner_id",
                    "partner.username as partner_name",
                    "partner.email as partner_email",
                    "lm.content as last_message",
                    "lm.created_at as last_message_at",
                    "lm.sender_id as last_message_sender_id",
                    "lm.sender_name as last_message_sender_name"
                )
                .orderBy("lm.created_at", "desc")
                .offset(offset)
                .limit(limit);

            return { data: conversations, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Count Conversations
    async countConversations(currentUserId, search = "") {
        try {
            const query = knex("conversation_members as cm")
                .join("conversation_members as cm2", "cm2.conversation_id", "cm.conversation_id")
                .join("users as u", "u.id", "cm2.user_id")
                .where("cm.user_id", currentUserId)   // tôi là member
                .andWhere("cm2.user_id", "!=", currentUserId); // người còn lại

            if (search) {
                query.andWhere((qb) => {
                    qb.where("u.username", "ilike", `%${search}%`)
                        .orWhere("u.email", "ilike", `%${search}%`);
                });
            }

            const count = await query
                .countDistinct("cm.conversation_id as count");

            return { data: Number(count[0].count), error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Get Messages
    async getMessages(conversation_id, offset, limit, user_id) {
        try {
            const isMember = await knex("conversation_members")
                .where({ conversation_id: conversation_id, user_id: user_id })
                .first();

            if (!isMember) {
                throw new Error("Forbidden");
            }

            const messages = await knex("messages as m")
                .join("users as u", "u.id", "m.sender_id")
                .where("m.conversation_id", conversation_id)
                .select(
                    "m.id",
                    "m.sender_id",
                    "u.username as sender_name",
                    "m.content",
                    "m.created_at"
                )
                .orderBy("m.created_at", "desc")
                .offset(offset)
                .limit(limit);

            return { data: messages, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Get Partner
    async getPartner(conversation_id, user_id) {
        try {
            const partner = await knex("conversation_members as cm")
                .join("users as u", "u.id", "cm.user_id")
                .where("cm.conversation_id", conversation_id)
                .andWhere("cm.user_id", "!=", user_id)
                .select(
                    "u.id",
                    "u.username",
                    "u.email",
                    "u.role",
                    "u.created_at",
                    "u.updated_at"
                )
                .first();

            return { data: partner, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Send Message
    async sendMessage(conversation_id, content, current_id) {
        try {
            const [message] = await knex("messages")
                .insert({
                    conversation_id,
                    sender_id: current_id,
                    content,
                    created_at: new Date()
                })
                .returning(["id", "conversation_id", "sender_id", "content", "created_at"]);

            return { data: message, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Search user phải là bạn bè
    async searchUsers(search, current_id) {
        try {
            const users = await knex("friends as f")
                .join("users as u", function () {
                    this.on("u.id", "=", "f.sender_id")
                        .orOn("u.id", "=", "f.receiver_id");
                })
                .where("f.status", "accepted")
                .andWhere((qb) => {
                    qb.where("f.sender_id", current_id)
                        .orWhere("f.receiver_id", current_id);
                })
                .andWhere("u.id", "!=", current_id)
                .andWhere((qb) => {
                    qb.where("u.username", "ilike", `%${search}%`)
                        .orWhere("u.email", "ilike", `%${search}%`);
                })
                .select(
                    "u.id",
                    "u.username",
                    "u.email",
                    "u.created_at"
                )
                .limit(10);

            return { data: users, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Get User
    async getUser(id) {
        try {
            const user = await knex("users")
                .where({ id })
                .first();

            return { data: user, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Create new conversation
    async createNewConversation(friend_id, current_id) {
        try {
            const trx = await knex.transaction();

            // Create conversation
            const [conversation] = await trx("conversations")
                .insert({
                    created_at: new Date()
                })
                .returning(["id", "created_at"]);

            // Add members
            await trx("conversation_members").insert([
                {
                    conversation_id: conversation.id,
                    user_id: current_id,
                    joined_at: new Date()
                },
                {
                    conversation_id: conversation.id,
                    user_id: friend_id,
                    joined_at: new Date()
                }
            ]);

            await trx.commit();

            return { data: conversation, error: null };
        } catch (error) {
            await trx.rollback();
            return { data: null, error };
        }
    },

    // check exist conversation
    async checkExistConversation(friend_id, current_id) {
        try {
            const conversation = await knex("conversation_members as cm")
                .join("conversation_members as cm2", "cm2.conversation_id", "cm.conversation_id")
                .where("cm.user_id", current_id)
                .andWhere("cm2.user_id", friend_id)
                .select("cm.conversation_id")
                .first();

            return { data: conversation, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },
}

