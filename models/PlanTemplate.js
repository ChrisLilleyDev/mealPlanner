const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const planTemplateSchema = new mongoose.Schema(
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
    size: {
      type: Number,
      required: true
    },
    constraints: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Constraint'
    }]
  },
  {
    timestamps: true
  }
)

planTemplateSchema.plugin(AutoIncrement, {
  inc_field: 'planTemplate',
  id: 'planTemplateId',
  start_seq: 1
})

module.exports = mongoose.model('PlanTemplate', planTemplateSchema)