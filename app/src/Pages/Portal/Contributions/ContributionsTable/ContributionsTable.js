import React from "react";
import PageHoc from "../../../../components/PageHoc/PageHoc";
import { connect } from "react-redux";
import Table from "../../../../components/Table";
import WithAdminPermissions from "../../../../components/WithAdminPermissions/";
import Button from "../../../../components/Button/Button";
import { getContributions } from "../../../../state/ducks/contributions"

const columnInfo = (title, field, type = undefined) =>
	type ? { title, field, type } : { title, field }

const actionInfo = (name, buttonType, onClick, isFreeAction = undefined) =>
	isFreeAction ? { icon: "none", name, buttonType, onClick, isFreeAction } : { icon: "none", name, buttonType, onClick }

const columns = [
	columnInfo("Date", "date", "date"),
	columnInfo("Name", "name"),
	columnInfo("Amount", "amount", "currency"),
	columnInfo("Status", "status"),
	columnInfo("Labels", "NotSet")
]

const ContributionsTable = ({ ...props }) => {
	console.log(props.getContributions({governmentId: 1, campaignId: 1, currentUserId: 1}))
	// TODO add loading logic
	const isLoading = false
	// TODO Display count of submitted contributions
	const title = `Submitted Contributions`
	const options = {
		search: false,
		actionCellStyle: {
			color: "blue"
		},
		actionsColumnIndex: -1,
	}
	const actions = [
		actionInfo("View", "primary", (event, rowData) => {
			// TODO add prop that goes to details page
			console.log(rowData)
		}),
		actionInfo("Add New Contribution", "primary", () => props.history.push({ pathname: "/contributions/add" }), true)
	]
	const components = {
		Action: props => (
			<WithAdminPermissions>
				<Button
					onClick={event => props.action.onClick(event, props.data)}
					buttonType={props.action.buttonType}
				>
					{props.action.name}
				</Button>
			</WithAdminPermissions>
		)
	}
	return (
		<PageHoc>
			<h1>Contributions</h1>
			<Table
				isLoading={isLoading}
				title={title}
				columns={columns}
				options={options}
				actions={actions}
				components={components}
			/>
		</PageHoc>
	)
}

export default connect(
	state => ({}),
	dispatch => ({
		getContributions: (data) => dispatch(getContributions(data))
	})
)(ContributionsTable);