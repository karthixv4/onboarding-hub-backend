const { InitialSetup, Resource, InitialSetupTask } = require('../models/prismaClient');
const { z } = require('zod');

// Zod schema for InitialSetup validation
const initialSetupSchema = z.object({
  resourceId: z.number().int().min(1, "Valid Resource ID is required"), // Validate resourceId instead of userEmail
  setupCompleted: z.boolean().optional(),
  setupTasks: z.array(z.object({
    id: z.number().int().optional(), // Optional ID for each task (existing tasks will have an ID)
    description: z.string().min(1, "Description is required"),
    completed: z.boolean().default(false),
    name: z.string().optional()
  })).optional()
});

exports.createInitialSetup = async (req, res) => {
  try {
    const { resourceId, setupCompleted = false, setupTasks } = req.body;

    // Log input data for debugging
    console.log('resourceId: ', resourceId, ", setupCompleted: ", setupCompleted, ", setupTasks: ", setupTasks);

    // Check if the resourceId exists
    const resource = await Resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return res.status(404).json({ error: "Resource not found." });
    }

    // Create a new InitialSetup entry
    const initialSetup = await InitialSetup.create({
      data: {
        resource: {
          connect: { id: resourceId }, // Connect to the existing resource by ID
        },
        setupCompleted, // Include the setupCompleted flag
        // If setupTasks is provided, create the tasks
        setupTasks: setupTasks ? {
          create: setupTasks.map((task) => ({
            description: task.description,
            completed: task.completed || false,
            name: task.name 
          })),
        } : undefined, // Do not include if no setupTasks provided
      },
    });

    res.status(201).json(initialSetup); // Return the created InitialSetup
  } catch (error) {
    console.error('Error creating InitialSetup:', error); // Log the error for debugging
    res.status(400).json({ error: error.message }); // Return a 400 status with the error message
  }
};



// Get all InitialSetup entries
exports.getAllInitialSetups = async (req, res) => {
  try {
    const initialSetups = await InitialSetup.findMany({
      include: {
        resource: true,       // Include related Resource information
        setupTasks: true      // Include setup tasks if needed
      }
    });
    res.status(200).json(initialSetups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single InitialSetup by ID
exports.getInitialSetupById = async (req, res) => {
  const { id } = req.params;
  try {
    const initialSetup = await InitialSetup.findUnique({
      where: { id: parseInt(id) },
      include: {
        resource: true,       // Include related Resource information
        setupTasks: true      // Include setup tasks if needed
      }
    });

    if (!initialSetup) {
      return res.status(404).json({ error: 'InitialSetup not found' });
    }

    res.status(200).json(initialSetup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an InitialSetup
// Update an InitialSetup
exports.updateInitialSetup = async (req, res) => {
  const { id } = req.params;

  try {
    const data = initialSetupSchema.partial().parse(req.body);
    // Map over `setupTasks` using `upsert` for each task, since each has an `id`
    const updateData = {
      setupCompleted: data.setupCompleted,
      setupTasks: {
        upsert: data.setupTasks.map((task) => ({
          where: { id: task.id },            // Use each task's `id` for identification
          update: { completed: task.completed,
            name: task.name,
            description: task.description
           },
          create: {
            id: task.id,                     // Explicitly provide `id` for creation if task doesn't exist
            description: task.description,
            completed: task.completed,
            name: task.name
          }
        }))
      }
    };
    console.log("UPDATED DATA: ", updateData);
    const initialSetup = await InitialSetup.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    res.status(200).json(initialSetup);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};



exports.deleteInitialSetup = async (req, res) => {
  const { id } = req.params;
  try {
    // First, delete associated setup tasks
    await InitialSetupTask.deleteMany({
      where: { initialSetupId: parseInt(id) }
    });

    // Then, delete the InitialSetup
    await InitialSetup.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getInitialSetupsByUser = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid resource ID' });
  }

  try {
    const initialSetup = await InitialSetup.findUnique({
      where: { resourceId: Number(id) },
      include: {
        setupTasks: true,
      },
    });

    if (!initialSetup) {
      return res.status(404).json({ error: 'Initial setup not found' });
    }

    res.status(200).json(initialSetup);
  } catch (error) {

    console.error('Error fetching initial setup:', error);

    res.status(500).json({ error: 'An error occurred while fetching initial setup' });
  }
};
