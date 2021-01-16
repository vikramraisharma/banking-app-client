const express = require('express');
const authMiddleware = require('../middleware/auth')
const {pool} = require('../db/connect')
const {isInvalidField} = require('../utils/common');
const Router = express.Router()

Router.post('/profile', authMiddleware, async (req, res) => {
    try {
        // grab name fields to update, check if they are valid
        const {first_name, last_name} = req.body;
        const validFieldsToUpdate = ['first_name', 'last_name'];
        const receivedFields = Object.keys(req.body);
        console.log('receivedFields: ', receivedFields);
        const isInvalidFieldProvided = isInvalidField(
            receivedFields,
            validFieldsToUpdate
        )
        if(isInvalidFieldProvided){
            return res.status(400).send({
                update_error: 'Invalid field.'
            })
        }
        console.log('query reached, params: ', first_name, last_name, req.user.userid);
        // query psql table to update the user with the given params
        const result = await pool.query(
            'update bank_user set first_name=$1, last_name=$2 where userid=$3 returning userid, first_name, last_name, email;',
            [first_name, last_name, req.user.userid]
        )
        
        res.send(result.rows[0]);
    } catch (error) {
        res.status(400).send({
            update_error: 'Error while updating profile, please try again later.'
        })
    }
});

Router.get('/profile', authMiddleware, async (req, res) =>{
    try {
        res.send(req.user);
    } catch (error) {
        res.status(400).send({
            update_error: 'Error while getting profile data try again later.'
        })
    }
})

module.exports = Router;