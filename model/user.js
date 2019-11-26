const db = require('./db');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const config = require('../config');

const validator = require('validator');


/** User login Handler **/

const signIn = (req, res) => {

  const { email, password } = req.body;

  if (typeof(email) == "undefined" || typeof(password) == "undefined"){

    return res.status(403).json({
                                  status: "error",
                                
                                  error : "Enter your email and password"

                                });

  }

  db.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
    
    if (error) {

      return res.status(500).json({ 
                                    status: "error",
                                    
                                    data : error

                                  });
    }
    else if (results.rows.length == 0){

      return res.status(403).json({
                                    status: "error",
                                  
                                    error : "Account does not exist"

                                  });


    }
    else if (!bcrypt.compareSync(password, results.rows[0].password)){

    	return res.status(403).json({
                                    status: "error",
                                  
                                    error : "Incorrect email or password"

                                  });
    }
    else{

      let email = results.rows[0].email;

      let userId = results.rows[0].id;

      const token = jwt.sign({ email, userId }, config.jwtKey, 
        
                      { algorithm: 'HS256', expiresIn: config.jwtExpire});

    	res.status(200).json({
                              status: "success",
                              
                              data : {
                                      token : token,
                                      
                                      userId : results.rows[0].id	
                                    }
                            });
    }
  })
}

/** Create New User handler **/

const createUser = (req, res) => {

  /* Confirm request is from Admin */
/*
  if (req.userData.userId != 1){

    return res.status(403).json({
                                  status: "error",
                                
                                  error : "Only admin can create a user"

                                });
  }
*/
  const { email, firstName,  lastName, password, gender, jobRole, department, address } = req.body;

  /* Confirm all required fields are passed */

  if (typeof(email) == "undefined" || typeof(firstName) == "undefined" 
  
    || typeof(lastName) == "undefined" || typeof(password) == "undefined" 
      
    || typeof(gender) == "undefined" || typeof(jobRole) == "undefined" 
      
    || typeof(department) == "undefined" || typeof(address) == "undefined"){

    return res.status(403).json({
                                  status: "error",
                                
                                  error : "One or more field required"

                                });
  }

  /* Validate Entries */

  if (!validator.isEmail(email)){

    return res.status(403).json({
                                  status: "error",
                                
                                  error : "Enter a valid email address"

                                });
  }
  else if (firstName == "" || lastName == "" || password == "" || gender == "" 
  
            || jobRole == "" || department == "" || address == ""){

            return res.status(403).json({
                                          status: "error",
                                        
                                          error : "firstName, lastName, password, gender, jobRole, department and address can not be empty"

                                        });
  }

  /* Confirm if email already exist */
  
  db.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
    
    if (error) {

      return res.status(500).json({ 
                                    status: "error",
                                    
                                    error : error

                                  });
    }
    else if (results.rows.length > 0){

      return res.status(403).json({
                                    status: "error",
                                  
                                    error : "Email Address already in use"

                                  });
    }
    else{

      let hash = bcrypt.hashSync(password, 10);

      /* Insert new user information to the database */

      db.query('INSERT INTO users (email, firstname,  lastname, password, gender, jobrole, department, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
      
        [email, firstName,  lastName, hash, gender, jobRole, department, address], 
        
        (error, results) => {
        
        if (error) {

          return res.status(500).json({ 
                                        status: "errorx",
                                        
                                        error : error

                                      });
        }
        else{

          /* Retrieve the user data with the id */

          db.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {

            /* Generate a token */

            let email = results.rows[0].email;
      
            let userId = results.rows[0].id;
      
            const token = jwt.sign({ email, userId }, config.jwtKey, 
                    
                                    { algorithm: 'HS256', expiresIn: config.jwtExpire});
            
            res.status(200).json({
                                    status: "success",

                                    "data" : {
                                                "message": "User account successfully created",
                                              
                                                "token" : token,
                                              
                                                "userId": results.rows[0].id,
                                              
                                                "email": results.rows[0].email
                                              }                                      
                                  });
          });
        }        
      })        
    }
  })
}






const updateUser = (req, res) => {
  const id = parseInt(req.params.id)
  const { name, email } = req.body

  db.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const getUsers = (req, res) => {

  db.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {    

    if (error) {

      res.status(500).json({ 
    								status: "error",
									
									data : error

								});
    }
    else{

    	res.status(200).json( {
    								status: "success",
									
									data : results.rows

								});
    }
  })
}

const getUserById = (req, res) => {

  const id = parseInt(req.params.id)

  db.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}


const deleteUser = (req, res) => {
  const id = parseInt(req.params.id)

  db.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
                    signIn,
                    getUsers,
                    getUserById,
                    createUser,
                    updateUser,
                    deleteUser,
                };