import * as React from 'react'
import { connect } from 'react-redux';
import { getCurrentState } from '../../state/test/selectors';
const doohicky = (props: any) => {

  console.log(props.data)
  return (
    <div>
      <h1>Testing: {props.data.text}</h1>
    </div>
    )
}
export default connect(
  state => ({
    data: getCurrentState(state)
  }),
  dispatch => ({})
)(doohicky);
