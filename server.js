const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public'))); 

// MongoDB Connection
mongoose.connect('mongodb+srv://dhikritofficial_db_user:pMglyipsCrUHfkPz@cluster0.c0ymhg2.mongodb.net/?appName=Cluster0&compressors=zlib')
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// API Routes
app.post('/api/register', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ message: "Registration successful!", student: newStudent });
    } catch (error) {
        res.status(400).json({ error: "Failed to register. Please check your data." });
    }
});

app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find().sort({ registrationDate: -1 });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch records." });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
module.exports = app;