import * as React from "react";

/** @jsx jsx */
import {css, jsx} from "@emotion/core";
import { mediaQueryRanges } from "../../../../assets/styles/variables";
import { PieChart } from "@hackoregon/component-library";
import LoadingCircle from '../../../../assets/icons/loading-circle';
import SelectField from "../../../../components/Fields/SelectField";

const styles = css`
	min-height: 300px;
	position: relative;
	
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
	
	.loading-circle {
		position: absolute;
		top: 50%;
		left: 50%; 
		transform: translate(-50%, -50%);
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

class ContributionsCard extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			data: {}
		}
	}

	getData() {
		return new Promise((resolve) => {
			setTimeout( () => {
				resolve({
					moneyBeforeMatch: 21352,
					moneyIncludingMatch: 89482,
					moneyPendingMatch: 16082,
					moneySpent: 33082,
					topExpenses: [
						{amount: 8420, id: "10300190212", name: "Business A"},
						{amount: 6490, id: "10653535342", name: "Individual C"},
						{amount: 3460, id: "10535244235", name: "Business H"},
						{amount: 2221, id: "10354536262", name: "Business B"},
						{amount: 1450, id: "10254352322", name: "Individual J"},
					]
				});
			}, 1000);
		});
	}

	componentDidMount() {
		this.getData().then(data => {
			this.setState({
				isLoading: false,
				data
			})
		});
	}

	money( number ) {
		return "$" + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	render() {
		const { data } = this.state;

		return (
			<div css={styles}>
				<div className="top-section">
					<h3>Campaign Finances</h3>
					<div className="filter"></div>
				</div>

				{this.state.isLoading ?
					<LoadingCircle className={'loading-circle'} radius={50} />
					:
					<div className="panels">
						<div className='panel'>
							<h4>Total raised before Match</h4>
							<p className='money small'>{this.money(data.moneyBeforeMatch)}</p>
						</div>
						<div className='panel'>
							<h4>Total raised including Match</h4>
							<p className='money small'>{this.money(data.moneyIncludingMatch)}</p>
						</div>
						<div className="panel">
							<h4>Total pending Match review</h4>
							<p className='money small'>{this.money(data.moneyPendingMatch)}</p>
						</div>
						<div className="panel">
							<h4>Total spent</h4>
							<p className='money small'>{this.money(data.moneySpent)}</p>
						</div>
						<div className="top-expenses">
							<div className="panel">
								<h4>Top 5 Largest Expenses</h4>
								<ul>
									{data.topExpenses.map(ex =>
										<li><a href="#">#{ex.id} ({this.money(ex.amount)})</a></li>
									)}
								</ul>
							</div>
							<div className="panel">
								<PieChart
									data={data.topExpenses.map(ex => ({x: ex.name, y: ex.amount}))}
									width={350}
									height={250}
								/>
							</div>
						</div>
					</div>
				}
			</div>
		);
	};
}
export default ContributionsCard;
