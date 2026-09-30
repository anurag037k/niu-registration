require('dotenv').config(); // Loads the secret PIN
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || 'Dhikrit2026'; // Fallback pin
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
 // Change to Atlas URI for live
   // Replace your current mongoose.connect block with this:
const DB_URI = process.env.MONGODB_URI || 'mongodb+srv://dhikritofficial_db_user:pMglyipsCrUHfkPz@cluster0.c0ymhg2.mongodb.net/?appName=Cluster0&compressors=zlib';

mongoose.connect(DB_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// 1. Public Endpoint: Register Student
app.post('/api/register', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        res.status(400).json({ error: "Failed to register." });
    }
});

// 2. Secure Endpoint: Verify PIN
app.post('/api/verify-pin', (req, res) => {
    if (req.body.pin === ADMIN_PIN) {
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Invalid PIN" });
    }
});

// 3. Secure Endpoint: Get Student Data (Requires PIN in headers)
app.get('/api/students', async (req, res) => {
    const clientPin = req.headers['x-admin-pin'];
    
    if (clientPin !== ADMIN_PIN) {
        return res.status(401).json({ error: "Unauthorized: Invalid PIN" });
    }

    try {
        const students = await Student.find().sort({ registrationDate: -1 });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch records." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});