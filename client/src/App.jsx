import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { StudentList } from './components/StudentList';
import { CourseList } from './components/CourseList';
import { TrainerList } from './components/TrainerList';
import { BookOpen, Users, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';

const NavLink = ({ to, icon: Icon, children, collapsed }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? children : ''}
        >
            <Icon size={20} />
            <span className={`nav-text ${collapsed ? 'hidden' : ''}`}>{children}</span>
        </Link>
    );
};

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="app-container">
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className={`sidebar-logo-container ${collapsed ? 'hidden' : ''}`}>
                        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-img">
                            <rect width="40" height="40" rx="8" fill="url(#logo_gradient)" />
                            <path d="M12 14H28M20 14V28" stroke="white" strokeWidth="4" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="logo_gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#3b82f6" />
                                    <stop offset="1" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="sidebar-logo">TechLearning</div>
                    </div>
                    <button
                        className="collapse-btn"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                <nav className="nav-vertical">
                    <NavLink to="/trainers" icon={Users} collapsed={collapsed}>Trainer</NavLink>
                    <NavLink to="/students" icon={GraduationCap} collapsed={collapsed}>Student</NavLink>
                    <NavLink to="/courses" icon={BookOpen} collapsed={collapsed}>Courses</NavLink>
                </nav>
            </aside>

            <main className="main-content">
                <div style={{ width: '100%' }}>
                    <Routes>
                        <Route path="/" element={
                            <div style={{
                                padding: '3rem',
                                textAlign: 'center',
                                background: 'rgba(30, 41, 59, 0.4)',
                                borderRadius: '12px',
                                border: '1px dashed rgba(255, 255, 255, 0.1)'
                            }}>
                                <h3 style={{ color: 'var(--text-secondary)' }}>Select an option from the sidebar to get started.</h3>
                            </div>
                        } />
                        <Route path="/trainers" element={<TrainerList />} />
                        <Route path="/students" element={<StudentList />} />
                        <Route path="/courses" element={<CourseList />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};


const App = () => {
    return (
        <Router>
            <Dashboard />
        </Router>
    );
};

export default App;
