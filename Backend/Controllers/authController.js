const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../Models/UserModel');

const login = async (req, res) => {
    try {
        const { name, password } = req.body;

        const existingUser = await userModel.findOne({ name });
        if (!existingUser) {
            return res.status(401).json({ message: "No such user exists" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: existingUser.id, name: existingUser.name, email: existingUser.email, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ message: "Internal server error", details: err.message });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await userModel.findOne({ $or: [{ name }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with the same name or email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const photo = req.file?.filename || null;

        const newUser = new userModel({ name, email, password: hashedPassword, photo });
        await newUser.save();

        res.status(201).json({ message: `User registered successfully: ${name}` });
    } catch (err) {
        console.error("Registration error:", err.message);
        res.status(500).json({ message: "Internal server error", details: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, { password: 0, __v: 0 });
        res.status(200).json(users);
    } catch (err) {
        console.error("Error getting users:", err.message);
        res.status(500).json({ message: "Internal server error", details: err.message });
    }
};

const updateUser = async (userId, userDetails) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(userId, userDetails, { new: true });
        return updatedUser;
    } catch (err) {
        console.error("Error updating user:", err.message);
        throw new Error('Error updating user details');
    }
};

const deleteUser = async (userId) => {
    try {
        const deletedUser = await userModel.findByIdAndDelete(userId);
        return deletedUser;
    } catch (err) {
        console.error("Error deleting user:", err.message);
        throw new Error('Error deleting user account');
    }
};

const getUserDetails = async (userId) => {
    try {
        const user = await userModel.findById(userId).select('-password -__v');
        return user;
    } catch (err) {
        throw new Error('Error fetching user details');
    }
};

module.exports = { login, register, getAllUsers, updateUser, deleteUser, getUserDetails };
