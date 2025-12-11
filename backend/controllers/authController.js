const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const seedUsers = async () => {
    const adminExists = await User.findOne({ email: 'hire-me@anshumat.org' });
    
    if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const adminHash = await bcrypt.hash('HireMe@2025!', salt);
        
        await User.create({
            name: 'Reviewer Admin',
            email: 'hire-me@anshumat.org',
            password: adminHash,
            role: 'admin',
            employeeCode: 'ADM001',
            department: 'Management'
        });
        console.log('Admin Account Created');
    }

    const employees = [
        {
            name: 'Rahul Sharma',
            email: 'rahul@example.com',
            password: 'User@123',
            role: 'user',
            employeeCode: 'EMP001',
            department: 'Engineering'
        },
        {
            name: 'Priya Patel',
            email: 'priya@example.com',
            password: 'User@123',
            role: 'user',
            employeeCode: 'EMP002',
            department: 'HR'
        },
        {
            name: 'Amit Singh',
            email: 'amit@example.com',
            password: 'User@123',
            role: 'user',
            employeeCode: 'EMP003',
            department: 'Sales'
        }
    ];

    for (const emp of employees) {
        const userExists = await User.findOne({ email: emp.email });
        if (!userExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(emp.password, salt);
            
            await User.create({
                ...emp,
                password: hashedPassword
            });
            console.log(`Employee seeded: ${emp.name}`);
        }
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

const getEmployees = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
};

module.exports = { loginUser, seedUsers, getEmployees };