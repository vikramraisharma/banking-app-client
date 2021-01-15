const jwt = require('jsonwebtoken')
const {pool} = require('../db/connect')

const authMiddleware = async function (req, res, next){
    try {
        // assign value that saves the coded token from auth header key
        const token = req.header('Authorization').split(' ')[1];
        // decode token using secret from env config file
        const decoded = jwt.verify(token, process.env.secret);
        // query postgres database to select user information from database 
        const result = await pool.query(
            'select b.userid,b.first_name,b.last_name,b.email,t.access_token from bank_user b inner join tokens t on b.userid=t.userid where t.access_token=$1 and t.userid=$2;',
            [token, decoded.userid]
        );
        const user = result.rows[0];
        // only allows routes to call API if:
            // token can be selected from tokens table
            // matching userid and user info can be selected from bank_user table
        if(user){
            req.user = user;
            req.token = token;
            next();
            // once a route passes this middleware, it is allowed to call the API.
        } else {
            throw new Error("Error while authentication")
        };
    } catch (error) {
        res.status(400).send({
            auth_error: 'Authentication failed.'
        })
    }
};

module.exports = authMiddleware;