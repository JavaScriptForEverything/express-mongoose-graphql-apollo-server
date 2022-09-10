const { users, tasks } = require('../data/demo')

const resolver = {
  Query : {
    tasks: () => tasks,
    task: (_, args) => tasks.find( task => task.id === args.taskId ),
  },

  Task: {
		user: ( parent ) => users.find(user => user.id === parent.userId )
  },

  Mutation: {
  	createTask: (_, args) => {
  		const task = { ...args.input, id: Date.now() } 		// add id which is required field
  		tasks.push(task) 																	// add task into tasks array

  		return task 																			// finally return modified task as response
  	}
  },

}
module.exports = resolver
