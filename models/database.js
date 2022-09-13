const { set, connect, connection } = require('mongoose')

module.exports = () => {
	if(connection.readyState >= 1) return

	set('debug', true) 	// print all the database query in console to test how many query hits
	return connect(process.env.DB_LOCAL_URL)
	.catch(err => console.log(`Database Connection failed: ${err.message}`))
}
