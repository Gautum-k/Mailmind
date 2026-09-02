const mongoose = require('mongoose');
const Template = require('../models/Template');

const devTemplates = [
  {
    _id: 'tpl-1',
    name: 'Follow-up Call Request',
    subject: 'Following up on our conversation',
    body: 'Hi {{name}},\n\nThank you for your time earlier. I wanted to follow up on our discussion and see if you have any questions.\n\nBest regards,\n[Your Name]',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'tpl-2',
    name: 'Meeting Reschedule',
    subject: 'Rescheduling our upcoming meeting',
    body: 'Hi {{name}},\n\nApologies for the inconvenience, but I need to reschedule our upcoming meeting. Could we move it to tomorrow at 2 PM?\n\nThank you for understanding,\n[Your Name]',
    createdAt: new Date().toISOString(),
  }
];

// @desc    Get user email templates
// @route   GET /api/templates
// @access  Private
const getTemplates = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const templates = await Template.find({ user: req.user.id }).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: templates.length,
        data: templates,
      });
    }

    res.status(200).json({
      success: true,
      count: devTemplates.length,
      data: devTemplates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create template
// @route   POST /api/templates
// @access  Private
const createTemplate = async (req, res, next) => {
  try {
    const { name, subject, body } = req.body;
    if (!name || !body) {
      return res.status(400).json({
        success: false,
        message: 'Template name and body are required.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const template = await Template.create({
        user: req.user.id,
        name,
        subject: subject || '',
        body,
      });

      return res.status(201).json({
        success: true,
        data: template,
      });
    }

    const tpl = {
      _id: `tpl-${Date.now()}`,
      user: req.user.id,
      name,
      subject: subject || '',
      body,
      createdAt: new Date().toISOString(),
    };
    devTemplates.unshift(tpl);

    res.status(201).json({
      success: true,
      data: tpl,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private
const deleteTemplate = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const template = await Template.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Template deleted successfully.',
      });
    }

    const index = devTemplates.findIndex(t => t._id === req.params.id);
    if (index !== -1) {
      devTemplates.splice(index, 1);
    }

    res.status(200).json({
      success: true,
      message: 'Template deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTemplates,
  createTemplate,
  deleteTemplate,
};
