const express = require('express')
const router = express.Router()
const planTemplatesController = require('../controllers/planTemplatesController')

router.route('/')
    .get(planTemplatesController.getAllPlanTemplates)
    .post(planTemplatesController.createNewPlanTemplate)
    .patch(planTemplatesController.updatePlanTemplate)
    .delete(planTemplatesController.deletePlanTemplate)

module.exports = router