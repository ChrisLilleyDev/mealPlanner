const User = require('../models/User')
const PlanTemplate = require('../models/PlanTemplate')
const asyncHandler = require('express-async-handler')

// @desc Get all planTemplates
// @route GET /planTemplates
// @access Private
const getAllPlanTemplates = asyncHandler(async (req, res) => {
  const planTemplates = await PlanTemplate.find().lean().exec()
  if (!planTemplates?.length) {
    return res.status(400).json({ message: 'No planTemplates found' })
  }
  res.json(planTemplates)
})

// @desc Create new planTemplate
// @route POST /planTemplates
// @access Private
const createNewPlanTemplate = asyncHandler(async (req, res) => {
  const { user, name, size, constraints } = req.body

  // Confirm data
  if (!user || !name) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Check user is valid
  const userCheck = await User.findById(user).exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Check for duplicate name
  const duplicate = await PlanTemplate.find({ user }).findOne({ name }).lean().exec()

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate planTemplate' })
  }

  const planTemplateObject = { user, name, constraints, size }

  // Create and store new planTemplate
  const planTemplate = await PlanTemplate.create(planTemplateObject)

  if (planTemplate) { //created 
    res.status(201).json({ message: `New planTemplate ${name} created` })
  } else {
    res.status(400).json({ message: 'Invalid planTemplate data received' })
  }
})

// @desc Update a planTemplate
// @route PATCH /planTemplates
// @access Private
const updatePlanTemplate = asyncHandler(async (req, res) => {
  const { user, id, name, active, size, constraints } = req.body

  // Confirm data 
  if (!user || !id || !name || typeof active !== 'boolean' || !Array.isArray(constraints) || !size) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Does the user exist?
  const userCheck = await User.findById(user).lean().exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Does the planTemplate exist?
  const planTemplate = await PlanTemplate.findById(id).exec()

  if (!planTemplate) {
    return res.status(400).json({ message: 'PlanTemplate not found' })
  }

  // Check for duplicate 
  const duplicate = await PlanTemplate.find({ user }).findOne({ name }).lean().exec()

  // Allow updates to the original planTemplate
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate planTemplate name' })
  }

  planTemplate.name = name
  planTemplate.active = active
  planTemplate.constraints = constraints
  planTemplate.size = size
  
  const updatedPlanTemplate = await planTemplate.save()

  res.json({ message: `${updatedPlanTemplate.name} updated` })
})

// @desc Delete a planTemplate
// @route DELETE /planTemplates
// @access Private
const deletePlanTemplate = asyncHandler(async (req, res) => {
  const { user, id } = req.body

  // Confirm data
  if (!user || !id) {
    return res.status(400).json({ message: 'User ID and PlanTemplate ID Required' })
  }

  // Does the user exist?
  const userCheck = await User.findById(user).lean().exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Does the planTemplate exist?
  const planTemplate = await PlanTemplate.findById(id).exec()

  if (!planTemplate) {
    return res.status(400).json({ message: 'PlanTemplate not found' })
  }

  // Is the planTemplate in any plans?
  // const planTemplate = await PlanTemplate.findOne({ user: id }).lean().exec()
  // if (planTemplate) {
  //   return res.status(400).json({ message: 'User has assigned planTemplates' })
  // }

  const result = await planTemplate.deleteOne()

  const reply = `PlanTemplate ${result.name} with ID ${result._id} deleted`

  res.json(reply)
})

module.exports = {
  getAllPlanTemplates,
  createNewPlanTemplate,
  updatePlanTemplate,
  deletePlanTemplate
}