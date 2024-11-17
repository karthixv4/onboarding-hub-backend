const { z } = require('zod');
const { User, Resource } = require('../models/prismaClient');


// Fetch user details by ID
exports.getUserDetails = async (req, res) => {
    console.log("Inside by ID");
    try {
        const userId = parseInt(req.params.id);  // Get user ID from the request parameters
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const user = await User.findUnique({
            where: { id: userId },
            include: {
                resource: true, // Include associated resources if needed
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                onBoardingStartedFlag: true
            }
        });
        return res.status(200).json(users)
    } catch(error){
        res.status(500).json({error: error})
    }
}
