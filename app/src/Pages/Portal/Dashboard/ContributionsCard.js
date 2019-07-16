import * as React from "react";

/** @jsx jsx */
import {css, jsx} from "@emotion/core";
import { mediaQueryRanges } from "../../../assets/styles/variables";

const styles = css`	
	.money.big {
		font-size: 3.2em;	
	}
	
	.money.small {
		font-size: 1.5em;	
	}
	
	h5, h2 {
		margin-bottom: 0;
	}
	
	p {
	  margin-top: 0;
	}
	 
	@media ${ mediaQueryRanges.mediumAndUp } {
		display: flex;

		.panel:first-child {
			flex: 3;
		}
		
		.panel:nth-child(2) {
			flex: 2;
		}
	
	}
`;

const ContributionsCard = props => {
	return (
		<div css={styles}>
			<div className='panel'>
				<h2>Ready to Disburse</h2>
				<p className='money big'>$0</p>
			</div>
			<div className='panel'>
				<h5>Disbursed</h5>
				<p className='money small'>$0</p>
				<h5>Pending</h5>
				<p className='money small'>$0</p>
			</div>
		</div>
	);
};
export default ContributionsCard;
