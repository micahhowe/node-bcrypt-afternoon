require('dotenv').config()
const express = require('express') 
const session = require('express-session')
const massive = require('massive')
const PORT = 4000
const {CONNECTION_STRING, SESSION_SECRET} = process.env
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

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
  app.post('/auth/login', authCtrl.login)
  app.get('/auth/logout', authCtrl.logout);

  app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
  app.get('/api/treasure/user', treasureCtrl.getUserTreasure)
  app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
  app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    app.listen(PORT, () => console.log(`Now listening on the following port: ${PORT}`))
}).catch(err => {
    console.log(`Dang couldn't connect to the db.`, err)
})

