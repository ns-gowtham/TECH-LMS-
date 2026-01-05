import express from 'express';
import cors from 'cors';
import { initDB, Trainer, Student, Course, SubCourse } from './db.js';

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
    const courses = await Course.findAll({
        include: SubCourse,
        order: [['id', 'ASC']] // Consistent ordering
    });
    res.json(courses);
});

app.put('/api/courses/:id', async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.update(req.body);
            res.json(course);
        } else {
            res.status(404).json({ error: 'Course not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// SubCourse Routes
app.post('/api/subcourses', async (req, res) => {
    try {
        const subCourse = await SubCourse.create(req.body);
        res.status(201).json(subCourse);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/courses/:id/subcourses', async (req, res) => {
    try {
        const subCourses = await SubCourse.findAll({
            where: { CourseId: req.params.id },
            order: [['id', 'ASC']]
        });
        res.json(subCourses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/subcourses/:id', async (req, res) => {
    try {
        const subCourse = await SubCourse.findByPk(req.params.id);
        if (subCourse) {
            await subCourse.update(req.body);
            res.json(subCourse);
        } else {
            res.status(404).json({ error: 'Subcourse not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, async () => {
    await initDB();
    console.log(`Server running on http://localhost:${PORT}`);
});
