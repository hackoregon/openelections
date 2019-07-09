import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getLatestMessage } from 'redux-flash';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from "./FlashMessageWrapper";

/*
To use on a connected component
import { flashMessage } from 'redux-flash';

const options = {
  props: {
    variant: 'success',         //one of: success, warning, error, info
    someOtherProp: 'someValue'  //Pipe in other MUI snackbar props. See: https://material-ui.com/api/snackbar/
  }

}

props.flashMessage('Signin Success', options);

 ...
// mapDispatchToProps: 
dispatch => {
    return {
      flashMessage: (message, options) => dispatch(flashMessage(message, options))
    }
  }
*/



function FlashMessage ({ flash }) {
  return (
    <div  >
    {
      flash && 
      <div>
      <Snackbar open={true}  >  
        <SnackbarContentWrapper 
           variant = {flash.props.variant ? flash.props.variant : "success"}  
           message = {flash.message}
        />
        </Snackbar> 
     </div>
    }
    </div>
  )
}

export default connect(
  state=> {
    return {   
        flash: getLatestMessage(state)
    }
  }
)(FlashMessage)
