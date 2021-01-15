const express = require('express')
const bcrypt = require('bcryptjs')
const { pool } = require('../db/connect')
const {
    validateUser,
    isInvalidField,
    generateAuthToken
} = require('../utils/common')
const authMiddleware = require('../middleware/auth')

const Router = express.Router()

Router.post('/signup', async (req, res) => {
    console.log('signup hit');
    try{
        console.log('try hit');
        const { first_name, last_name, email, password } = req.body;
        // console.log(req.body);
        const validFieldsToUpdate = [
            'first_name',
            'last_name',
            'email',
            'password'
        ];
        const receivedFields = Object.keys(req.body)

        const isInvalidFieldProvided = isInvalidField(
            receivedFields,
            validFieldsToUpdate
        )
        // console.log(isInvalidFieldProvided);
        if(isInvalidFieldProvided) {
            return res.status(400).send({
                signup_error: 'Invalid Field.'
            })
        }

        const result = await pool.query(
            'select count(*) as count from bank_user where email=$1',
            [email]
        )
        const count = result.rows[0].count;
        console.log(result.rows[0], count);
        if(count > 0){
            return res.status(400).send({
                signup_error: 'User with this email already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        await pool.query(
            'insert into bank_user(first_name, last_name, email, password) values($1,$2,$3,$4)',
            [first_name, last_name, email, hashedPassword]
        )
        res.status(201).send()
    } catch (error) {
        res.status(400).send({
            signup_error: 'Error while signing up... Please try again later.'
        })
    }
});

Router.post('/signin', async (req, res) => {
    console.log('sign in hit');
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = await validateUser(email, password);
        if(!user){
            res.status(400).send({
                signin_error: 'Email and password do not match, please try again.'
            })
        }
        const token = await generateAuthToken(user);
        const result = await pool.query(
            'insert into tokens(access_token, userid) values($1,$2) returning *',
            [token, user.userid]
        );
        if(!result.rows[0]){
            return res.status(400).send({
                signin_error: 'Error signing in, please try again.'
            })
        }

        user.token = result.rows[0].access_token;
        res.send(user);
    } catch (error) {
        res.status(400).send({
            signin_error: 'Email/password does not match.'
        })
    }
})

Router.post('/logout', authMiddleware, async (req, res) => {
    try {
        const { userid, access_token } = req.user;
        await pool.query('DELETE FROM tokens WHERE userid=$1 AND access_token=$2', [
            userid, 
            access_token
        ])
        res.send();
    } catch (error) {
        res.status(400).send({
            logout_error: 'Error while logging out, try again later.'
        })
    }
})

module.exports = Router;