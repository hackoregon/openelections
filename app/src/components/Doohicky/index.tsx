import * as React from 'react'
import { connect } from 'react-redux';
import { getCurrentState } from '../../state/test/selectors';
import { testEmitter } from '../../state/test/actions';
const doohicky = (props: any) => {

  console.log(props.data);
  return (
    <div>
      <h1>Testing: { props.data.text }</h1>
      <button onClick={ () => props.testSend('what?') }>Click</button>
    </div>
    )
}

export default connect(
  state => ({
    data: getCurrentState(state)
  }),
  dispatch => ({
    testSend(message: string) {
      console.log(message)
      dispatch(testEmitter(message));
    }
  })
)(doohicky);
