require('dotenv').config()
const express = require('express') 
const session = require('express-session')
const massive = require('massive')
const PORT = 4000
const {CONNECTION_STRING, SESSION_SECRET} = process.env
const authCtrl = require('./controllers/authController')

const app = express()

app.use(express.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }))

  //Endpoints
  app.post('/auth/register', authCtrl.register) // register
  

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    app.listen(PORT, () => console.log(`Now listening on the following port: ${PORT}`))
}).catch(err => {
    console.log(`Dang couldn't connect to the db.`, err)
})

