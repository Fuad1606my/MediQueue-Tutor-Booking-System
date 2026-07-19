const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let tutorsCollection;
let bookingsCollection;
let usersCollection;

async function run() {
  try {
    await client.connect();
    const database = client.db("mediQueueDB");
    tutorsCollection = database.collection("tutors");
    bookingsCollection = database.collection("bookings");
    usersCollection = database.collection("users");
    console.log("📁 Database Connections initialized successfully!");
  } catch (error) {
    console.error(error);
  }
}
run().catch(console.dir);

// Auth APIs
app.post('/users/signup', async (req, res) => {
  try {
    const user = req.body;
    const existingUser = await usersCollection.findOne({ email: user.email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already exists" });
    }
    const result = await usersCollection.insertOne(user);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Signup failed" });
  }
});

app.post('/users/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersCollection.findOne({ email, password });
    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Signin failed" });
  }
});

app.put('/users/profile', async (req, res) => {
  try {
    const { email, name, address, contact, image, gender, hourlyPay, courseType } = req.body;
    const result = await usersCollection.updateOne(
      { email },
      { $set: { name, address, contact, image, gender, hourlyPay, courseType } }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Profile update failed" });
  }
});

// Subjects/Tutors Management
app.post('/tutors', async (req, res) => {
  try {
    const result = await tutorsCollection.insertOne(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add" });
  }
});

app.get('/tutors', async (req, res) => {
  try {
    const email = req.query.email;
    let query = {};
    if (email) query = { email };
    const result = await tutorsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch" });
  }
});

app.put('/tutors/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = req.body;
    const result = await tutorsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name: updated.name, email: updated.email, language: updated.language, price: parseFloat(updated.price), currency: updated.currency, feeType: updated.feeType, description: updated.description, image: updated.image, timeSlot: updated.timeSlot } }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Update failed" });
  }
});

app.delete('/tutors/:id', async (req, res) => {
  try {
    const result = await tutorsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Delete failed" });
  }
});

// Bookings APIs
app.post('/bookings', async (req, res) => {
  try {
    const result = await bookingsCollection.insertOne(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Booking failed" });
  }
});

app.get('/bookings', async (req, res) => {
  try {
    const { studentEmail, tutorEmail } = req.query;
    let query = {};
    if (studentEmail) query = { studentEmail };
    if (tutorEmail) query = { tutorEmail };
    const result = await bookingsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Fetch bookings failed" });
  }
});

app.patch('/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status } }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Status update failed" });
  }
});

app.delete('/bookings/:id', async (req, res) => {
  try {
    const result = await bookingsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Delete booking failed" });
  }
});

app.listen(port, () => console.log(`🚀 Server is listening on port: ${port}`));