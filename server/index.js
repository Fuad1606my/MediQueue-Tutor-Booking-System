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

let db;
let tutorsCollection;
let bookingsCollection;
let usersCollection;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("mediQueueDB");
    tutorsCollection = db.collection("tutors");
    bookingsCollection = db.collection("bookings");
    usersCollection = db.collection("users");
    console.log("📁 MongoDB Connected Successfully!");
  }
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB Connection Error:", err);
    res.status(500).send({ message: "Database connection failed" });
  }
});

const safeQueryId = (id) => {
  if (!id) return {};
  if (ObjectId.isValid(id)) {
    return { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
  }
  return { _id: id };
};

app.get('/', (req, res) => {
  res.send('MediQueue Server is running smoothly!');
});

// ================= USER AUTH APIs ================= //

app.post('/users/signup', async (req, res) => {
  try {
    const { email, name, password, photoURL, image } = req.body;
    if (!email) return res.status(400).send({ message: "Email is required" });

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await usersCollection.findOne({ 
      email: { $regex: `^${normalizedEmail}$`, $options: 'i' } 
    });

    if (existingUser) {
      return res.status(400).send({ message: "User already exists with this email! Please login instead." });
    }

    const newUser = {
      name: name || "User",
      email: normalizedEmail,
      password: password,
      image: photoURL || image || "",
      createdAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);
    res.status(201).send({ success: true, result, user: newUser });
  } catch (error) {
    res.status(500).send({ message: "Registration failed", error: error.message });
  }
});

app.post('/users/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ message: "Email and Password are required" });

    const normalizedEmail = email.trim().toLowerCase();
    const user = await usersCollection.findOne({ 
      email: { $regex: `^${normalizedEmail}$`, $options: 'i' } 
    });
    
    if (!user || user.password !== password) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
    
    res.send({ success: true, user });
  } catch (error) {
    res.status(500).send({ message: "Signin failed", error: error.message });
  }
});

// ================= TUTORS APIs ================= //

app.post('/tutors', async (req, res) => {
  try {
    const body = req.body;
    
    const tutorData = {
      name: body.tutorName || body.name || "Anonymous Tutor",
      tutorName: body.tutorName || body.name || "Anonymous Tutor",
      image: body.photoURL || body.image || "/jhankar.png",
      photoURL: body.photoURL || body.image || "/jhankar.png",
      language: body.subject || body.language || "General",
      subject: body.subject || body.language || "General",
      availableDays: body.availableDaysTime || body.availableDays || "Sun - Thu",
      timeSlot: body.availableDaysTime || body.timeSlot || "5:00 PM - 8:00 PM",
      price: parseFloat(body.hourlyFee || body.price || 0),
      hourlyFee: parseFloat(body.hourlyFee || body.price || 0),
      totalSlots: Math.max(0, parseInt(body.totalSlot || body.totalSlots || 10)),
      totalSlot: Math.max(0, parseInt(body.totalSlot || body.totalSlots || 10)),
      sessionStartDate: body.sessionStartDate ? new Date(body.sessionStartDate) : new Date(),
      sessionEndDate: body.sessionEndDate ? new Date(body.sessionEndDate) : new Date(Date.now() + 30*24*60*60*1000),
      institution: body.institution || "N/A",
      experience: body.experience || body.about || "N/A",
      location: body.location || "N/A",
      teachingMode: body.teachingMode || "Online",
      email: body.email || "user@example.com",
      createdAt: new Date()
    };

    const result = await tutorsCollection.insertOne(tutorData);
    res.status(201).send({ success: true, insertedId: result.insertedId });
  } catch (error) {
    res.status(500).send({ message: "Failed to add tutor", error: error.message });
  }
});

app.get('/tutors', async (req, res) => {
  try {
    const { email, search, startDate, endDate } = req.query;
    let query = {};

    if (email) query.email = email;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tutorName: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { language: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.sessionStartDate = {};
      if (startDate) query.sessionStartDate.$gte = new Date(startDate);
      if (endDate) query.sessionStartDate.$lte = new Date(endDate);
    }

    const result = await tutorsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch tutors" });
  }
});

app.get('/tutors/:id', async (req, res) => {
  try {
    const query = safeQueryId(req.params.id);
    const result = await tutorsCollection.findOne(query);
    if (!result) return res.status(404).send({ message: "Tutor not found" });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Fetch tutor failed" });
  }
});

