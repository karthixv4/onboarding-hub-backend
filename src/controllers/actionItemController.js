const { ActionItem } = require('../models/prismaClient');
const { z } = require('zod');

const actionItemSchema = z.object({
  ktPlanId: z.number().int().nonnegative(),
  description: z.string(),
  completed: z.boolean().optional().default(false)
});

exports.createActionItem = async (req, res) => {
  try {
    const data = actionItemSchema.parse(req.body);

    const actionItem = await ActionItem.create({
      data
    });

    res.status(201).json(actionItem);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

exports.getAllActionItems = async (req, res) => {
  try {
    const actionItems = await ActionItem.findMany({
      include: { ktPlan: true }  // Include related KTPlan
    });
    res.status(200).json(actionItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActionItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const actionItem = await ActionItem.findUnique({
      where: { id: parseInt(id) },
      include: { ktPlan: true }
    });

    if (!actionItem) {
      return res.status(404).json({ error: 'Action Item not found' });
    }

    res.status(200).json(actionItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateActionItem = async (req, res) => {
  const { id } = req.params;
  try {
    const data = actionItemSchema.partial().parse(req.body);

    const actionItem = await ActionItem.update({
      where: { id: parseInt(id) },
      data
    });

    res.status(200).json(actionItem);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

exports.deleteActionItem = async (req, res) => {
  const { id } = req.params;
  try {
    await ActionItem.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
