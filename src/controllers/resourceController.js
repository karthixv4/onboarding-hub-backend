const { z } = require('zod');
const { Resource, KTPlan, User, initialSetup } = require('../models/prismaClient');

// Zod schema for resource validation, includes optional `ktPlans`
const resourceSchema = z.object({
    userId: z.string().email(),
    onboardingStatus: z.string().min(1),
    setupCompleted: z.boolean(),
    team: z.string().optional(),
    position: z.string().optional(),
    ktPlans: z.array(z.object({
        description: z.string().optional(),  // KT Plan description (optional)
        startDate: z.string().optional(),    // KT Plan start date (optional)
        endDate: z.string().optional(),      // KT Plan end date (optional)
        progress: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),  // KT Plan progress
    })).optional(),


});

// Get all resources along with their related user and KT Plans
exports.getAllResources = async (req, res) => {
    try {
        const resources = await Resource.findMany({
            include: {
                user: true,  // Include associated user
                ktPlans: true,
                initialSetup: {
                    include: {
                        setupTasks: true // Include tasks under initial setup
                    }
                }  // Include associated KT plans
            }
        });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch resources" });
    }
};

// Add a new resource with optional KT plans
exports.addResource = async (req, res) => {
    console.log("Inside add resource req: ", req.body);
    try {
        const validatedData = resourceSchema.parse(req.body);
        console.log("Inside add resource validatedData: ", validatedData);
        console.log("Validated data", validatedData);

        const user = await User.findUnique({
            where: { email: validatedData.userId }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create resource with optional KT plans
        const resource = await Resource.create({
            data: {
                userEmail: user.email,
                onboardingStatus: validatedData.onboardingStatus,
                setupCompleted: validatedData.setupCompleted,
                ktPlans: {
                    create: validatedData.ktPlans || [],  // Create KT plans if provided
                },
                team: validatedData.team,
                position: validatedData.position
            },
            include: { ktPlans: true }  // Include created KT plans in response
        });

        if (resource) {
            await User.update({
                where: { email: user.email },
                data: {
                    onBoardingStartedFlag: true,
                }
            })
        }

        res.status(201).json(resource);
    } catch (error) {
        res.status(400).json({ error: error.message || "Invalid request" });
    }
};


// Get a single resource by ID along with its related user and KT Plans
exports.getResourceById = async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await Resource.findUnique({
            where: { id: parseInt(id) },
            include: { user: true, ktPlans: true }  // Include associated user and KT plans
        });

        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        res.json(resource);
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch resource" });
    }
};

// Update an existing resource
exports.updateResource = async (req, res) => {
    const { id } = req.params;
    try {
        const validatedData = resourceSchema.partial().parse(req.body);  // Partial validation

        const resource = await Resource.update({
            where: { id: parseInt(id) },
            data: {
                userId: validatedData.userId,
                onboardingStatus: validatedData.onboardingStatus,
                setupCompleted: validatedData.setupCompleted,
                ktPlans: {
                    upsert: validatedData.ktPlans?.map((ktPlan) => ({
                        where: { id: ktPlan.id || 0 },  // Assume KT Plan has an id for upsert
                        create: ktPlan,
                        update: ktPlan,
                    })) || [],
                }
            },
            include: { ktPlans: true }  // Include updated KT plans in response
        });

        res.json(resource);
    } catch (error) {
        res.status(400).json({ error: error.message || "Invalid request" });
    }
};

// Delete a resource by ID
exports.deleteResource = async (req, res) => {
    const { id } = req.params;
    try {
        await Resource.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();  // No content on successful deletion
    } catch (error) {
        res.status(500).json({ error: "Unable to delete resource" });
    }
};

// Optionally, implement a method to get resources by userId
exports.getResourcesByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const resources = await Resource.findMany({
            where: { userId: parseInt(userId) },
            include: { user: true, ktPlans: true }  // Include associated user and KT plans
        });

        res.json(resources);
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch resources" });
    }
};
