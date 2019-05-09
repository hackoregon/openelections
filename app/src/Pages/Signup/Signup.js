import * as React from 'react';
import { Formik } from "formik";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import { SignupForm } from '../../components/Forms/Signup'
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
    maxWidth: "200px"
  }
});

class Signup extends React.Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    userRole: 'Staff'
  };
  handleStateChange(name, event) {
    console.log('change', name);
    this.setState({ [name]: event.target.value });
  };

  render () {
    // const initilValues = {
    //   firstName: '',
    //   lastName: '',
    //   email: '',
    //   userRole: 'Staff'
    // }
    const userRoles = [
      'Admin',
      'Staff'
    ];
    // const selectedValues = {
    //   selectedUserRole: this.state.userRole
    // }

    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Paper elevation={1} className={classes.paper}>
        {console.log({state: this.state})}
          <Formik
            onSubmit={(values, actions) => {
              console.log('Submitting: ', values, actions)
            }}
            render={props => (
              <SignupForm 
                handleStateChange={this.handleStateChange.bind(this)} 
                {...{...props, userRoles /*, selectedValues */}} 
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