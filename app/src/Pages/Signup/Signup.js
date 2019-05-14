import React, { Component } from 'react';
import { Formik } from "formik";
import withStyles from "@material-ui/core/styles/withStyles";
import { AddUserForm } from '../../components/Forms/AddUser'
import * as Yup from "yup";
import { Input, InputLabel, FormControl, Paper, IconButton } from "@material-ui/core";
// import { Visibility, VisibilityOff } from "@material-ui/icons";

// import { connect } from 'react-redux'

const validationSchema = Yup.object({
	userRole: Yup.string("Choose a user role").required("A user role is required"),
	firstName: Yup.string("Enter your first name").required("First Name is required"),
	lastName: Yup.string("Enter your last name").required("Last Name is required"),
	email: Yup.string("Enter your email").email("Enter a valid email").required("Email is required")
});



class Signup extends Component {

	render () {
		const { classes } = this.props;
		return (
			<div className={classes.container}>
				<Paper elevation={1} className={classes.paper}>
					{console.log({state: this.state})}
					<Formik
						onSubmit={(values, actions) => {
							console.log('Submitting: ', values, actions)
						}}
						onReset={ (values, bag) => {
							console.log('on reset', {values}, {bag})
							this.clearState()
							bag.resetForm(this.state)
						}}
						render={props => (
							<AddUserForm
								handleStateChange={this.handleStateChange.bind(this)}
								clearState={this.clearState.bind(this)}
								formValues={this.state}
								{...{...props, userRoles }}
							/>)}
						initialValues={this.state}
						validationSchema={validationSchema}
					/>
				</Paper>
			</div>
		)
	}
}

export default withStyles(styles)(Signup);

class SignupForm extends Component {

	state = {
		showPassword: false,
		password: '',
	};

	constructor ( props ) {
		super(props);

	}

	handleClickShowPassword () {
		this.setState( state => ({ showPassword: !state.showPassword }) )
	}

	render () {
		const {
			handleSubmit,
			handleChange,
			handleBlur,
			values,
			errors
		} = this.props;

		return (
			<form action="">
				<FormControl className={classNames(classes.margin, classes.textField)}>
					<InputLabel htmlFor="adornment-password">Password</InputLabel>
					<Input
						id="adornment-password"
						type={this.state.showPassword ? 'text' : 'password'}
						value={this.state.password}
						onChange={this.handleChange('password')}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="Toggle password visibility"
									onClick={this.handleClickShowPassword}
								>
									{this.state.showPassword ? <Visibility /> : <VisibilityOff />}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
			</form>
		);
	}
}