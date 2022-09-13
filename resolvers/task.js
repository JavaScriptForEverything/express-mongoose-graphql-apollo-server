const User = require('../models/userModel')
const Task = require('../models/taskModel')


const resolver = {
  Query : {
    tasks: async (_, { skip, limit}) => {
    	const tasks = await Task.find().skip(skip).limit(limit).populate('user')
    	// const tasks = await Task.find().skip(skip).limit(limit) 		// instead of populate here override in fields
    	return tasks
    },
    task: async (_, { taskId }) => {
    	const task = await Task.findOne({ _id: taskId })

    	return {
    		...task,
    		id: task.id.toString()
    	}
    }
  },


  Mutation: {
  	createTask: async (_, { input }, { user }) => {
  		const task = await Task.create({ ...input, user: user.id }) 	// input { name: completed, user: ObjectId() }
  		return {
  			...task,
  			id: task.id.toString(),
  			name: task.name.toString(),
  		}


  	}
  },

  Task: {
		// user: async (_, __, { user }) => await User.findById(user.id)
  },
}
module.exports = resolver
