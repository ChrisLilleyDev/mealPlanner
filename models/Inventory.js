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
    content: [{
      meal: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Meal'
      },
      maxOccurance: {
        type: Number,
        required: true
      },
      timeReset: {
        type: Number,
        required: true
      },
      shorttermAdj: {
        type: Number,
        required: true
      },
      remainingUses: {
        type: Number,
        required: true
      },
      cooldown: {
        type: Number,
        default: 0
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