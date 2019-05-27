import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, object } from "@storybook/addon-knobs";
import SignIn from "../src/Pages/SignIn/SignIn";

export default () =>
  storiesOf("SignIn", module).add("Add User Form", () => <SignIn />);
