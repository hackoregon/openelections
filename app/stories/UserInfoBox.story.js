import * as React from "react";

import { storiesOf } from "@storybook/react";
// import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  text,
  boolean,
  optionsKnob as options,
  OptionsKnobOptions
} from "@storybook/addon-knobs";
import UserInfoBox from "../src/components/UserInfoBox";
import { MemoryRouter } from "react-router-dom";
import { checkA11y } from "@storybook/addon-a11y";

// import { withKnobs } from '@storybook/addon-knobs/react';

const data = {
  role: "admin",
  name: "Andrew Erickson",
  email: "example@test.com",
  isVerified: true
};

const label = "Role";
const valuesObj = {
  Admin: "admin",
  Staff: "staff"
};
const defaultValue = data.role;
const optionsObj = {
  display: "select"
};

export default () =>
  storiesOf("Portal/Manage Portal", module)
    .addDecorator(withKnobs)
    .addDecorator(checkA11y)
    .addDecorator(story => (
      <MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>
    ))
    .add("User Info Box", () => {
      const role = options(label, valuesObj, defaultValue, optionsObj);
      const name = text("name", data.name);
      const email = text("email", data.email);
      const isVerified = boolean("isVerified", data.isVerified);

      return <UserInfoBox {...{ name, role, email, isVerified }} />;
    });
