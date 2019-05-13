import * as React from 'react';
import { Formik } from "formik";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import { AddUserForm } from '../../components/Forms/AddUser'
import * as Yup from "yup";
// import { connect } from 'react-redux'

const validationSchema = Yup.object({
  userRole: Yup.string("Choose a user role").required("A user role is required"),
  firstName: Yup.string("Enter your first name").required("First Name is required"),
  lastName: Yup.string("Enter your last name").required("Last Name is required"),
  email: Yup.string("Enter your email").email("Enter a valid email").required("Email is required")
});
const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 5}px ${theme
      .spacing.unit * 5}px`
  },
  container: {
    maxWidth: "350px"
  }
});

class AddUser extends React.Component {
  state = {
    formValues: {
      userRole: 'Staff',
      firstName: '',
      lastName: '',
      email: ''
    },
    isSubmitted: false
  };
  handleStateChange(name, event) {
    console.log('change', name);
    this.setState({ formValues: {
      ...this.state.formValues, 
      [name]: event.target.value 
    }});
  };
  formIsSubmitted(bool) {
    this.setState({isSubmitted: bool})
  }

  clearState(e) {
    // e.preventDefault();
    console.log('clearing state')
    this.setState({
      formValues: {
        firstName: '',
        lastName: '',
        email: '',
        userRole: 'Staff'
      }
    })
  }

  render () {
    const userRoles = [
      'Admin',
      'Staff'
    ];

    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Paper elevation={1} className={classes.paper}>
        {console.log({state: this.state})}
        <p style={{
          fontSize: 35 + 'px',
          letterSpacing: -2 + 'px',
          margin: 10 + 'px ' + 0 + 'px' 
          }}>Add a New User</p>
        { !this.state.isSubmitted 
          ? (
          <Formik
          onSubmit={(values, actions) => {
            console.log('Submitting: ', values, actions)
            this.formIsSubmitted(true)
          }}
          onReset={ (values, bag) => {
            console.log('on reset', {values}, {bag})
            this.clearState()
            bag.resetForm(this.state.formValues)
          }}
          render={props => (
            <AddUserForm 
              handleStateChange={this.handleStateChange.bind(this)} 
              clearState={this.clearState.bind(this)} 
              formValues={this.state.formValues}
              {...{...props, userRoles }} 
            />)}
          initialValues={this.state.formValues}
          validationSchema={validationSchema}
        /> )
        : (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="188" height="188" viewBox="0 0 188 188" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M75.6095 123.65L50.0455 98.0856L41.3403 106.73L75.6095 140.999L149.175 67.4335L140.531 58.7896L75.6095 123.65Z" fill="#42B44A"/>
              <circle cx="94" cy="94" r="91" stroke="#42B44A" strokeWidth="6"/>
            </svg>
            <p style={{textAlign: 'center'}}>An email was sent to {this.state.formValues.email}.</p>
            <button onClick={() => {
              this.formIsSubmitted(false)
              this.clearState()
            }}>close</button>
          </div>
          
        )
        }
        </Paper>
      </div>
    )
  }
}
export default withStyles(styles)(AddUser);