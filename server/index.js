require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const { ApolloServer } = require('apollo-server-express')
const { typeDefs, resolvers } = require('./schema')
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env



const server = new ApolloServer({typeDefs, resolvers, context: async (req) =>  {
    
    const db = app.get('db')
    return {
        db: db
    }
}})

const app = express()
server.applyMiddleware({ app })
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

new Promise(resolve => app.listen({port: SERVER_PORT}, resolve))
console.log(`Apollo server running on http://localhost:${SERVER_PORT}${server.graphqlPath}`)

massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
})
    .then(db => {
        app.set('db', db)
        app.listen(4001, () => console.log(`Server is running on port 4001`))
    })
    .catch(err => console.log(err))
