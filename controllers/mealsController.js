const User = require('../models/User')
const Meal = require('../models/Meal')
const asyncHandler = require('express-async-handler')

// @desc Get all meals
// @route GET /meals
// @access Private
const getAllMeals = asyncHandler(async (req, res) => {
    const { user } = req.userInfo
    const meals = await Meal.find({ user }).lean().exec()
    if (!meals?.length) {
        return res.status(400).json({ message: 'No meals found' })
    }
    res.json(meals)
})

// @desc Create new meal
// @route POST /meals
// @access Private
const createNewMeal = asyncHandler(async (req, res) => {
    const { user } = req.userInfo
    const { name, ingredients, description } = req.body

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
    const duplicate = await Meal.find({ user }).findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate meal' })
    }

    const mealObject = { user, name, description, ingredients }

    // Create and store new meal
    const meal = await Meal.create(mealObject)

    if (meal) { //created 
        res.status(201).json({ message: `New meal ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid meal data received' })
    }
})

// @desc Update a meal
// @route PATCH /meals
// @access Private
const updateMeal = asyncHandler(async (req, res) => {
    const { user } = req.userInfo
    const { id, name, active, ingredients, description, maxOccurance, timeReset, shorttermAdj } = req.body

    // Confirm data 
    if (!id || !name || typeof active !== 'boolean' || !maxOccurance || !timeReset || !shorttermAdj) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Does the user exist?
    const userCheck = await User.findById(user).lean().exec()

    if (!userCheck) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Does the meal exist?
    const meal = await Meal.findById(id).exec()

    if (!meal) {
        return res.status(400).json({ message: 'Meal not found' })
    }

    // Check for duplicate 
    const duplicate = await Meal.find({ user }).findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original meal
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate meal name' })
    }

    meal.name = name
    meal.active = active
    meal.ingredients = ingredients
    meal.description = description
    meal.maxOccurance = maxOccurance
    meal.timeReset = timeReset
    meal.shorttermAdj = shorttermAdj

    const updatedMeal = await meal.save()

    res.json({ message: `${updatedMeal.name} updated` })
})

// @desc Delete a meal
// @route DELETE /meals
// @access Private
const deleteMeal = asyncHandler(async (req, res) => {
    const { user } = req.userInfo
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Meal ID Required' })
    }

    // Does the user exist?
    const userCheck = await User.findById(user).lean().exec()

    if (!userCheck) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Does the meal exist?
    const meal = await Meal.findById(id).exec()

    if (!meal) {
        return res.status(400).json({ message: 'Meal not found' })
    }

    // Is the meal in any plans?
    // const meal = await Meal.findOne({ user: id }).lean().exec()
    // if (meal) {
    //   return res.status(400).json({ message: 'User has assigned meals' })
    // }

    const result = await meal.deleteOne()

    const reply = `Meal ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllMeals,
    createNewMeal,
    updateMeal,
    deleteMeal
}