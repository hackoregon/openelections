import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, object } from "@storybook/addon-knobs";
import ChangePassword from "../src/Pages/ChangePassword/ChangePassword";

export default () =>
  storiesOf("ChangePassword", module).add("Change Password Form", () => (
    <ChangePassword />
  ));
