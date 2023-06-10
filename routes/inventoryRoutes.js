const express = require('express')
const router = express.Router()
const inventoriesController = require('../controllers/inventoriesController')

router.route('/')
    .get(inventoriesController.getAllInventories)
    .post(inventoriesController.createNewInventory)
    .patch(inventoriesController.updateInventory)
    .delete(inventoriesController.deleteInventory)

module.exports = router