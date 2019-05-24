import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, object } from "@storybook/addon-knobs";
import AddCampaign from "../src/Pages/AddCampaign/AddCampaign";

export default () =>
  storiesOf("AddCampaign", module).add("Add Campaign Form", () => <AddCampaign />);
