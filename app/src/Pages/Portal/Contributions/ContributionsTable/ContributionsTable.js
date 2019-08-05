import React from "react";
import PageHoc from "../../../../components/PageHoc/PageHoc";
import { connect } from "react-redux";
import Table from "../../../../components/Table";
import WithAdminPermissions from "../../../../components/WithAdminPermissions/";
import Button from "../../../../components/Button/Button";
import { getContributionsList } from "../../../../state/ducks/contributions";

const columnInfo = (title, field, type = undefined) =>
	type ? { title, field, type } : { title, field }

const actionInfo = (name, buttonType, onClick, isFreeAction = undefined) =>
	isFreeAction ? { icon: "none", name, buttonType, onClick, isFreeAction } : { icon: "none", name, buttonType, onClick }

const columns = [
	{
		field: 'date',
		title: 'Date',
		render: rowData => new Date(rowData.date)
			.toLocaleString(
				'en-US',
				{
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				}).split(', ')[0]
	},
	//columnInfo("Date", "date", "date"),
	columnInfo("Name", "lastName"),
	columnInfo("Amount", "amount", "currency"),
	columnInfo("Status", "status"),
	columnInfo("Labels", "NotSet")
]

const ContributionsTable = ({ ...props }) => {
	const isLoading = props.isListLoading && !Array.isArray(props.contributionList);
	const rowCount = Array.isArray(props.contributionList) ? props.contributionList.length : 0;
	const title = rowCount + ` Submitted Contributions`
	const options = {
		search: false,
		actionCellStyle: {
			color: "blue"
		},
		actionsColumnIndex: -1,
		pageSizeOptions: [20, 50, 100],
		pageSize: 50
	}
	const actions = [
		actionInfo("View", "primary", (event, rowData) => {
			props.history.push(`/contributions/ready/${rowData.id}`)
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
				data={isLoading ? [{}] : props.contributionList}
			/>
		</PageHoc>
	)
}

export default connect(state => ({
	isListLoading: state.campaigns.isLoading,
	contributionList: getContributionsList(state)
}))(ContributionsTable);
