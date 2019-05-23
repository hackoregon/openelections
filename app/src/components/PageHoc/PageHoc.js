import React from "react";
const PageHoc = props => (
  <div {...props} className="oe-page-container-inner">
    {props.children}
  </div>
);
export default PageHoc;
