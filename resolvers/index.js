const { GraphQLDateTime } = require('graphql-iso-date')

const taskResolver = require('./task')
const userResolver = require('./user')

const customDateScalarResolver = {
	Date: GraphQLDateTime
}

module.exports = [
	userResolver,
	taskResolver,
	customDateScalarResolver
]
