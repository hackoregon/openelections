import loader from "../styles/elementes/loader";
import React from "react";

/** @jsx jsx */
import { css, jsx } from '@emotion/core'

const LoadingCircle = ({ radius, color, className }) => (
	<div className={className} css={loader(radius || 20, color || "#000")}>
		Loading...
	</div>
);

export default LoadingCircle;