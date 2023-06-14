const User = require('../models/User')
const MealPlan = require('../models/MealPlan')
const asyncHandler = require('express-async-handler')

// @desc Get all mealPlans
// @route GET /mealPlans
// @access Private
const getAllMealPlans = asyncHandler(async (req, res) => {
  const mealPlans = await MealPlan.find().lean().exec()
  if (!mealPlans?.length) {
    return res.status(400).json({ message: 'No mealPlans found' })
  }
  res.json(mealPlans)
})

// @desc Create new mealPlan
// @route POST /mealPlans
// @access Private
const createNewMealPlan = asyncHandler(async (req, res) => {
  const { user, name, size, constraints, inventory, history, currentMeals } = req.body

  // Confirm data
  if (!user || !name || !inventory || !Array.isArray(currentMeals) || !currentMeals.length) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Check user is valid
  const userCheck = await User.findById(user).exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Check for duplicate name
  const duplicate = await MealPlan.find({ user }).findOne({ name }).lean().exec()

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate mealPlan' })
  }

  const mealPlanObject = { user, name, size, constraints, inventory, history, currentMeals }

  // Create and store new mealPlan
  const mealPlan = await MealPlan.create(mealPlanObject)

  if (mealPlan) { //created 
    res.status(201).json({ message: `New mealPlan ${name} created` })
  } else {
    res.status(400).json({ message: 'Invalid mealPlan data received' })
  }
})

// @desc Update a mealPlan
// @route PATCH /mealPlans
// @access Private
const updateMealPlan = asyncHandler(async (req, res) => {
  const { user, id, name, active, size, constraints, inventory, history, currentMeals } = req.body

  // Confirm data 
  if (!user || !id || !name || typeof active !== 'boolean' || !size || !inventory || !currentMeals) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Does the user exist?
  const userCheck = await User.findById(user).lean().exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Does the mealPlan exist?
  const mealPlan = await MealPlan.findById(id).exec()

  if (!mealPlan) {
    return res.status(400).json({ message: 'MealPlan not found' })
  }

  // Check for duplicate 
  const duplicate = await MealPlan.find({ user }).findOne({ name }).lean().exec()

  // Allow updates to the original mealPlan
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate mealPlan name' })
  }

  mealPlan.name = name
  mealPlan.active = active
  mealPlan.size = size
  mealPlan.constraints = constraints
  mealPlan.inventory = inventory
  mealPlan.history = history
  mealPlan.currentMeals = currentMeals

  const updatedMealPlan = await mealPlan.save()

  res.json({ message: `${updatedMealPlan.name} updated` })
})

// @desc Delete a mealPlan
// @route DELETE /mealPlans
// @access Private
const deleteMealPlan = asyncHandler(async (req, res) => {
  const { user, id } = req.body

  // Confirm data
  if (!user || !id) {
    return res.status(400).json({ message: 'User ID and MealPlan ID Required' })
  }

  // Does the user exist?
  const userCheck = await User.findById(user).lean().exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Does the mealPlan exist?
  const mealPlan = await MealPlan.findById(id).exec()

  if (!mealPlan) {
    return res.status(400).json({ message: 'MealPlan not found' })
  }

  // Is the mealPlan in any plans?
  // const mealPlan = await MealPlan.findOne({ user: id }).lean().exec()
  // if (mealPlan) {
  //   return res.status(400).json({ message: 'User has assigned mealPlans' })
  // }

  const result = await mealPlan.deleteOne()

  const reply = `MealPlan ${result.name} with ID ${result._id} deleted`

  res.json(reply)
})

module.exports = {
  getAllMealPlans,
  createNewMealPlan,
  updateMealPlan,
  deleteMealPlan
}
