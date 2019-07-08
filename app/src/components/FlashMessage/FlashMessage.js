import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getLatestMessage } from 'redux-flash';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from "./FlashMessageWrapper";

function FlashMessage ({ flash }) {
  return (
    <div  >
    {
      flash && 
      <div>
      <Snackbar open={true}  >  
        <SnackbarContentWrapper 
          variant={flash.isError ? "error" : "success"} 
          message={flash.message}
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
