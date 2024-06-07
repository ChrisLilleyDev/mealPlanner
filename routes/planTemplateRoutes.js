const express = require('express')
const router = express.Router()
const planTemplatesController = require('../controllers/planTemplatesController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)
router.route('/')
    .get(planTemplatesController.getAllPlanTemplates)
    .post(planTemplatesController.createNewPlanTemplate)
    .patch(planTemplatesController.updatePlanTemplate)
    .delete(planTemplatesController.deletePlanTemplate)

module.exports = router