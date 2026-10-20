const createError = require('http-errors');
const Project = require('../models/project');

function formatProject(project) {
  const data = project.toObject();

  data.id = data._id.toString();
  delete data._id;
  delete data.__v;

  return data;
}

async function addProject(req, res, next) {
  try {
    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Project added successfully.',
      data: formatProject(project)
    });
  } catch (error) {
    next(error);
  }
}

async function getAllProjects(req, res, next) {
  try {
    const projects = await Project.find();

    res.json({
      success: true,
      message: 'Projects list retrieved successfully.',
      data: projects.map(formatProject)
    });
  } catch (error) {
    next(error);
  }
}

async function getProjectById(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(createError(404, 'Project not found.'));
    }

    res.json({
      success: true,
      message: 'Project retrieved successfully.',
      data: formatProject(project)
    });
  } catch (error) {
    next(error);
  }
}

async function updateProject(req, res, next) {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!project) {
      return next(createError(404, 'Project not found.'));
    }

    res.json({
      success: true,
      message: 'Project updated successfully.'
    });
  } catch (error) {
    next(error);
  }
}

async function deleteProject(req, res, next) {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return next(createError(404, 'Project not found.'));
    }

    res.json({
      success: true,
      message: 'Project deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
};