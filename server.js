require('dotenv').config()
const { connection } = require('mongoose')
const database = require('./models/database')
const { app, apolloServer } = require('./app')

const PORT = process.env.PORT || 5000
app.listen(PORT, async() => {
	await database()

	console.log(`api server running with database: http://${connection.host}:${PORT}${apolloServer.graphqlPath}`)
})

