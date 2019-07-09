import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, object } from "@storybook/addon-knobs";
import AddUser from "../src/components/Forms/AddUser/index";

export default () =>
  storiesOf("Forms", module).add("Add User Form", () => <AddUser />);
