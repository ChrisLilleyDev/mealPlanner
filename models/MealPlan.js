const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const mealPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    size: {
      type: Number,
      default: 7
    },
    constraints: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Constraints'
    }],
    inventory: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Inventory'
    },
    history: [[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal'
    }]],
    current: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Meal'
    }]
  },
  {
    timestamps: true
  }
)

mealPlanSchema.plugin(AutoIncrement, {
  inc_field: 'mealPlan',
  id: 'mealPlanId',
  start_seq: 1
})

module.exports = mongoose.model('MealPlan', mealPlanSchema)