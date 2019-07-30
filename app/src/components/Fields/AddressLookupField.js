/* global google */
import React from 'react'
import PropTypes from "prop-types";
import TextFieldMaterial from "@material-ui/core/TextField";
import parseGooglePlace from "parse-google-place";

/***
 *  Usage
 *  
 *  updateFields prop maps formik fields to address parts
 *  
 *  const fields = {
 *    myStateField: {
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
                street: "myAddressLookupField",  //Set street to lookup field to update after address is selected  
                stateShort: "myStateField", 
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
    this.handleFieldChange = this.handleFieldChange.bind(this)
  }

  componentDidMount () {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.autocompleteInput.current,
      { types: ['geocode'] }
    )
    this.autocomplete.getFields("address_components");
    this.autocomplete.addListener('place_changed', this.handlePlaceChanged)
  }
  handleFieldChange (e) {
    //Ensure that any changes mad by hand are reflected in posted values
    this.props.formik.values[this.props.id] = e.currentTarget.value;
  }
  handlePlaceChanged () {
    const place = this.autocomplete.getPlace();
    const addressFields = parseGooglePlace(place);
    addressFields.street = addressFields.address;
    const updateFields = this.props.updateFields;
    for (var updateField in updateFields) {
      if (updateFields[updateField]) {
        //If the update field is the lookup field update though the ref
        if(updateFields[updateField]===this.props.id){
          this.autocompleteInput.current.value = addressFields[updateField]
        //Otherwise update through formik
        }else{
          this.props.formik.setFieldValue(
            updateFields[updateField],
            addressFields[updateField],
            false
          )
        }
      }
    }
  }
  render () {
    const { id, label, formik } = this.props
    return (
      <TextFieldMaterial 
          id={id}
          name={id}
          label={label}
          helperText={formik.touched[id] ? formik.errors[id] : ""}
          error={formik.touched[id] && Boolean(formik.errors[id])}
          onChange={this.handleFieldChange}
          fullWidth
          InputProps={{
            inputProps: {
              ref: this.autocompleteInput,
              id: 'autocomplete',
              placeholder: 'Enter your address',
              type: 'text'
            }
          }}
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
    stateLong: PropTypes.string,
    stateShort: PropTypes.string,
    zipCode: PropTypes.string,
    countryLong: PropTypes.string,
    countryShort: PropTypes.string,
    county: PropTypes.string,
    streetName: PropTypes.string,
    streetNumber: PropTypes.string
  }),
};

export default AddressLookupField;
