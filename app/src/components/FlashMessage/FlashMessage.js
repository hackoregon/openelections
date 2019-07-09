import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getLatestMessage } from 'redux-flash';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from "./FlashMessageWrapper";

/***
 
  Use on a connected component like so:
  import { flashMessage } from 'redux-flash';

  # Set variant, it takes: success, warning, error, or info. Defaults to success.
   const options = {
    props: {
      variant: 'success',         
    }
  }

  # Dispatch flashMessage(message, [options])
  flashMessage('Wow so successful', options);

    - variant is only the option currently being passed
    - Others available, see https://material-ui.com/api/snackbar/
   const options = {
    props: {
      variant: 'success',         
    }
  }

  // mapDispatchToProps 
  dispatch => {
      return {
        flashMessage: (message, options) => dispatch(flashMessage(message, options))
      }
    }

***/

function FlashMessage ({ flash }) {
  return (
    <div  >
    {
      flash && 
      <div x={console.log(flash)}>
      <Snackbar open={true}  >  
        <SnackbarContentWrapper 
           variant = {flash.props.variant ? flash.props.variant : "success"}  
           anchororigin = {flash.props.anchorOrigin}
           message = {flash.message}
           className = 'anchorOriginTopRight'
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
