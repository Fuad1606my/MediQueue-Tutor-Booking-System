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

    console.log("📁 Database Collections initialized successfully!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}
run().catch(console.dir);

// Auth Sign Up
app.post('/users/signup', async (req, res) => {
  try {
    const user = req.body;
    const existingUser = await usersCollection.findOne({ email: user.email });
    if (existingUser) {
      return res.status(400).send({ message: "This email is already registered!" });
    }
    const result = await usersCollection.insertOne(user);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error during Signup" });
  }
});

// Auth Sign In
app.post('/users/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersCollection.findOne({ email, password });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password parameters." });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error during Signin" });
  }
});

app.put('/users/profile', async (req, res) => {
  try {
    const { email, name, address, contact, image, hourlyPay, courseType } = req.body;
    const filter = { email };
    const updateDoc = {
      $set: { name, address, contact, image, hourlyPay, courseType }
    };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Profile update failed" });
  }
});

// Tutors APIs
app.post('/tutors', async (req, res) => {
  try {
    const newTutor = req.body;
    const result = await tutorsCollection.insertOne(newTutor);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add tutor" });
  }
});

app.get('/tutors', async (req, res) => {
  try {
    const email = req.query.email;
    let query = {};
    if (email) {
      query = { email: email };
    }
    const cursor = tutorsCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch tutors" });
  }
});

app.put('/tutors/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedTutor = req.body;
    const updateDoc = {
      $set: {
        name: updatedTutor.name,
        email: updatedTutor.email,
        language: updatedTutor.language,
        price: parseFloat(updatedTutor.price),
        currency: updatedTutor.currency,
        feeType: updatedTutor.feeType,
        description: updatedTutor.description,
        image: updatedTutor.image
      },
    };
    const result = await tutorsCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update tutor" });
  }
});

app.delete('/tutors/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await tutorsCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete tutor" });
  }
});

// Bookings APIs
app.post('/bookings', async (req, res) => {
  try {
    const bookingData = req.body;
    const result = await bookingsCollection.insertOne(bookingData);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Booking failed" });
  }
});

app.get('/bookings', async (req, res) => {
  try {
    const email = req.query.email;
    let query = {};
    if (email) {
      query = { studentEmail: email };
    }
    const cursor = bookingsCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch bookings" });
  }
});

app.delete('/bookings/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await bookingsCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete booking" });
  }
});

app.get('/', (req, res) => {
  res.send('MediQueue Booking System Server is Running');
});

app.listen(port, () => {
  console.log(`🚀 Server is listening on port: ${port}`);
});