import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, object } from "@storybook/addon-knobs";
import AddUser from "../src/Pages/AddUser/AddUser";

export default () =>
  storiesOf("AddUser", module).add("Add User Form", () => <AddUser />);
