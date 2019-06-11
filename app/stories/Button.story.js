import * as React from "react";

import { storiesOf } from "@storybook/react";
import { withKnobs, select, text } from "@storybook/addon-knobs";
import Button from "../src/components/Button/Button";

export default () =>
  storiesOf("Button", module)
    .addDecorator(withKnobs)
    .add("Button", () => {
      const buttonType = select(
        "buttonType",
        ["submit", "cancel", "default"],
        "default"
      );
      const buttonText = text("label", "Click Me")
      return <Button buttonType={buttonType} >{buttonText}</Button>;
    });
