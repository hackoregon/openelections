import * as React from "react";

/** @jsx jsx */
import {css, jsx} from "@emotion/core";
import { mediaQueryRanges } from "../../../../assets/styles/variables";
import { PieChart } from "@hackoregon/component-library";
import SelectField from "../../../../components/Fields/SelectField";

const styles = css`
	.top-section {
		margin-bottom: 20px;
	}
	
	.money.big {
		font-size: 3.2em;	
	}
	
	.money.small {
		font-size: 1.5em;	
	}
	
	h4 {
		font-size: 14px;
		font-weight: normal;
		margin-bottom: 0;
		line-height: 1.1;
	}
	
	p {
	  margin-top: 0;
	}
	
	ul {
		list-style: none;
		padding-left: 0;
	}
	
	.top-expenses {
		margin-top: 20px;
		
		.VictoryContainer {
			max-width: 300px;
			margin: auto;
		}
		
		.VictoryContainer text {
			font-size: 14px;
		}
	}
	 
	@media ${ mediaQueryRanges.mediumAndUp } {
		.panels {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			
			.panel {
				width: 45%;
			}
			
			.top-expenses {
				width: 100%;
				display: flex;
				
				.panel {
					width: 50%;
				}
			}
		}
	
	}
`;

const ContributionsCard = props => {
	return (
		<div css={styles}>
			<div className="top-section">
				<h3>Campaign Finances</h3>
				<div className="filter"></div>
			</div>
			<div className="panels">
				<div className='panel'>
					<h4>Total raised before Match</h4>
					<p className='money small'>$21,352</p>
				</div>
				<div className='panel'>
					<h4>Total raised including Match</h4>
					<p className='money small'>$89,082</p>
				</div>
				<div className="panel">
					<h4>Total pending Match review</h4>
					<p className='money small'>$16,082</p>
				</div>
				<div className="panel">
					<h4>Total spent</h4>
					<p className='money small'>$33,082</p>
				</div>
				<div className="top-expenses">
					<div className="panel">
					<h4>Top 5 Largest Expenses</h4>
					<ul>
						<li><a href="#">#10300190212 ($8,420)</a></li>
						<li><a href="#">#10300190212 ($8,420)</a></li>
					</ul>
					</div>
					<div className="panel">
						<PieChart
							data={[
								{ x: 'Business entity', y: 35 },
								{ x: 'Individual', y: 40 },
								{ x: 'Labor organization', y: 55 },
								{ x: 'Other', y: 75 },
							]}
							width={350}
							height={350}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ContributionsCard;
