import React, { Component } from 'react';
import { Formik } from "formik";
// import withStyles from "@material-ui/core/styles/withStyles";
// import { AddUserForm } from '../../components/Forms/AddUser'
import * as Yup from "yup";
import { Input, InputLabel, FormControl, Paper, IconButton, InputAdornment } from "@material-ui/core";
// import { Visibility, VisibilityOff } from "@material-ui/icons";

// import { connect } from 'react-redux'

const validationSchema = Yup.object({
	// email: Yup.string("Enter your email").email("Enter a valid email").required("Email is required")
});



class Signup extends Component {

	handleStateChange(name, event) {
		console.log('change', name);
		this.setState({ [name]: event.target.value });
	};

	render () {
		// const { classes } = this.props;
		return (
			<div>
				<Paper elevation={1}>
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
							<SignupForm
								handleStateChange={this.handleStateChange.bind(this)}
								// clearState={this.clearState.bind(this)}
								formValues={this.state}
								{...{...props }}
							/>)}
						initialValues={this.state}
						validationSchema={validationSchema}
					/>
				</Paper>
			</div>
		)
	}
}

export default Signup;

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
			errors,
			handleStateChange
		} = this.props;

		const change = (name, e) => {
			e.persist();
			handleStateChange(name, e);
			handleChange(e);
			console.log(errors);
			// setFieldTouched(name, true, false);
		};

		return (
			<form onSubmit={handleSubmit}>
				<FormControl>
					<InputLabel htmlFor="adornment-password">Password</InputLabel>
					<Input
						id="adornment-password"
						type={this.state.showPassword ? 'text' : 'password'}
						value={this.state.password}
						onChange={change.bind(null, 'password')}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="Toggle password visibility"
									onClick={this.handleClickShowPassword.bind(this)}>
									{this.state.showPassword ? 'show' : 'hide'}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
			</form>
		);
	}
}