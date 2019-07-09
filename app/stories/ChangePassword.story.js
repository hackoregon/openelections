import * as React from "react";

import { storiesOf } from "@storybook/react";
import ChangePassword from "../src/components/Forms/ChangePassword/ChangePassword";

export default () =>
  storiesOf("Forms", module).add("Change Password Form", () => (
    <ChangePassword />
  ));
