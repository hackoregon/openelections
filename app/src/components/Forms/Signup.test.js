import React from "react";
import { SignUpForm } from "./Signup";

describe("<SignUpForm/>", () => {
	it("should be defined", () => {
		expect(SignUpForm).toMatchSnapshot();
	});
});
