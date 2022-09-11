const User = require('../models/userModel')

const resolver = {
  Query : {
    users: async () => await User.find(),
    // user: (_, args) => users.find( user => user.id === args.userId )
    user: async(_, args) => await User.findById(args.userId)
  },

  Mutation: {
  	signup: async (_, args) => {
  		// args.input comes from typeDefs > Mutation. singup(input: ...)
  		const user = await User.create(args.input)
  		return user
  	}
  },

  // User: {
  // 	tasks: (parent) => tasks.filter( task => task.userId === parent.id)
  // },


}
module.exports = resolver



/* Client Request
query getUsers {
  users {
    id
    name
    email
  }
}

query getUserById {
  user(userId: "631dadafcea963f202119466") {
    id
    name
    email,

  }
}

mutation signup {
  signup(input: {
    name: "riajul islam",
    email: "abc@gmail.com",
    password: "asdfasdf",
    confirmPassword: "asdfasdf"
  }) {
    id
    name
    email
  }
}


*/
