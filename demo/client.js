const axios = require('axios')
axios.defaults.baseURL = 'http://localhost:5000'

const url = 'http://localhost:5000/graphql'
// const url = '/graphql'

// axios({
// 	method: 'POST',
// 	headers: { 'Content-Type': 'application/json' },
// 	url,
// 	data: {
// 		query: `
// 			mutation ($email: String!, $password: String!) {
// 			  login(input: {
// 			    email: $email,
// 			    password: $password
// 			  }) {
// 			    token
// 			  }
// 			}

// 		`,
// 		variables: {
// 		  "email" 		: "abc@gmail.com",
//   		"password" 	: "asdfasdf"

// 		}
// 	}
// })
// .then(res => console.log(res.data) )




// axios({
// 	method: 'POST',
// 	headers: { 'Content-Type': 'application/json' },
// 	url,
// 	data: {
// 		query: `
// 			mutation {
// 			  login(input: {
// 			    email: "abc@gmail.com",
// 			    password: "asdfasdf"
// 			  }) {
// 			    token
// 			  }
// 			}

// 		`,
// 	}
// })
// .then(res => console.log(res.data) )
// .catch((err) => console.log(err.message))



const getLogedInUser = async () => {
	const data = {
		query: `
			mutation ($email: String!, $password: String!) {
			  login(input: { email: $email, password: $password }) {
			    token
			  }
			}
		`,
		variables: {
		  "email" 		: "abc@gmail.com",
			"password" 	: "asdfasdf"
		}
	}

	const res = await axios.post(url, data)
	console.log(res.data)
}
getLogedInUser()
