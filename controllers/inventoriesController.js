const User = require('../models/User')
const Inventory = require('../models/Inventory')
const asyncHandler = require('express-async-handler')

// @desc Get all inventories
// @route GET /inventories
// @access Private
const getAllInventories = asyncHandler(async (req, res) => {
  const inventories = await Inventory.find().lean().exec()
  if (!inventories?.length) {
    return res.status(400).json({ message: 'No inventories found' })
  }
  res.json(inventories)
})

// @desc Create new inventory
// @route POST /inventories
// @access Private
const createNewInventory = asyncHandler(async (req, res) => {
  const { user, name, content } = req.body

  // Confirm data
  if (!user || !name || !Array.isArray(content) || !content.length) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Check user is valid
  const userCheck = await User.findById(user).exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Check for duplicate name
  const duplicate = await Inventory.find({ user }).findOne({ name }).lean().exec()

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate inventory' })
  }

  const inventoryObject = { user, name, content }

  // Create and store new inventory
  const inventory = await Inventory.create(inventoryObject)

  if (inventory) { //created 
    res.status(201).json({ message: `New inventory ${name} created` })
  } else {
    res.status(400).json({ message: 'Invalid inventory data received' })
  }
})

// @desc Update a inventory
// @route PATCH /inventories
// @access Private
const updateInventory = asyncHandler(async (req, res) => {
  const { user, id, name, active, content } = req.body

  // Confirm data 
  if (!user || !id || !name || typeof active !== 'boolean' || !Array.isArray(content) || !content.length) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Does the user exist?
  const userCheck = await User.findById(user).lean().exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Does the inventory exist?
  const inventory = await Inventory.findById(id).exec()

  if (!inventory) {
    return res.status(400).json({ message: 'Inventory not found' })
  }

  // Check for duplicate 
  const duplicate = await Inventory.find({ user }).findOne({ name }).lean().exec()

  // Allow updates to the original inventory
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate inventory name' })
  }

  inventory.name = name
  inventory.active = active
  inventory.content = content

  const updatedInventory = await inventory.save()

  res.json({ message: `${updatedInventory.name} updated` })
})

// @desc Delete a inventory
// @route DELETE /inventories
// @access Private
const deleteInventory = asyncHandler(async (req, res) => {
  const { user, id } = req.body

  // Confirm data
  if (!user || !id) {
    return res.status(400).json({ message: 'User ID and Inventory ID Required' })
  }

  // Does the user exist?
  const userCheck = await User.findById(user).lean().exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Does the inventory exist?
  const inventory = await Inventory.findById(id).exec()

  if (!inventory) {
    return res.status(400).json({ message: 'Inventory not found' })
  }

  // Is the inventory in any plans?
  // const inventory = await Inventory.findOne({ user: id }).lean().exec()
  // if (inventory) {
  //   return res.status(400).json({ message: 'User has assigned inventories' })
  // }

  const result = await inventory.deleteOne()

  const reply = `Inventory ${result.name} with ID ${result._id} deleted`

  res.json(reply)
})

module.exports = {
  getAllInventories,
  createNewInventory,
  updateInventory,
  deleteInventory
}