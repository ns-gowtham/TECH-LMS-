import express from 'express';
import cors from 'cors';
import { initDB, Trainer, Student, Course } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Fusion Hubble API is running');
});

// Trainer Routes
app.post('/api/trainers', async (req, res) => {
    try {
        const trainer = await Trainer.create(req.body);
        res.status(201).json(trainer);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/trainers', async (req, res) => {
    const trainers = await Trainer.findAll();
    res.json(trainers);
});

// Student Routes
app.post('/api/students', async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/students', async (req, res) => {
    const students = await Student.findAll();
    res.json(students);
});

// Course Routes
app.post('/api/courses', async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/courses', async (req, res) => {
    const courses = await Course.findAll();
    res.json(courses);
});

// Start Server
app.listen(PORT, async () => {
    await initDB();
    console.log(`Server running on http://localhost:${PORT}`);
});
