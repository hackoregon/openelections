import { configure } from "@storybook/react";
// automatically import all files ending in *.story.js
const req = require.context("../stories", true, /\.story\.js$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
