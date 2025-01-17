const bcrypt = require('bcryptjs')
module.exports = {
    register: async (req,res) => {
       
        const db = req.app.get('db')
        const {username, password, isAdmin} = req.body

        const result = await db.get_user([username])
        //{} is the name of the variable [] this refers to the $1 in order 
        // SQL queries come back as an array so we need to get the first one
        let existingUser = result[0]
        if (existingUser){
            return res.status(409).send({message: 'username is already in use!'})
        }

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        const registeredUser = await db.register_user([isAdmin, username, hash])
        let user = registeredUser[0]
        //here we will set req.session.user to an object with properties isAdmin, id, and username, equal to user.is_admin, user.id, and user.username.
        req.session.user = {id: user.cust_id, username: user.username, isAdmin: user.is_admin}
        res.status(201).send(req.session.user)
    },

    login: async (req, res) => {
        const { username, password } = req.body;
        const foundUser = await req.app.get('db').get_user([username]);
        const user = foundUser[0];
        if (!user) {
          return res.status(401).send('User  not found. Please register as a new user before logging in.');
        }
        const isAuthenticated = bcrypt.compareSync(password, user.hash);
        if (!isAuthenticated) {
          return res.status(403).send('Incorrect password');
        }
        req.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username };
        return res.send(req.session.user);
      },
      logout: (req, res) => {
        req.session.destroy();
        return res.sendStatus(200);
      }
}