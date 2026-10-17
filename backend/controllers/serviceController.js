const createError = require('http-errors');
const Service = require('../models/service');

function formatService(service) {
  const data = service.toObject();

  data.id = data._id.toString();
  delete data._id;
  delete data.__v;

  return data;
}

async function addService(req, res, next) {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Service added successfully.',
      data: formatService(service)
    });
  } catch (error) {
    next(error);
  }
}

async function getAllServices(req, res, next) {
  try {
    const services = await Service.find();

    res.json({
      success: true,
      message: 'Services list retrieved successfully.',
      data: services.map(formatService)
    });
  } catch (error) {
    next(error);
  }
}

async function getServiceById(req, res, next) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return next(createError(404, 'Service not found.'));
    }

    res.json({
      success: true,
      message: 'Service retrieved successfully.',
      data: formatService(service)
    });
  } catch (error) {
    next(error);
  }
}

async function updateService(req, res, next) {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!service) {
      return next(createError(404, 'Service not found.'));
    }

    res.json({
      success: true,
      message: 'Service updated successfully.'
    });
  } catch (error) {
    next(error);
  }
}

async function deleteService(req, res, next) {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return next(createError(404, 'Service not found.'));
    }

    res.json({
      success: true,
      message: 'Service deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
};