const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
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
    console.error("Database connection error:", error);
  }
}
run().catch(console.dir);

// Root Health Check Route
app.get('/', (req, res) => {
  res.send('MediQueue Server is running smoothly!');
});

// ================= USER AUTH & PROFILE APIs ================= //
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

// ================= TUTORS MANAGEMENT APIs ================= //

// 1. Add New Tutor
app.post('/tutors', async (req, res) => {
  try {
    const tutorData = req.body;
    
    // Convert types properly
    if (tutorData.price) tutorData.price = parseFloat(tutorData.price);
    if (tutorData.totalSlots) tutorData.totalSlots = parseInt(tutorData.totalSlots);
    if (tutorData.sessionStartDate) tutorData.sessionStartDate = new Date(tutorData.sessionStartDate);
    if (tutorData.sessionEndDate) tutorData.sessionEndDate = new Date(tutorData.sessionEndDate);

    const result = await tutorsCollection.insertOne(tutorData);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add tutor" });
  }
});

// 2. Get Tutors (Search, Date Filter, Email Filter, Limit)
app.get('/tutors', async (req, res) => {
  try {
    const { email, search, startDate, endDate, limit } = req.query;
    let query = {};

    if (email) {
      query.email = email;
    }

    // Case-insensitive name/subject search ($regex)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { language: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    // Date range filtering ($gte and $lte)
    if (startDate || endDate) {
      query.sessionStartDate = {};
      if (startDate) {
        query.sessionStartDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.sessionStartDate.$lte = new Date(endDate);
      }
    }

    let cursor = tutorsCollection.find(query);
    if (limit) {
      cursor = cursor.limit(parseInt(limit));
    }

    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch tutors" });
  }
});

// 3. Get Single Tutor Details by ID
app.get('/tutors/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await tutorsCollection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      return res.status(404).send({ message: "Tutor not found" });
    }
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch tutor details" });
  }
});

// 4. Update Tutor Info
app.put('/tutors/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = req.body;

    const updateDoc = {
      $set: {
        name: updated.name,
        email: updated.email,
        language: updated.language,
        subject: updated.subject || updated.language,
        price: parseFloat(updated.price),
        currency: updated.currency || 'USD',
        feeType: updated.feeType || 'hourly',
        description: updated.description || updated.about,
        image: updated.image,
        timeSlot: updated.timeSlot,
        availableDays: updated.availableDays,
        totalSlots: parseInt(updated.totalSlots),
        sessionStartDate: updated.sessionStartDate ? new Date(updated.sessionStartDate) : null,
        sessionEndDate: updated.sessionEndDate ? new Date(updated.sessionEndDate) : null,
        institution: updated.institution,
        experience: updated.experience,
        location: updated.location,
        teachingMode: updated.teachingMode
      }
    };

    const result = await tutorsCollection.updateOne(
      { _id: new ObjectId(id) },
      updateDoc
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Update failed" });
  }
});

// 5. Delete Tutor
app.delete('/tutors/:id', async (req, res) => {
  try {
    const result = await tutorsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Delete failed" });
  }
});

// ================= BOOKINGS APIs ================= //

// 1. Create Booking (With Duplicate Check, Deadline & Slot Auto Decrement)
app.post('/bookings', async (req, res) => {
  try {
    const bookingData = req.body; 

    if (!bookingData.tutorId) {
      return res.status(400).send({ message: "Tutor ID is required" });
    }

    // Fetch Tutor
    const tutor = await tutorsCollection.findOne({ _id: new ObjectId(bookingData.tutorId) });
    if (!tutor) {
      return res.status(404).send({ message: "Tutor not found" });
    }

    // Restriction 1: Zero Slot Check
    const currentSlots = tutor.totalSlots ?? tutor.totalSlot ?? 0;
    if (currentSlots <= 0) {
      return res.status(400).send({ message: "No available slots left! This session is fully booked." });
    }

    // Restriction 2: Deadline/Expired Check
    const currentDate = new Date();
    if (tutor.sessionEndDate && new Date(tutor.sessionEndDate) < currentDate) {
      return res.status(400).send({ message: "Booking is not available yet or deadline has expired for this tutor." });
    }

    // Restriction 3: Block duplicate active booking by same student for same tutor
    const studentEmail = bookingData.studentEmail || bookingData.email;
    const existingActiveBooking = await bookingsCollection.findOne({
      tutorId: bookingData.tutorId,
      studentEmail: studentEmail,
      status: { $ne: 'cancelled' } // Allow booking only if previous status is cancelled
    });

    if (existingActiveBooking) {
      return res.status(400).send({ 
        message: "You have already booked this tutor! You cannot book again unless you cancel your existing session from My Sessions." 
      });
    }

    // Insert Booking
    const newBooking = {
      ...bookingData,
      studentEmail: studentEmail,
      status: "Confirmed",
      bookedAt: new Date()
    };

    const bookingResult = await bookingsCollection.insertOne(newBooking);

    // Auto Decrease totalSlots by 1 ($inc: -1)
    await tutorsCollection.updateOne(
      { _id: new ObjectId(bookingData.tutorId) },
      { $inc: { totalSlots: -1 } }
    );

    res.status(201).send({ success: true, bookingResult });
  } catch (error) {
    res.status(500).send({ message: "Booking failed", error: error.message });
  }
});

// 2. Get Bookings List
app.get('/bookings', async (req, res) => {
  try {
    const { studentEmail, tutorEmail, email } = req.query;
    let query = {};

    if (studentEmail) query.studentEmail = studentEmail;
    else if (email) query.email = email;
    
    if (tutorEmail) query.tutorEmail = tutorEmail;

    const result = await bookingsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Fetch bookings failed" });
  }
});