app.put('/tutors/:id', async (req, res) => {
  try {
    const query = safeQueryId(req.params.id);
    const body = req.body;

    const updatedImage = body.image || body.photoURL;

    const updateDoc = {
      $set: {
        name: body.name || body.tutorName,
        tutorName: body.tutorName || body.name,
        image: updatedImage,
        photoURL: updatedImage,
        language: body.subject || body.language,
        subject: body.subject || body.language,
        price: parseFloat(body.price || body.hourlyFee || 0),
        hourlyFee: parseFloat(body.hourlyFee || body.price || 0),
        totalSlots: Math.max(0, parseInt(body.totalSlots || body.totalSlot || 0)),
        totalSlot: Math.max(0, parseInt(body.totalSlot || body.totalSlots || 0)),
        sessionStartDate: body.sessionStartDate ? new Date(body.sessionStartDate) : null,
        sessionEndDate: body.sessionEndDate ? new Date(body.sessionEndDate) : null,
        institution: body.institution,
        experience: body.experience,
        location: body.location,
        teachingMode: body.teachingMode,
        timeSlot: body.timeSlot || body.availableDaysTime
      }
    };

    const result = await tutorsCollection.updateOne(query, updateDoc);
    res.send({ success: true, result });
  } catch (error) {
    res.status(500).send({ message: "Failed to update tutor details" });
  }
});

app.delete('/tutors/:id', async (req, res) => {
  try {
    const query = safeQueryId(req.params.id);
    const result = await tutorsCollection.deleteOne(query);
    res.send({ success: true, result });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete tutor" });
  }
});

// ================= BOOKINGS APIs ================= //

app.post('/bookings', async (req, res) => {
  try {
    const { tutorId, name, phone, tutorName, email, studentEmail, accountEmail } = req.body;

    if (!tutorId) {
      return res.status(400).send({ message: "Tutor ID is missing" });
    }

    const tutorQuery = safeQueryId(tutorId);
    const tutor = await tutorsCollection.findOne(tutorQuery);

    const currentSlots = tutor ? (tutor.totalSlots ?? tutor.totalSlot ?? 0) : 10;
    if (tutor && currentSlots <= 0) {
      return res.status(400).send({ message: "No available slots left! This session is fully booked." });
    }

    const formEmail = (email || studentEmail || "").trim().toLowerCase();
    const activeAccountEmail = (accountEmail || formEmail).trim().toLowerCase();

    // Check conflict against exact booking input email
    const existingActiveBooking = await bookingsCollection.findOne({
      $and: [
        {
          $or: [
            { tutorId: String(tutorId) },
            { tutorName: tutorName || tutor?.name || tutor?.tutorName }
          ]
        },
        {
          $or: [
            { studentEmail: formEmail },
            { email: formEmail }
          ]
        },
        { status: { $ne: 'cancelled' } }
      ]
    });

    if (existingActiveBooking) {
      return res.status(400).send({ 
        message: "You have already booked a session with this tutor using this email address! Cancel your existing booking first if you want to re-book." 
      });
    }

    const bookingPayload = {
      tutorId: String(tutorId),
      name: name || "Student",
      phone: phone || "N/A",
      tutorName: tutorName || (tutor ? (tutor.name || tutor.tutorName) : "Tutor"),
      email: formEmail,
      studentEmail: formEmail,
      accountEmail: activeAccountEmail, // Stores main account email for easy fetching
      status: "Confirmed",
      bookedAt: new Date()
    };

    const result = await bookingsCollection.insertOne(bookingPayload);

    if (tutor) {
      await tutorsCollection.updateOne(
        tutorQuery,
        { $set: { totalSlots: Math.max(0, currentSlots - 1), totalSlot: Math.max(0, currentSlots - 1) } }
      );
    }

    res.status(201).send({ 
      success: true, 
      bookingId: result.insertedId, 
      result 
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).send({ message: "Failed to complete booking", error: error.message });
  }
});

// Fetch Bookings (Matches any of the student's emails or main account email)
app.get('/bookings', async (req, res) => {
  try {
    const { email, studentEmail } = req.query;
    const targetEmail = (studentEmail || email || "").trim().toLowerCase();

    let query = {};
    if (targetEmail && targetEmail !== 'undefined') {
      query = {
        $or: [
          { studentEmail: targetEmail },
          { email: targetEmail },
          { accountEmail: targetEmail }
        ]
      };
    }

    const result = await bookingsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Fetch bookings failed" });
  }
});

app.patch('/bookings/:id', async (req, res) => {
  try {
    const query = safeQueryId(req.params.id);
    const booking = await bookingsCollection.findOne(query);
    
    if (!booking) return res.status(404).send({ message: "Booking not found" });

    if (booking.status === 'cancelled') {
      return res.status(400).send({ message: "Booking is already cancelled" });
    }

    const result = await bookingsCollection.updateOne(
      query,
      { $set: { status: 'cancelled' } }
    );

    if (booking.tutorId) {
      const tutorQuery = safeQueryId(booking.tutorId);
      const tutor = await tutorsCollection.findOne(tutorQuery);
      if (tutor) {
        const slots = tutor.totalSlots ?? tutor.totalSlot ?? 0;
        await tutorsCollection.updateOne(
          tutorQuery,
          { $set: { totalSlots: slots + 1, totalSlot: slots + 1 } }
        );
      }
    }

    res.send({ success: true, result });
  } catch (error) {
    res.status(500).send({ message: "Cancellation failed" });
  }
});

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
        name: "Jhankar Mahbub",
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
        image: "/jhankar.png"
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

    res.json({ success: true, message: "Successfully restored original tutors and photos!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`🚀 Server listening on port: ${port}`));