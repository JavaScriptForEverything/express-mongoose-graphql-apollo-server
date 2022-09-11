const { skip } = require('graphql-resolvers')


// same args as regular resolvers have
// exports.isAuthenticated = (_, __, { user }) => {
exports.protect = (_, __, { user }) => {
	if(!user) return new Error('Access deined!, Please login to continue')

	return skip 		// same as: 	next()
}
