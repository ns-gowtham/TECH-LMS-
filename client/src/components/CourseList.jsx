import React, { useState, useEffect } from 'react';
import { Plus, Layers, Pencil } from 'lucide-react'; // Added Pencil
import { Modal } from './TrainerList'; // Reuse Modal from TrainerList

const Input = ({ label, name, type = "text", required = true, defaultValue = "", ...props }) => (
    <div className="form-group">
        <label className="form-label" htmlFor={name}>{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            className="form-input"
            required={required}
            defaultValue={defaultValue}
            {...props}
        />
    </div>
);

export const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null); // For subcourse modal
    const [editingCourse, setEditingCourse] = useState(null); // For edit modal
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
        setEditingCourse(null); // Clear edit state
        fetchCourses();
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setIsModalOpen(true);
    };

    const handleStatusChange = async (courseId, newStatus) => {
        // Optimistic update
        setCourses(courses.map(c => c.id === courseId ? { ...c, status: newStatus } : c));

        try {
            const res = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) {
                // Revert on failure
                fetchCourses();
                alert('Failed to update status');
            }
        } catch (error) {
            console.error("Status update failed", error);
            fetchCourses();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return '#10b981';
            case 'In Progress': return '#f59e0b';
            default: return '#94a3b8';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 style={{ margin: 0 }}>Courses List</h2>
                <button className="btn btn-primary" onClick={() => { setEditingCourse(null); setIsModalOpen(true); }}>
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
                            <th>Status</th>
                            <th>Redirection Link</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : courses.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No courses found.</td></tr>
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
                                        <select
                                            value={course.status || 'Not Started'}
                                            onChange={(e) => handleStatusChange(course.id, e.target.value)}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                border: `1px solid ${getStatusColor(course.status)}60`,
                                                background: `${getStatusColor(course.status)}10`,
                                                color: getStatusColor(course.status),
                                                fontWeight: 500,
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                outline: 'none'
                                            }}
                                        >
                                            <option value="Not Started">Not Started</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td>
                                        <a href={course.redirection_link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
                                            Visit Link
                                        </a>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn"
                                                onClick={() => openEditModal(course)}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    border: '1px solid rgba(0,0,0,0.1)',
                                                    color: 'var(--text-secondary)'
                                                }}
                                                title="Edit Course"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                className="btn"
                                                onClick={() => setSelectedCourse(course)}
                                                style={{
                                                    padding: '0.5rem',
                                                    fontSize: '0.875rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    background: 'rgba(56, 189, 248, 0.1)',
                                                    color: 'var(--tech-blue)',
                                                    border: '1px solid rgba(56, 189, 248, 0.2)'
                                                }}
                                            >
                                                <Layers size={16} />
                                                Subcourses
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Main Course Modal */}
            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingCourse(null); }} title={editingCourse ? "Edit Course" : "Add New Course"}>
                <CourseForm onSuccess={handleSuccess} initialData={editingCourse} />
            </Modal>

            {/* Subcourse Manager Modal */}
            <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} title={`Manage Subcourses: ${selectedCourse?.title || ''}`}>
                {selectedCourse && <SubCourseManager courseId={selectedCourse.id} />}
            </Modal>
        </div>
    );
};

