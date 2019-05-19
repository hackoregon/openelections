import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, object } from "@storybook/addon-knobs";
import ForgotPassword from "../src/Pages/ForgotPassword/ForgotPassword";

export default () =>
  storiesOf("ForgotPassword", module).add("Change Password Form", () => (
    <ForgotPassword />
  ));
