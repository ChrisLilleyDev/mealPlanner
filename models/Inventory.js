const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const inventorySchema = new mongoose.Schema(
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
    contents: [{
      meal: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Meal'
      },
      remainingUses: {
        type: Number,
        required: true
      },
      nextResetDate: {
        type: Date,
        required: true
      },
      nextUseDate: {
        type: Date,
        required: true
      }
    }]
  },
  {
    timestamps: true
  }
)

inventorySchema.plugin(AutoIncrement, {
  inc_field: 'inventory',
  id: 'inventoryId',
  start_seq: 1
})

module.exports = mongoose.model('Inventory', inventorySchema)