// 3. Cancel Booking Status Update (PATCH - Changes status to 'cancelled' & Increases Slot back by +1)
app.patch('/bookings/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const targetStatus = status || 'cancelled';

    const booking = await bookingsCollection.findOne({ _id: new ObjectId(id) });
    if (!booking) {
      return res.status(404).send({ message: "Booking not found" });
    }

    // If already cancelled, no action needed
    if (booking.status === 'cancelled') {
      return res.status(400).send({ message: "Booking is already cancelled" });
    }

    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: targetStatus } }
    );

    // Auto Increment tutor slots by 1 when booking is cancelled ($inc: +1)
    if (targetStatus === 'cancelled' && booking.tutorId) {
      await tutorsCollection.updateOne(
        { _id: new ObjectId(booking.tutorId) },
        { $inc: { totalSlots: 1 } }
      );
    }

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Status update failed", error: error.message });
  }
});

// Fallback endpoint for /bookings/:id/cancel
app.patch('/bookings/:id/cancel', async (req, res) => {
  try {
    const id = req.params.id;

    const booking = await bookingsCollection.findOne({ _id: new ObjectId(id) });
    if (!booking) {
      return res.status(404).send({ message: "Booking not found" });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).send({ message: "Already cancelled" });
    }

    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'cancelled' } }
    );

    if (booking.tutorId) {
      await tutorsCollection.updateOne(
        { _id: new ObjectId(booking.tutorId) },
        { $inc: { totalSlots: 1 } }
      );
    }

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Cancellation failed" });
  }
});

// Delete Booking (Optional)
app.delete('/bookings/:id', async (req, res) => {
  try {
    const result = await bookingsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Delete booking failed" });
  }
});

// ================= FIGMA SEED API ================= //
app.get('/seed-figma-tutors', async (req, res) => {
  try {
    const figmaTutors = [
      {
        name: "Dr. Sarah Mitchell",
        language: "Mathematics",
        subject: "Mathematics",
        price: 45,
        institution: "MIT",
        experience: "8 years",
        location: "Cambridge, MA",
        teachingMode: "Online",
        availableDays: "Mon – Fri",
        timeSlot: "4:00 PM – 8:00 PM",
        totalSlots: 8,
        sessionStartDate: new Date("2026-08-01"),
        sessionEndDate: new Date("2026-08-30"),
        reviews: 127,
        about: "PhD in Applied Mathematics from MIT. Specialises in calculus, linear algebra, and statistics.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500"
      },
      {
        name: "Prof. James Chen",
        language: "Physics",
        subject: "Physics",
        price: 50,
        institution: "Stanford University",
        experience: "12 years",
        location: "Palo Alto, CA",
        teachingMode: "Both",
        availableDays: "Tue – Sat",
        timeSlot: "5:00 PM – 9:00 PM",
        totalSlots: 6,
        sessionStartDate: new Date("2026-08-05"),
        sessionEndDate: new Date("2026-09-05"),
        reviews: 98,
        about: "Specializing in Quantum Physics and Thermodynamics with 12+ years of academic research.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500"
      },
      {
        name: "Ms. Aisha Rahman",
        language: "English Literature",
        subject: "English Literature",
        price: 35,
        institution: "Oxford University",
        experience: "6 years",
        location: "Boston, MA",
        teachingMode: "Online",
        availableDays: "Mon – Thu",
        timeSlot: "3:00 PM – 7:00 PM",
        totalSlots: 10,
        sessionStartDate: new Date("2026-08-10"),
        sessionEndDate: new Date("2026-09-10"),
        reviews: 84,
        about: "Oxford graduate passionate about creative writing, essays, and classical literature analysis.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500"
      },
      {
        name: "Dr. Carlos Rivera",
        language: "Chemistry",
        subject: "Chemistry",
        price: 45,
        institution: "Caltech",
        experience: "9 years",
        location: "Pasadena, CA",
        teachingMode: "Both",
        availableDays: "Wed – Sun",
        timeSlot: "2:00 PM – 6:00 PM",
        totalSlots: 4,
        sessionStartDate: new Date("2026-08-01"),
        sessionEndDate: new Date("2026-08-25"),
        reviews: 112,
        about: "Organic Chemistry specialist providing simplified step-by-step problem-solving methods.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500"
      },
      {
        name: "Mr. Jhankar Mahbub",
        language: "Web Development",
        subject: "Web Development",
        price: 40,
        institution: "Programming Hero",
        experience: "10 years",
        location: "Dhaka, BD",
        teachingMode: "Online",
        availableDays: "Mon – Fri",
        timeSlot: "6:00 PM – 10:00 PM",
        totalSlots: 12,
        sessionStartDate: new Date("2026-08-01"),
        sessionEndDate: new Date("2026-09-30"),
        reviews: 215,
        about: "Senior Web Developer teaching JavaScript, React, and Node.js in an engaging and fun way.",
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=500"
      },
      {
        name: "Dr. Priya Sharma",
        language: "Biology",
        subject: "Biology",
        price: 42,
        institution: "Johns Hopkins",
        experience: "7 years",
        location: "Baltimore, MD",
        teachingMode: "Both",
        availableDays: "Tue – Sat",
        timeSlot: "4:00 PM – 8:00 PM",
        totalSlots: 7,
        sessionStartDate: new Date("2026-08-15"),
        sessionEndDate: new Date("2026-09-15"),
        reviews: 91,
        about: "Biomedical researcher making Cell Biology and Genetics intuitive and easy to master.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=500"
      }
    ];

    await tutorsCollection.deleteMany({});
    await tutorsCollection.insertMany(figmaTutors);

    res.json({ success: true, message: "Successfully replaced database with official Figma Tutors data!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`🚀 Server is listening on port: ${port}`));