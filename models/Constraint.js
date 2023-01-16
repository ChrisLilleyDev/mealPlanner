const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const constraintSchema = new mongoose.Schema(
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
    ingredients: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Ingredient'
    }],
    maxOccurance: {
      type: Number,
      required: true
    },
    shorttermAdj: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)

constraintSchema.plugin(AutoIncrement, {
  inc_field: 'constraint',
  id: 'constraintId',
  start_seq: 1
})

module.exports = mongoose.model('Constraint', constraintSchema)