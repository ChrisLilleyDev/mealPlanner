const express = require('express')
const router = express.Router()
const mealsController = require('../controllers/mealsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)
router.route('/')
    .get(mealsController.getAllMeals)
    .post(mealsController.createNewMeal)
    .patch(mealsController.updateMeal)
    .delete(mealsController.deleteMeal)

module.exports = router