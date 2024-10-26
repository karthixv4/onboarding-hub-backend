const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { User, Resource } = require('../models/prismaClient');

// Zod schema for user registration
// Zod schema for user registration
const registerSchema = z.object({
    name: z.string().min(3),  // User name
    email: z.string().email(),  // User email
    password: z.string().min(6),  // Minimum password length
    role: z.enum(['manager', 'resource']),  // Enum for role
    managerId: z.number().optional(),  // Optional managerId field
});



// Zod schema for user login
const loginSchema = z.object({
    email: z.string().email(),  // Login using email
    password: z.string().min(6),  // Minimum password length
});

// Register a new user and then create a corresponding resource
exports.register = async (req, res) => {
    try {
        const validatedData = registerSchema.parse(req.body);  // Validate input using Zod
        console.log("Validated data: ", validatedData)
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);  // Hash password

        // Create new user
        const user = await User.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                role: validatedData.role,
                // Ensure that the managerId is valid (and not the user's own ID)
                managerId: validatedData.managerId !== undefined && validatedData.managerId !== user.id
                    ? validatedData.managerId
                    : null,  // Set to null if the managerId is invalid
            },
        });
        // Automatically create a resource associated with the new user
        // const resource = await Resource.create({
        //     data: {
        //         userId: user.id, // Reference to the newly created user
        //         onboardingStatus: "Pending", // Default status for new resource
        //         setupCompleted: false, // Default setup completion status
        //     },
        // });

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(400).json({ error: error || "Something went wrong" });
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);  // Validate input using Zod
        const user = await User.findUnique({ where: { email: validatedData.email } });  // Find user by email

        if (!user || !(await bcrypt.compare(validatedData.password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.errors });
    }
};
