import * as React from "react";
import { configure, addDecorator } from "@storybook/react";
import { Global, css } from "@emotion/core";
import styles from "../src/assets/styles/global.styles";

// automatically import all files ending in *.story.js
const req = require.context("../stories", true, /\.story\.js$/);

const withGlobal = storyFn => (
  <>
    <Global styles={styles} />
    {storyFn()}
  </>
);

function loadStories() {
  req.keys().forEach(req);
}

addDecorator(withGlobal);
configure(loadStories, module);
