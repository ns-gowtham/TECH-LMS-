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

const TextArea = ({ label, name, required = true, ...props }) => (
    <div className="form-group">
        <label className="form-label" htmlFor={name}>{label}</label>
        <textarea
            id={name}
            name={name}
            className="form-input"
            rows="3"
            required={required}
            {...props}
        />
    </div>
);

export const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchStudents = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/students');
            const data = await res.json();
            setStudents(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleSuccess = () => {
        setIsModalOpen(false);
        fetchStudents();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 style={{ margin: 0 }}>Students List</h2>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} style={{ marginRight: '0.5rem' }} />
                    Add Student
                </button>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>DOB</th>
                            <th>Gender</th>
                            <th>Qualification</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : students.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No students found.</td></tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.dob}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{student.gender}</td>
                                    <td>{student.educational_qualification}</td>
                                    <td>{student.address}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Student">
                <StudentForm onSuccess={handleSuccess} />
            </Modal>
        </div>
    );
};

export const StudentForm = ({ onSuccess }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:3000/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                if (onSuccess) onSuccess();
                else alert('Student added successfully!');
                e.target.reset(); // Reset form
            } else {
                alert('Failed to add student');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error connecting to server');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input label="Full Name" name="name" />
            <Input label="Date of Birth" name="dob" type="date" />
            <Input label="Aadhar Number" name="aadhar" pattern="\d{12}" title="12 digit Aadhar number" />
            <div className="form-group">
                <label className="form-label">Gender</label>
                <select name="gender" className="form-input">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <TextArea label="Address" name="address" />
            <Input label="Educational Qualification" name="educational_qualification" />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Submit Student
            </button>
        </form>
    );
};
