const User = require('../models/User')
const Ingredient = require('../models/Ingredient')
const asyncHandler = require('express-async-handler')

// @desc Get all ingredients
// @route GET /ingredients
// @access Private
const getAllIngredients = asyncHandler(async (req, res) => {
  const { user } = req.userInfo
  const ingredients = await Ingredient.find({ user }).lean().exec()
  if (!ingredients?.length) {
    return res.status(400).json({ message: 'No ingredients found' })
  }
  res.json(ingredients)
})

// @desc Create new ingredient
// @route POST /ingredients
// @access Private
const createNewIngredient = asyncHandler(async (req, res) => {
  const { user } = req.userInfo
  const { name } = req.body

  // Confirm data
  if (!name) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Check user is valid
  const userCheck = await User.findById(user).exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Check for duplicate name
  const duplicate = await Ingredient.find({ user }).findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate ingredient' })
  }

  const ingredientObject = { user, name }

  // Create and store new ingredient
  const ingredient = await Ingredient.create(ingredientObject)

  if (ingredient) { //created 
    res.status(201).json({ message: `New ingredient ${name} created` })
  } else {
    res.status(400).json({ message: 'Invalid ingredient data received' })
  }
})

// @desc Update a ingredient
// @route PATCH /ingredients
// @access Private
const updateIngredient = asyncHandler(async (req, res) => {
  const { user } = req.userInfo
  const { id, name, active } = req.body

  // Confirm data 
  if (!id || !name || typeof active !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Does the user exist?
  const userCheck = await User.findById(user).lean().exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Does the ingredient exist?
  const ingredient = await Ingredient.findById(id).exec()

  if (!ingredient) {
    return res.status(400).json({ message: 'Ingredient not found' })
  }

  // Check for duplicate 
  const duplicate = await Ingredient.find({ user }).findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

  // Allow updates to the original ingredient
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate ingredient name' })
  }

  ingredient.name = name
  ingredient.active = active

  const updatedIngredient = await ingredient.save()

  res.json({ message: `${updatedIngredient.name} updated` })
})

// @desc Delete a ingredient
// @route DELETE /ingredients
// @access Private
const deleteIngredient = asyncHandler(async (req, res) => {
  const { user } = req.userInfo
  const { id } = req.body

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: 'Ingredient ID Required' })
  }

  // Does the user exist?
  const userCheck = await User.findById(user).lean().exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Does the ingredient exist?
  const ingredient = await Ingredient.findById(id).exec()

  if (!ingredient) {
    return res.status(400).json({ message: 'Ingredient not found' })
  }

  // Is the ingredient in any plans?
  // const ingredient = await Ingredient.findOne({ user: id }).lean().exec()
  // if (ingredient) {
  //   return res.status(400).json({ message: 'User has assigned ingredients' })
  // }

  const result = await ingredient.deleteOne()

  const reply = `Ingredient ${result.name} with ID ${result._id} deleted`

  res.json(reply)
})

module.exports = {
  getAllIngredients,
  createNewIngredient,
  updateIngredient,
  deleteIngredient
}
