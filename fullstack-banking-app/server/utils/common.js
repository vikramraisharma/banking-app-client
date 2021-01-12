const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { pool } = require('../db/connect')

const isInvalidField = (receivedFields, validFieldsToUpdate) => {
    return receivedFields.some(
        (field) => validFieldsToUpdate.indexOf(field) === -1
    )
}

const validateUser = async (email, password) => {
    const result = await pool.query(
        'SELECT user_id, email, password FROM bank_user WHERE email = $1',
        [email]
    );
    const user = result.rows[0]
    if(user){
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            delete user.password;
            return user;
        } else {
            throw new Error();
        }
    } else {
        throw new Error();
    }
}

const generateAuthToken = async (user) => {
    const { userid, email} = user;
    const secret = process.env.secret;
    const token = await jwt.sign({user, email}, secret);
    return token;
}

module.exports = {
    isInvalidField,
    validateUser,
    generateAuthToken
}