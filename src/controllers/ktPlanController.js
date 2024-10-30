const { kTPlan } = require('../models/prismaClient');
const { z } = require('zod');

// Zod schema for KT Plan validation
const ktPlanSchema = z.object({
  resourceId: z.number().int().nonnegative(),
  progress: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  name: z.string().optional(),  // New field
  remarks: z.string().optional() // New field
});

// Create a new KT Plan
exports.createKTPlan = async (req, res) => {
  try {
    const data = ktPlanSchema.parse(req.body);

    const ktPlan = await kTPlan.create({
      data
    });

    res.status(201).json(ktPlan);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

// Get all KT Plans
exports.getAllKTPlans = async (req, res) => {
  try {
    const ktPlans = await kTPlan.findMany({
      include: { actionItems: true }  // Include related ActionItems
    });
    res.status(200).json(ktPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single KT Plan by ID
exports.getKTPlanById = async (req, res) => {
  const { id } = req.params;
  try {
    const ktPlan = await kTPlan.findUnique({
      where: { id: parseInt(id) },
      include: { actionItems: true }
    });

    if (!ktPlan) {
      return res.status(404).json({ error: 'KT Plan not found' });
    }

    res.status(200).json(ktPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a KT Plan
exports.updateKTPlan = async (req, res) => {
  const { id } = req.params;
  try {
    const data = ktPlanSchema.partial().parse(req.body);
    console.log("KT PLAN DATA: ", data);

    const ktPlan = await kTPlan.update({
      where: { id: parseInt(id) },
      data
    });

    res.status(200).json(ktPlan);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

// Delete a KT Plan
exports.deleteKTPlan = async (req, res) => {
  const { id } = req.params;
  try {
    await kTPlan.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
