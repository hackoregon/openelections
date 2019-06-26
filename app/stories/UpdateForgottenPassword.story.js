import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, object } from "@storybook/addon-knobs";
import UpdateForgottenPassword from "../src/Pages/UpdateForgottenPassword/UpdateForgottenPassword";

export default () =>
  storiesOf("Forms", module).add(
    "Change Password Form",
    () => <UpdateForgottenPassword />
  );
