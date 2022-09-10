const { users, tasks } = require('../data/demo')

const resolver = {
  Query : {
    users: () => users,
    user: (_, args) => users.find( user => user.id === args.userId )
  },
  User: {
  	tasks: (parent) => tasks.filter( task => task.userId === parent.id)
  },


}
module.exports = resolver
