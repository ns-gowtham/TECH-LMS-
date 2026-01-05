import React, { useState } from 'react';

const FormWrapper = ({ title, children, onSubmit }) => (
    <div className="card">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#f8fafc' }}>{title}</h2>
        <form onSubmit={onSubmit}>
            {children}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Submit
            </button>
        </form>
    </div>
);

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

export const TrainerForm = () => {
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
            if (response.ok) alert('Trainer added successfully!');
            else alert('Failed to add trainer');
        } catch (error) {
            console.error('Error:', error);
            alert('Error connecting to server');
        }
    };

    return (
        <FormWrapper title="Add New Trainer" onSubmit={handleSubmit}>
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
        </FormWrapper>
    );
};

export const StudentForm = () => {
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
            if (response.ok) alert('Student added successfully!');
            else alert('Failed to add student');
        } catch (error) {
            alert('Error connecting to server');
        }
    };

    return (
        <FormWrapper title="Add New Student" onSubmit={handleSubmit}>
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
        </FormWrapper>
    );
};

export const CourseForm = () => {
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
            if (response.ok) alert('Course added successfully!');
            else alert('Failed to add course');
        } catch (error) {
            alert('Error connecting to server');
        }
    };

    return (
        <FormWrapper title="Add New Course" onSubmit={handleSubmit}>
            <Input label="Course Title" name="title" />
            <Input label="Thumbnail URL" name="thumbnail" placeholder="http://..." />
            <Input label="Redirection Link" name="redirection_link" placeholder="http://..." />
        </FormWrapper>
    );
};
