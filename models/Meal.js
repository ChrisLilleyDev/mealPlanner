const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const mealSchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

mealSchema.plugin(AutoIncrement, {
  inc_field: 'meal',
  id: 'mealId',
  start_seq: 1
})

module.exports = mongoose.model('Meal', mealSchema)