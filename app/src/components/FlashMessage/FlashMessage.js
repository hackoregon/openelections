import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getLatestMessage } from 'redux-flash'

function FlashMessage ({ flash }) {
    return (
        <div>
        {
            flash && <div>{ flash.message }</div>
        }
        </div>
    )
}

function mapStateToProps (state) {
    return {
        flash: getLatestMessage(state)
    }
}

export default connect(mapStateToProps)(FlashMessage)
