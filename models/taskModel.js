const { Schema, model, models } = require('mongoose')

const taskSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minLength: 3
	},
	completed: {
		type: Boolean,
		default: false,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	}

}, {
	timestamps: true
})

module.exports = models.Task || model('Task', taskSchema)
