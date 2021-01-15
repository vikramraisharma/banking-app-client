const express = require('express');
const authMiddleware = require('../middleware/auth')
const {pool} = require('../db/connect')
const {isInavlidField} = require('../utils/common');
const Router = express.Router()

Router.post('/profile', authMiddleware, async (req, res) => {
    try {
        const {first_name, last_name} = req.body;
        const validFieldsToUpdate = ['first_name', 'last_name'];
        const receivedFields = Object.keys(req.body);

        const isInavlidFieldProvided = isInavlidField(
            receivedFields,
            validFieldsToUpdate
        )
        if(isInavlidFieldProvided){
            return res.status(400).send({
                update_error: 'Invalid field.'
            })
        }
        const result = await pool.query(
            'update bank_user set first_name=$1, last_name=$2, where userid=$3 returning userid, first_name, last_name, email',
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