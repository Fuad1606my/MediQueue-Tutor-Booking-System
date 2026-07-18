const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = process.env.DB_URI;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("🎯 Successfully connected to MongoDB Atlas!");

    // ============================================================
    // আপনার সব API রাউট বা কুয়েরি (CRUD) এর নিচে লিখতে হবে
    // ============================================================
    

  } finally {
    // এখানে আমরা client.close() করব না, কারণ সার্ভার সবসময় রানিং থাকবে
  }
}
run().catch(console.dir);

// Root API
app.get('/', (req, res) => {
  res.send('MediQueue Booking System Server is Running');
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is listening on port: ${port}`);
});