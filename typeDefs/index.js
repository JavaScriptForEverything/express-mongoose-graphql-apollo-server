const { gql } = require('apollo-server-express')
const taskTypeDefs = require('./task')
const userTypeDefs = require('./user')

const typeDefs = gql`
	type Query {
		_: String 			# Any Schema can't be empty so add a dummy field,
	}

	type Mutation {
		_: String 			# ...

	}
`


module.exports = [ typeDefs, taskTypeDefs, userTypeDefs ]
