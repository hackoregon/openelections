import * as React from "react";

import { storiesOf } from "@storybook/react";
import ChangePassword from "../src/components/Forms/ChangePassword/ChangePassword";

export default () =>
  storiesOf("ChangePassword", module).add("Change Password Form", () => (
    <ChangePassword />
  ));
