const { connect, connection } = require('mongoose')

module.exports = () => {
	if(connection.readyState >= 1) return

	return connect(process.env.DB_LOCAL_URL)
	.catch(err => console.log(`Database Connection failed: ${err.message}`))
}
