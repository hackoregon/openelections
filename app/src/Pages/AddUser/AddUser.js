import * as React from 'react';
import { Formik } from "formik";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import { AddUserForm } from '../../components/Forms/AddUser'
import * as Yup from "yup";
import PageHoc from '../../components/PageHoc/PageHoc'

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
    userRole: 'Staff',
    firstName: '',
    lastName: '',
    email: ''
  };
  handleStateChange(name, event) {
    console.log('change', name);
    this.setState({ [name]: event.target.value });
  };

  clearState(e) {
    // e.preventDefault();
    console.log('clearing state')
    this.setState({
      firstName: '',
      lastName: '',
      email: '',
      userRole: 'Staff'
    })
  }

  render () {
    const userRoles = [
      'Admin',
      'Staff'
    ];

    const { classes } = this.props;
    return (
      <PageHoc>
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
      </PageHoc>
    )
  }
}
export default withStyles(styles)(AddUser);