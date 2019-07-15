import * as React from "react";

import { storiesOf } from "@storybook/react";
import Invitation from "../src/components/Invitation/index";

export default () =>
  storiesOf("Forms", module).add("Invitation", () => <Invitation />);
