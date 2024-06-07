const User = require('../models/User')
const Inventory = require('../models/Inventory')
const asyncHandler = require('express-async-handler')

// @desc Get all inventories
// @route GET /inventories
// @access Private
const getAllInventories = asyncHandler(async (req, res) => {
  const { user } = req.userInfo
  const inventories = await Inventory.find({ user }).lean().exec()
  if (!inventories?.length) {
    return res.status(400).json({ message: 'No inventories found' })
  }
  res.json(inventories)
})

// @desc Create new inventory
// @route POST /inventories
// @access Private
const createNewInventory = asyncHandler(async (req, res) => {
  const { user } = req.userInfo
  const { name, contents } = req.body

  // Confirm data
  if (!name || !Array.isArray(contents) || !contents.length) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Check user is valid
  const userCheck = await User.findById(user).exec()

  if (!userCheck) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Check for duplicate name
  const duplicate = await Inventory.find({ user }).findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate inventory' })
  }

  const inventoryObject = { user, name, contents }

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
  const { user } = req.userInfo
  const { id, name, active, contents } = req.body

  // Confirm data 
  if (!id || !name || typeof active !== 'boolean' || !Array.isArray(contents) || !contents.length) {
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
  const duplicate = await Inventory.find({ user }).findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

  // Allow updates to the original inventory
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate inventory name' })
  }

  inventory.name = name
  inventory.active = active
  inventory.contents = contents

  const updatedInventory = await inventory.save()

  res.json({ message: `${updatedInventory.name} updated` })
})

// @desc Update an inventories contents
const updateInventoryContents = asyncHandler(async (req, res) => {
  const id = req.body.inventory
  const contents = req.body.updatedContents

  // Confirm data 
  if (!id || !Array.isArray(contents) || !contents.length) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Does the inventory exist?
  const inventory = await Inventory.findById(id).exec()

  if (!inventory) {
    return res.status(400).json({ message: 'Inventory not found' })
  }

  inventory.contents = contents

  const updatedInventory = await inventory.save()

  res.json({ message: `${updatedInventory.name} updated` })
})

// @desc Delete a inventory
// @route DELETE /inventories
// @access Private
const deleteInventory = asyncHandler(async (req, res) => {
  const { user } = req.userInfo
  const { id } = req.body

  // Confirm data
  if (!id) {
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
  updateInventoryContents,
  deleteInventory
}