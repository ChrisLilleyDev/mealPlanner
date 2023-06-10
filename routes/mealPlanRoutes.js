const express = require('express')
const router = express.Router()
const mealPlansController = require('../controllers/mealPlansController')

router.route('/')
    .get(mealPlansController.getAllMealPlans)
    .post(mealPlansController.createNewMealPlan)
    .patch(mealPlansController.updateMealPlan)
    .delete(mealPlansController.deleteMealPlan)

module.exports = router