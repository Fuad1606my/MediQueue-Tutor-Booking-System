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

// Subjects Management
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
// --- Figma Tutors Auto-Seed API Endpoint (Fixed Variable Scope) ---
app.get('/seed-figma-tutors', async (req, res) => {
  try {
    const figmaTutors = [
      {
        name: "Dr. Sarah Mitchell",
        language: "Mathematics",
        price: 45,
        institution: "MIT",
        experience: "8 years",
        location: "Cambridge, MA",
        teachingMode: "Online",
        availableDays: "Mon – Fri",
        timeSlot: "4:00 PM – 8:00 PM",
        totalSlots: 8,
        reviews: 127,
        about: "PhD in Applied Mathematics from MIT. Specialises in calculus, linear algebra, and statistics.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500"
      },
      {
        name: "Prof. James Chen",
        language: "Physics",
        price: 50,
        institution: "Stanford University",
        experience: "12 years",
        location: "Palo Alto, CA",
        teachingMode: "Both",
        availableDays: "Tue – Sat",
        timeSlot: "5:00 PM – 9:00 PM",
        totalSlots: 6,
        reviews: 98,
        about: "Specializing in Quantum Physics and Thermodynamics with 12+ years of academic research.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500"
      },
      {
        name: "Ms. Aisha Rahman",
        language: "English Literature",
        price: 35,
        institution: "Oxford University",
        experience: "6 years",
        location: "Boston, MA",
        teachingMode: "Online",
        availableDays: "Mon – Thu",
        timeSlot: "3:00 PM – 7:00 PM",
        totalSlots: 10,
        reviews: 84,
        about: "Oxford graduate passionate about creative writing, essays, and classical literature analysis.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500"
      },
      {
        name: "Dr. Carlos Rivera",
        language: "Chemistry",
        price: 45,
        institution: "Caltech",
        experience: "9 years",
        location: "Pasadena, CA",
        teachingMode: "Both",
        availableDays: "Wed – Sun",
        timeSlot: "2:00 PM – 6:00 PM",
        totalSlots: 4,
        reviews: 112,
        about: "Organic Chemistry specialist providing simplified step-by-step problem-solving methods.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500"
      },
      {
        name: "Mr. Jhankar Mahbub",
        language: "Web Development",
        price: 40,
        institution: "Programming Hero",
        experience: "10 years",
        location: "Dhaka, BD",
        teachingMode: "Online",
        availableDays: "Mon – Fri",
        timeSlot: "6:00 PM – 10:00 PM",
        totalSlots: 12,
        reviews: 215,
        about: "Senior Web Developer teaching JavaScript, React, and Node.js in an engaging and fun way.",
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=500"
      },
      {
        name: "Dr. Priya Sharma",
        language: "Biology",
        price: 42,
        institution: "Johns Hopkins",
        experience: "7 years",
        location: "Baltimore, MD",
        teachingMode: "Both",
        availableDays: "Tue – Sat",
        timeSlot: "4:00 PM – 8:00 PM",
        totalSlots: 7,
        reviews: 91,
        about: "Biomedical researcher making Cell Biology and Genetics intuitive and easy to master.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=500"
      }
    ];

    // MongoClient এর সরাসরি কানেকশন ধরা হচ্ছে
    const targetCollection = client.db('mediqueue').collection('tutors');
    await targetCollection.deleteMany({});
    await targetCollection.insertMany(figmaTutors);

    res.json({ success: true, message: "Successfully replaced database with official Figma Tutors data!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(port, () => console.log(`🚀 Server is listening on port: ${port}`));