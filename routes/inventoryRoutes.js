const express = require('express')
const router = express.Router()
const inventoriesController = require('../controllers/inventoriesController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)
router.route('/')
    .get(inventoriesController.getAllInventories)
    .post(inventoriesController.createNewInventory)
    .patch(inventoriesController.updateInventory)
    .delete(inventoriesController.deleteInventory)

module.exports = router