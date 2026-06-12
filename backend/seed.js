import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/users.js";
import Message from "./models/message.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectdb = async () => {
  try {
    const con = await mongoose.connect(process.env.mongo_db);
    console.log(`✅ MongoDB Connected: ${con.connection.host}`);
  } catch (error) {
    console.log(`❌ Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectdb();

    console.log("Clearing existing User and Message collections...");
    await User.deleteMany({});
    await Message.deleteMany({});

    console.log("Seeding Users...");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("password123", salt);

    const usersList = [
      {
        email: "alice@example.com",
        fullName: "Alice Engineer",
        password: passwordHash,
        profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      },
      {
        email: "bob@example.com",
        fullName: "Bob Product",
        password: passwordHash,
        profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      },
      {
        email: "charlie@example.com",
        fullName: "Charlie Design",
        password: passwordHash,
        profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
      },
    ];

    const insertedUsers = await User.insertMany(usersList);
    console.log(`✅ Seeded ${insertedUsers.length} users.`);

    const aliceId = insertedUsers[0]._id;
    const bobId = insertedUsers[1]._id;
    const charlieId = insertedUsers[2]._id;

    console.log("Seeding Messages...");

    const messagesList = [
      // Alice and Bob conversing about a project timeline
      { sender: aliceId, receiver: bobId, text: "Hey Bob, did you check the timeline for Project Phoenix?" },
      { sender: bobId, receiver: aliceId, text: "Yes, I did. Our deadline for Project Phoenix is October 24th, 2026." },
      { sender: aliceId, receiver: bobId, text: "And what about the designated budget?" },
      { sender: bobId, receiver: aliceId, text: "The total budget allocated is $15,000. Let me know if we need to request more." },

      // Bob and Charlie conversing about a frontend issue
      { sender: charlieId, receiver: bobId, text: "Bob, users are reporting a bug in the login modal." },
      { sender: bobId, receiver: charlieId, text: "Oh no, what kind of bug? Did you figure out a fix?" },
      { sender: charlieId, receiver: bobId, text: "Yes, the React 18.2 hook is failing. The fix is to update React from version 18.2 to 18.3." },
      { sender: bobId, receiver: charlieId, text: "Great job Charlie, please deploy that fix tonight at 2 AM." },

      // Alice and Charlie talking about AI features
      { sender: aliceId, receiver: charlieId, text: "Hey Charlie, the new AI RAG feature is almost ready." },
      { sender: charlieId, receiver: aliceId, text: "Awesome Alice! Which embedding model are we using?" },
      { sender: aliceId, receiver: charlieId, text: "We've decided to use the intfloat/multilingual-e5-large model for the RAG vectors." },
    ];

    const insertedMessages = await Message.insertMany(messagesList);
    console.log(`✅ Seeded ${insertedMessages.length} messages.`);

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();
