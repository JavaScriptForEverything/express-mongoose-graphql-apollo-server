const { Schema, model, models } = require('mongoose')

/*
{
	name : 'task 1',
	completed : true,
	user: '2983741234abcd293452af'
}

*/

const taskSchema = new Schema({
	name: {
		type: String,
		unique: true,
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
