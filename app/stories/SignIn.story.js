import * as React from "react";

import { storiesOf } from "@storybook/react";
import SignIn from "../src/components/Forms/SignIn/index";

export default () =>
  storiesOf("Forms", module).add("Sign In Form", () => <SignIn />);
