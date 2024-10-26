const { InitialSetup } = require('../models/prismaClient');
const { z } = require('zod');

// Zod schema for InitialSetup validation
const initialSetupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  userEmail: z.string().email("Invalid email format")
});

// Create a new InitialSetup
exports.createInitialSetup = async (req, res) => {
  try {
    const data = initialSetupSchema.parse(req.body);

    const initialSetup = await InitialSetup.create({
      data
    });

    res.status(201).json(initialSetup);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

// Get all InitialSetup entries
exports.getAllInitialSetups = async (req, res) => {
  try {
    const initialSetups = await InitialSetup.findMany({
      include: { user: true }  // Include related User information
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
      include: { user: true }
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
exports.updateInitialSetup = async (req, res) => {
  const { id } = req.params;
  try {
    const data = initialSetupSchema.partial().parse(req.body);

    const initialSetup = await InitialSetup.update({
      where: { id: parseInt(id) },
      data
    });

    res.status(200).json(initialSetup);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

// Delete an InitialSetup
exports.deleteInitialSetup = async (req, res) => {
  const { id } = req.params;
  try {
    await InitialSetup.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
