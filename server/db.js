import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Default connection string - User should likely update this in a .env file
// Default connection string - UPDATE THIS WITH YOUR POSTGRES PASSWORD
// Format: postgres://username:password@localhost:5432/database_name
const DB_URL = process.env.DATABASE_URL || 'postgres://postgres:Zxqw90@localhost:5432/fusionhubble';

export const sequelize = new Sequelize(DB_URL, {
    dialect: 'postgres',
    logging: false,
});

export const Trainer = sequelize.define('Trainer', {
    name: { type: DataTypes.STRING, allowNull: false },
    dob: { type: DataTypes.DATEONLY, allowNull: false },
    aadhar: { type: DataTypes.STRING, unique: true, allowNull: false },
    gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
    address: { type: DataTypes.TEXT },
    educational_qualification: { type: DataTypes.STRING }
});

export const Student = sequelize.define('Student', {
    name: { type: DataTypes.STRING, allowNull: false },
    dob: { type: DataTypes.DATEONLY, allowNull: false },
    aadhar: { type: DataTypes.STRING, unique: true, allowNull: false },
    gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
    address: { type: DataTypes.TEXT },
    educational_qualification: { type: DataTypes.STRING }
});

export const Course = sequelize.define('Course', {
    title: { type: DataTypes.STRING, allowNull: false },
    thumbnail: { type: DataTypes.STRING }, // URL
    redirection_link: { type: DataTypes.STRING }, // URL
    status: {
        type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed'),
        defaultValue: 'Not Started'
    }
});

export const SubCourse = sequelize.define('SubCourse', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    link: { type: DataTypes.STRING }, // Video or content link
    status: {
        type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed'),
        defaultValue: 'Not Started'
    }
});

// Associations
Course.hasMany(SubCourse, { onDelete: 'CASCADE' });
SubCourse.belongsTo(Course);

export const initDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        await sequelize.sync({ alter: true }); // Automatically updates schema
        console.log('Models synchronized.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
