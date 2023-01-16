const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const ingredientSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true
  }
)

ingredientSchema.plugin(AutoIncrement, {
  inc_field: 'ingredient',
  id: 'ingredientId',
  start_seq: 1
})

module.exports = mongoose.model('Ingredient', ingredientSchema)