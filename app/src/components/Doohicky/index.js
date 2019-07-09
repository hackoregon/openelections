import React from "react";
import { connect } from "react-redux";
const doohicky = props => {
  console.log(props.data);
  return (
    <div>
      <h1>Testing: Dohicky</h1>
      <button onClick={() => console.log("what?")}>Click</button>
    </div>
  );
};

export default connect()(doohicky);
