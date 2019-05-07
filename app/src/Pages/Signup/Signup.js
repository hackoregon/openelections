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
    role: 'Staff'
  };
  handleRoleChange(event) {
    console.log('change', this.state.role);
    this.setState({ role: event.target.value });
  };
  render () {
    const initilValues = {
      firstName: '',
      lastName: '',
      email: '',
      userRole: 'Staff'
    }
    const userRoles = [
      'Admin',
      'Staff'
    ];
    const selectedValues = {
      role: this.state.role
    }

    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Paper elevation={1} className={classes.paper}>
        {console.log(initilValues, this.state.role)}
          <Formik
            onSubmit={(values, actions) => {
              console.log('Submitting: ', values, actions)
            }}
            render={props => (
              <SignupForm 
                handleRoleChange={this.handleRoleChange.bind(this)} 
                {...{...props, userRoles, selectedValues}} 
              />)}
            initialValues={initilValues}
            validationSchema={validationSchema}
          />
        </Paper>
      </div>
    )
  }
}
export default withStyles(styles)(Signup);