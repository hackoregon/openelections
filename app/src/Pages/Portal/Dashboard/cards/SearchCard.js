import * as React from "react";

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { NavLink } from "react-router-dom";
import Form from "../../../../components/Form/Form";
import SearchBox from "../../../../components/SearchBox/SearchBox";

const styles = css`
		
	ul {
		list-style: none;
		padding: 0;
		font-size: 20px;
	}
		
`;

class SearchCard extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isLoading: false
		}
	}

	render() {
		return (
			<div css={styles}>
				<h3>Search</h3>
				<p>Search across all contributions and expenses</p>
				<SearchBox
					placeholder='Contribution #, Expenses #'
					onSearchQueryChange={(value) => {
						if (value) {
							this.setState({isLoading: true});

							// Pretending to search
							setTimeout(() => {
								this.setState({isLoading: false});
							}, 2000);
						}
					}}
					isLoading={this.state.isLoading}
				/>
			</div>
		);
	}
};
export default SearchCard;
