const createError = require('http-errors');
const Reference = require('../models/reference');

function formatReference(reference) {
  const data = reference.toObject();

  data.id = data._id.toString();
  delete data._id;
  delete data.__v;

  return data;
}

async function addReference(req, res, next) {
  try {
    const reference = await Reference.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Reference added successfully.',
      data: formatReference(reference)
    });
  } catch (error) {
    next(error);
  }
}

async function getAllReferences(req, res, next) {
  try {
    const references = await Reference.find();

    res.json({
      success: true,
      message: 'References list retrieved successfully.',
      data: references.map(formatReference)
    });
  } catch (error) {
    next(error);
  }
}

async function getReferenceById(req, res, next) {
  try {
    const reference = await Reference.findById(req.params.id);

    if (!reference) {
      return next(createError(404, 'Reference not found.'));
    }

    res.json({
      success: true,
      message: 'Reference retrieved successfully.',
      data: formatReference(reference)
    });
  } catch (error) {
    next(error);
  }
}

async function updateReference(req, res, next) {
  try {
    const reference = await Reference.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!reference) {
      return next(createError(404, 'Reference not found.'));
    }

    res.json({
      success: true,
      message: 'Reference updated successfully.'
    });
  } catch (error) {
    next(error);
  }
}

async function deleteReference(req, res, next) {
  try {
    const reference = await Reference.findByIdAndDelete(req.params.id);

    if (!reference) {
      return next(createError(404, 'Reference not found.'));
    }

    res.json({
      success: true,
      message: 'Reference deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addReference,
  getAllReferences,
  getReferenceById,
  updateReference,
  deleteReference
};