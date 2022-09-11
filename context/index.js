const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// though here no async called, still make it async so that apolloServer.context don't have to wait
exports.verifyToken = async (req) => {
	const token = req.headers.authorization?.split(' ').pop()
	if(!token) return new Error('Access deined!, invalid Token',)

	const { id } = jwt.verify(token, process.env.TOKEN_SECRET)
	const user = await User.findById(id)

	req.user = user
}
