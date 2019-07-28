/* global google */
import React from 'react'
import PropTypes from "prop-types";

/***
 *  Usage
 *  
 *  updateFields prop maps formik fields to address parts
 *  
 *  const fields = {
 *    myStreetField: {
 *      label: "My State",
 *      component: TextField
 *    },
 *    myCityField: {
 *      label: "My City",
 *      component: TextField
 *    },
 *    myAddressLookupField: {
 *      label: "Address Lookup",
        component: (props) => 
          <AddressLookupField
            {...props.field} {...props}
            updateFields = {{
                street_address: "myStreetField",  
                city: "myCityField",     
              }}
          />
        }
 *  };
 *
 **/

class AddressLookupField extends React.Component {
  constructor (props) {
    super(props)
    this.autocompleteInput = React.createRef()
    this.autocomplete = null
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this)
  }

  componentDidMount () {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.autocompleteInput.current,
      { types: ['geocode'] }
    )
    this.autocomplete.addListener('place_changed', this.handlePlaceChanged)
  }

  handlePlaceChanged () {
    const place = this.autocomplete.getPlace()
    const address = place.address_components
    const addressFields = {
      street_address: `${address[0].long_name} ${address[1].long_name}`,
      city: address[3].long_name,
      state: address[6].short_name,
      zip_code: address[8].short_name
    }
    const updateFields = this.props.updateFields
    for (var updateField in updateFields) {
      if (updateFields[updateField]) {
        this.props.formik.setFieldValue(
          updateFields[updateField],
          addressFields[updateField],
          false
        )
      }
    }
  }
  render () {
    const { id, label, formik } = this.props
    return (
      <input
        ref={this.autocompleteInput}
        id='autocomplete'
        placeholder='Enter your address'
        type='text'
      />
    )
  }
}

AddressLookupField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.shape({}),
  updateFields: PropTypes.shape({
    street: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string
  })
};

export default AddressLookupField