const express = require('express')
const router = express.Router()
const ingredientsController = require('../controllers/ingredientsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)
router.route('/')
    .get(ingredientsController.getAllIngredients)
    .post(ingredientsController.createNewIngredient)
    .patch(ingredientsController.updateIngredient)
    .delete(ingredientsController.deleteIngredient)

module.exports = router