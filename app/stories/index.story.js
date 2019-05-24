import React from "react";

import { storiesOf } from "@storybook/react";
// import { action } from '@storybook/addon-actions';
import { linkTo } from "@storybook/addon-links";

import { Welcome } from "@storybook/react/demo";
// import Doohicky from '../src/components/Doohicky/index';
// import Provider from './Provider';
import Doohicky from "./doohicky.story";
import UserInfoBox from "./UserInfoBox.story";
import SearchBox from "./SearchBox.story";
import AddUser from "./AddUser.story";
import AddCampaign from "./AddCampaign.story";
import ChangePassword from "./ChangePassword.story";
import ForgotPassword from "./ForgotPassword.story";
import UpdateForgottenPassword from "./UpdateForgottenPassword.story";
import SignIn from "./SignIn.story";
import SignUp from "./SignUp.story";
// import Provider from './Provider';

import "../src/assets/styles/styles.scss";

// storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf("Doohicky", module).add("Intro", () => (
  <p>This is the Doohicky Section</p>
));

Doohicky();

storiesOf("Portal", module).add("Intro", () => (
  <p>These are components used within the Dashboard</p>
));

// Manage Portal
UserInfoBox();

AddUser();
AddCampaign();
ChangePassword();
SignIn();
SignUp();
ForgotPassword();
UpdateForgottenPassword();

storiesOf("UI Components", module).add("Intro", () => (
  <p>These are components used within the Dashboard</p>
));

// UI Components
SearchBox();
