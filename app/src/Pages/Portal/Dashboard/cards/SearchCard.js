import * as React from "react";

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { NavLink } from "react-router-dom";
import Form from "../../../../components/Form/Form";
import SearchBox from "../../../../components/SearchBox/SearchBox";

const styles = css`
	.search-box {
		font-size: 16px;	
	}
		
`;

class SearchCard extends React.Component {

	queryTimeout = null;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			searchResults: null
		}
	}

	performSearch (query) {
		this.setState({isLoading: true});

		setTimeout(() => {
			this.setState({
				isLoading: false,
				searchResults: [
					{ label: 'Expense', value: 'Example' },
					{ label: 'Contribution', value: 'Example contribution' },
					{ label: 'Other', value: 'Other type of content' }
				]
			});
		}, 2000)
	}

	render() {
		return (
			<div css={styles}>
				<h3>Search</h3>
				<p>Search across all contributions and expenses</p>
				<SearchBox
					className='search-box'
					placeholder='Contribution #, Expenses #'
					onSearchQueryChange={(value) => {
						if (this.queryTimeout) clearTimeout(this.queryTimeout);
						if (value) {
							this.queryTimeout = setTimeout( () => {
								this.performSearch(value);
							}, 1000);
						}
					}}
					isLoading={this.state.isLoading}
					guesses={this.state.searchResults}
				/>
			</div>
		);
	}
};
export default SearchCard;
