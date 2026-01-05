import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

// Reuse Input & TextArea from AdminForms if possible, but for simplicity re-declaring or exporting from there would be better.
// For now, I will create a reusable Input/TextArea here to avoid circular dep or complex exports if I move things around.
// Ideally, these UI components should be in their own file.

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

export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h3>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div style={{ padding: '1.5rem' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export const TrainerList = () => {
    const [trainers, setTrainers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchTrainers = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/trainers');
            const data = await res.json();
            setTrainers(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    const handleSuccess = () => {
        setIsModalOpen(false);
        fetchTrainers();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 style={{ margin: 0 }}>Trainers List</h2>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} style={{ marginRight: '0.5rem' }} />
                    Add Trainer
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
                        ) : trainers.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No trainers found.</td></tr>
                        ) : (
                            trainers.map((trainer) => (
                                <tr key={trainer.id}>
                                    <td>{trainer.name}</td>
                                    <td>{trainer.dob}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{trainer.gender}</td>
                                    <td>{trainer.educational_qualification}</td>
                                    <td>{trainer.address}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Trainer">
                <TrainerForm onSuccess={handleSuccess} />
            </Modal>
        </div>
    );
};

// Extracted TrainerForm to be reusable
export const TrainerForm = ({ onSuccess }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:3000/api/trainers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                if (onSuccess) onSuccess();
                else alert('Trainer added successfully!');
                e.target.reset(); // Reset form
            } else {
                alert('Failed to add trainer');
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
                Submit Trainer
            </button>
        </form>
    );
};
