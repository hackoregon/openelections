import React from 'react';
import { PageTransition } from '../PageTransistion';

const PageHoc = props => (
  <PageTransition>
    <div {...props}>{props.children}</div>
  </PageTransition>
);
export default PageHoc;
