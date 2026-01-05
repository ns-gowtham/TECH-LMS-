import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from './TrainerList'; // Reuse Modal from TrainerList

const Input = ({ label, name, type = "text", required = true, ...props }) => (
    <div className="form-group">
        <label className="form-label" htmlFor={name}>{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            className="form-input"
            required={required}
            {...props}
        />
    </div>
);

export const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/courses');
            const data = await res.json();
            setCourses(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleSuccess = () => {
        setIsModalOpen(false);
        fetchCourses();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 style={{ margin: 0 }}>Courses List</h2>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} style={{ marginRight: '0.5rem' }} />
                    Add Course
                </button>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Thumbnail</th>
                            <th>Title</th>
                            <th>Redirection Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : courses.length === 0 ? (
                            <tr><td colSpan="3" style={{ textAlign: 'center' }}>No courses found.</td></tr>
                        ) : (
                            courses.map((course) => (
                                <tr key={course.id}>
                                    <td>
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/60x40?text=No+Img'; }}
                                        />
                                    </td>
                                    <td>{course.title}</td>
                                    <td>
                                        <a href={course.redirection_link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
                                            Visit Link
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Course">
                <CourseForm onSuccess={handleSuccess} />
            </Modal>
        </div>
    );
};

export const CourseForm = ({ onSuccess }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:3000/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                if (onSuccess) onSuccess();
                else alert('Course added successfully!');
                e.target.reset(); // Reset form
            } else {
                alert('Failed to add course');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error connecting to server');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input label="Course Title" name="title" />
            <Input label="Thumbnail URL" name="thumbnail" placeholder="http://..." />
            <Input label="Redirection Link" name="redirection_link" placeholder="http://..." />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Submit Course
            </button>
        </form>
    );
};
