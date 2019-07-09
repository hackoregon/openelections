import React from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import FormModal from "../../components/FormModal/FormModal"
import SignupForm from "../../components/Forms/Signup";
import Button from "../../components/Button/Button"
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;
const buttonWrapper = css`
  margintop: 30px;
`;

const SignUp = () => (
	<PageHoc>
		<FormModal>
			<SignupForm
				onSubmit={x => console.log("REPLACE ME WITH SOMETHING REAL!")}
				initialValues={{
					newPassword: "",
					confirmNewPassword: ""
				}}
			>
				{({
					  formSections,
					  isValid,
					  handleSubmit /* isDirty, isSubmitting */
				  }) => (
					<React.Fragment>
						<p css={formTitle}>Signup</p>
						<p>
							Create a strong password to complete the sign up process
						</p>
						{formSections.newPassword}
						{formSections.confirmNewPassword}
						<div css={buttonWrapper}>
							<br/>
							<Button
								buttonType="submit"
								disabled={!isValid}
								onClick={handleSubmit}
							>
								Submit
							</Button>
						</div>
					</React.Fragment>
				)}
			</SignupForm>
		</FormModal>
	</PageHoc>
);

export default SignUp;
