import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, Button} from 'react-bootstrap'
import {validateFields} from '../utils/common'
import {Link} from 'react-router-dom'
import { registerNewUser } from '../actions/auth'
import {resetErrors} from '../actions/errors'
import _ from 'lodash';

class Register extends Component{
    state = {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        cpassword: '',
        successMsg: '',
        errorMsg: '',
        isSubmitted: false
    };

    componentDidUpdate(prevProps){
        if(!_.isEqual(prevProps.errors, this.props.errors)) {
            this.setState({ errorMsg: this.props.errors });
        }
    }

    componentWillUnmount(){
        this.props.dispatch(resetErrors())
    }

    registerUser = (event) => {
        event.preventDefault()
        console.log('register hit');
        const { first_name, last_name, email, password, cpassword } = this.state;
        const fieldsToValidate = [
            { first_name },
            { last_name },
            { email },
            { password },
            { cpassword }
        ];
        const allFieldsEntered = validateFields(fieldsToValidate)
        if(!allFieldsEntered){
            this.setState({
                errorMsg: {
                    signup_error:'Please enter all fields'
                }
            });
        } else {
            if(password !== cpassword){
                this.setState({
                    errorMsg: {
                        signup_error: "Passwords do not match."
                    }
                });
            } else {
                this.setState({ isSubmitted: true });
                this.props
                    .dispatch(registerNewUser({ first_name, last_name, email, password}))
                    .then((response) => {
                        if(response.success){
                            this.setState({
                                successMsg: "User registered successfully",
                                errorMsg: ''
                            })
                        }
                    })
            }
        }
    };

    handleInputChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    };

    render() {
        const { errorMsg, successMsg, isSubmitted } = this.state
        return(
            <div className="login-page">
                <h2>Register New User</h2>
                <div className="login-form">
                    <Form onSubmit={this.registerUser}>
                        { errorMsg && errorMsg.signup_error ? (
                                <p className="errorMsg centered-message">
                                    { errorMsg.signup_error }
                                </p>
                        ) : (
                            isSubmitted && (
                                <p className="successMsg centered-message">{successMsg}</p>
                            )
                        )}
                        <Form.Group controlId="first_name">
                            <Form.Label>First name</Form.Label>
                            <Form.Control type="text" name="first_name" placeholder="Enter first name" onChange={this.handleInputChange}/>
                        </Form.Group>
                        <Form.Group controlId="last_name">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name="last_name" placeholder="Enter last name" onChange={this.handleInputChange}/>
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" placeholder="Enter email address" onChange={this.handleInputChange}/>
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" placeholder="Enter password" onChange={this.handleInputChange}/>
                        </Form.Group>
                        <Form.Group controlId="cpassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" name="cpassword" placeholder="Confirm Password" onChange={this.handleInputChange}/>
                        </Form.Group>

                        <div className="action-items">
                            <Button variant="primary" type="submit">
                                Register
                            </Button>
                            <Link to="/" className="btn btn-secondary">
                                Login
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    errors: state.errors
})

export default connect(mapStateToProps)(Register)