const express = require('express')
const router = express.Router()
const constraintsController = require('../controllers/constraintsController')

router.route('/')
    .get(constraintsController.getAllConstraints)
    .post(constraintsController.createNewConstraint)
    .patch(constraintsController.updateConstraint)
    .delete(constraintsController.deleteConstraint)

module.exports = router