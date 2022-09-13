const { Schema, model, models } = require('mongoose')
const { isEmail } = require('validator')
const bcryptjs = require('bcryptjs')

/*
{
	name: 'riajul islam',
	email: 'abc@gmail.com',
	password: 'asdfasdf',
	confirmPassword: 'asdfasdf'
}
*/

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minLength: 3
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		validate: isEmail
	},
	password: {
		type: String,
		required: true,
	},
	confirmPassword: {
		type: String,
		required: true,
		validate: function (confirmPassword) { return this.password === confirmPassword }
	},

	// tasks: [{
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Task'
	// }]

}, {
	timestamps: true,
	// toJSON: { virtuals: true } 		// Step-1: Enable Virtual Property
})


// // Step-2: Add Virtual property
// userSchema.vertual('tasks', {
// 	ref: 'Task',
// 	foreignField: 'user', 			// user => userId
// 	localField: '_id'
// })

// // Step-3: populate
// userSchema.pre(/find*/, function(next) {
// 	this.populate({
// 		// path: Task,
// 		path: 'tasks',
// 	})

// 	next()
// })


userSchema.pre('save', async function(next) {
	if( !this.isModified('password') ) return

	this.password = await bcryptjs.hash(this.password, 12)
	this.confirmPassword = undefined

	next()
})

module.exports = models.User ||  model('User', userSchema)