export const CourseForm = ({ onSuccess, initialData }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const url = initialData ? `http://localhost:3000/api/courses/${initialData.id}` : 'http://localhost:3000/api/courses';
        const method = initialData ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                if (onSuccess) onSuccess();
                else alert(`Course ${initialData ? 'updated' : 'added'} successfully!`);
                e.target.reset();
            } else {
                const errData = await response.json();
                console.error("Operation Failed:", errData);
                alert(`Failed to ${initialData ? 'update' : 'add'} course: ` + (errData.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error connecting to server');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input label="Course Title" name="title" defaultValue={initialData?.title} />
            <Input label="Thumbnail URL" name="thumbnail" placeholder="http://..." defaultValue={initialData?.thumbnail} />
            <Input label="Redirection Link" name="redirection_link" placeholder="http://..." defaultValue={initialData?.redirection_link} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                {initialData ? 'Update Course' : 'Submit Course'}
            </button>
        </form>
    );
};

const SubCourseManager = ({ courseId }) => {
    const [subCourses, setSubCourses] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingSubCourse, setEditingSubCourse] = useState(null); // Track which subcourse is being edited

    const fetchSubCourses = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/courses/${courseId}/subcourses`);
            if (res.ok) {
                const data = await res.json();
                setSubCourses(data);
            }
        } catch (error) {
            console.error("Failed to fetch subcourses", error);
        }
    };

    useEffect(() => {
        fetchSubCourses();
    }, [courseId]);

    const handleSaveSubCourse = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.CourseId = courseId;

        const url = editingSubCourse ? `http://localhost:3000/api/subcourses/${editingSubCourse.id}` : 'http://localhost:3000/api/subcourses';
        const method = editingSubCourse ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                fetchSubCourses(); // Refresh list
                setIsAdding(false); // Switch back to list view
                setEditingSubCourse(null);
                e.target.reset();
            } else {
                alert('Failed to save subcourse');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEditClick = (subCourse) => {
        setEditingSubCourse(subCourse);
        setIsAdding(true); // Reuse the adding view for editing
    };

    const handleStatusChange = async (subCourseId, newStatus) => {
        // Optimistic update
        setSubCourses(subCourses.map(sc => sc.id === subCourseId ? { ...sc, status: newStatus } : sc));

        try {
            const res = await fetch(`http://localhost:3000/api/subcourses/${subCourseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) fetchSubCourses(); // Revert on failure
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return '#10b981'; // Green
            case 'In Progress': return '#f59e0b'; // Amber
            default: return '#94a3b8'; // Grey
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    {isAdding ? (editingSubCourse ? 'Edit Subcourse' : 'Add New Subcourse') : 'Course Modules'}
                </h4>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        if (isAdding) {
                            setIsAdding(false);
                            setEditingSubCourse(null);
                        } else {
                            setIsAdding(true);
                            setEditingSubCourse(null);
                        }
                    }}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                >
                    {isAdding ? 'Cancel' : '+ Add Subcourse'}
                </button>
            </div>

            {isAdding ? (
                <div style={{ animation: 'fadeIn 0.2s' }}>
                    <form onSubmit={handleSaveSubCourse}>
                        {/* Hidden ID field for edit tracking if needed, but we used closure state */}
                        <Input label="Subcourse Title" name="title" placeholder="e.g. Module 1: Introduction" defaultValue={editingSubCourse?.title} />
                        <Input label="Content Link (Video/PDF)" name="link" placeholder="http://..." required={false} defaultValue={editingSubCourse?.link} />

                        <div className="form-group">
                            <label className="form-label" htmlFor="status">Status</label>
                            <select id="status" name="status" className="form-input" defaultValue={editingSubCourse?.status || 'Not Started'}>
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="desc">Description</label>
                            <textarea id="desc" name="description" className="form-input" rows="3" defaultValue={editingSubCourse?.description}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                            {editingSubCourse ? 'Update Subcourse' : 'Save Subcourse'}
                        </button>
                    </form>
                </div>
            ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '0.25rem' }}>
                    {subCourses.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#999', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                            <p>No subcourses added yet.</p>
                            <button className="btn" onClick={() => setIsAdding(true)} style={{ color: 'var(--tech-blue)', marginTop: '0.5rem' }}>Create your first module</button>
                        </div>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {subCourses.map(sc => (
                                <li key={sc.id} style={{
                                    padding: '1rem',
                                    marginBottom: '0.75rem',
                                    background: 'var(--card-bg)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}>
                                    <div style={{ flex: 1, marginRight: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{sc.title}</div>
                                            <button
                                                onClick={() => handleEditClick(sc)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0 }}
                                                title="Edit"
                                            >
                                                <Pencil size={12} />
                                            </button>
                                        </div>
                                        {sc.description && <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>{sc.description}</div>}
                                        {sc.link && <a href={sc.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--tech-blue)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            View Content ↗
                                        </a>}
                                    </div>
                                    <select
                                        value={sc.status || 'Not Started'}
                                        onChange={(e) => handleStatusChange(sc.id, e.target.value)}
                                        style={{
                                            padding: '4px 10px',
                                            background: `${getStatusColor(sc.status)}10`,
                                            color: getStatusColor(sc.status),
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            cursor: 'pointer',
                                            outline: 'none',
                                            minWidth: '110px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <option value="Not Started">Not Started</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};
