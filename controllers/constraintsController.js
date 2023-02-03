const User = require('../models/User')
const Constraint = require('../models/Constraint')
const asyncHandler = require('express-async-handler')

// @desc Get all constraints
// @route GET /constraints
// @access Private
const getAllConstraints = asyncHandler(async (req, res) => {
  const constraints = await Constraint.find().lean().exec()
  if (!constraints?.length) {
    return res.status(400).json({ message: 'No constraints found' })
  }
  res.json(constraints)
})

// @desc Create new constraint
// @route POST /constraints
// @access Private
const createNewConstraint = asyncHandler(async (req, res) => {
  const { user, name, ingredients, maxOccurance, shorttermAdj } = req.body

  // Confirm data
  if (!user || !name || !Array.isArray(ingredients) || !ingredients.length || !maxOccurance || !shorttermAdj) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Check user is valid
  const userCheck = await User.findById(user).exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Check for duplicate name
  const duplicate = await Constraint.find({ user }).findOne({ name }).lean().exec()

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate constraint' })
  }

  const constraintObject = { user, name, ingredients, maxOccurance, shorttermAdj }

  // Create and store new constraint
  const constraint = await Constraint.create(constraintObject)

  if (constraint) { //created 
    res.status(201).json({ message: `New constraint ${name} created` })
  } else {
    res.status(400).json({ message: 'Invalid constraint data received' })
  }
})

// @desc Update a constraint
// @route PATCH /constraints
// @access Private
const updateConstraint = asyncHandler(async (req, res) => {
  const { user, id, name, active, ingredients, maxOccurance, shorttermAdj } = req.body

  // Confirm data 
  if (!user || !id || !name || typeof active !== 'boolean' || !Array.isArray(ingredients) || !ingredients.length || !maxOccurance || !shorttermAdj) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Does the user exist?
  const userCheck = await User.findById(user).lean().exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Does the constraint exist?
  const constraint = await Constraint.findById(id).exec()

  if (!constraint) {
    return res.status(400).json({ message: 'Constraint not found' })
  }

  // Check for duplicate 
  const duplicate = await Constraint.find({ user }).findOne({ name }).lean().exec()

  // Allow updates to the original constraint
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate constraint name' })
  }

  constraint.name = name
  constraint.active = active
  constraint.ingredients = ingredients
  constraint.maxOccurance = maxOccurance
  constraint.shorttermAdj = shorttermAdj
  
  const updatedConstraint = await constraint.save()

  res.json({ message: `${updatedConstraint.name} updated` })
})

// @desc Delete a constraint
// @route DELETE /constraints
// @access Private
const deleteConstraint = asyncHandler(async (req, res) => {
  const { user, id } = req.body

  // Confirm data
  if (!user || !id) {
    return res.status(400).json({ message: 'User ID and Constraint ID Required' })
  }

  // Does the user exist?
  const userCheck = await User.findById(user).lean().exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Does the constraint exist?
  const constraint = await Constraint.findById(id).exec()

  if (!constraint) {
    return res.status(400).json({ message: 'Constraint not found' })
  }

  // Is the constraint in any plans?
  // const constraint = await Constraint.findOne({ user: id }).lean().exec()
  // if (constraint) {
  //   return res.status(400).json({ message: 'User has assigned constraints' })
  // }

  const result = await constraint.deleteOne()

  const reply = `Constraint ${result.name} with ID ${result._id} deleted`

  res.json(reply)
})

module.exports = {
  getAllConstraints,
  createNewConstraint,
  updateConstraint,
  deleteConstraint
}