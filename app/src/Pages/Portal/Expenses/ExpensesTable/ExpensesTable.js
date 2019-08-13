import React from "react";
import PageHoc from "../../../../components/PageHoc/PageHoc";
import Table from "../../../../components/Table";
import WithAdminPermissions from "../../../../components/WithAdminPermissions/";
import Button from "../../../../components/Button/Button";

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
	{
		field: 'name',
		title: 'Name',
	},
	{
		field: 'amount',
		title: 'Amount',
		type: 'currency'
	},
	{
		field: 'type',
		title: 'Payment',
	},
]

const ExpensesTable = ({ ...props }) => {
	const isLoading = props.isListLoading && !Array.isArray(props.expendituresList);
	const rowCount = Array.isArray(props.expendituresList) ? props.expendituresList.length : 0;
	const title = rowCount + ` Submitted Expenditures`
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
			props.history.push(`/expenses/${rowData.id}`)
		}),
		actionInfo("Add New Expense", "primary", () => props.history.push({ pathname: "/expenses/add" }), true)
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
			<h1>Expenses</h1>
			<Table
				isLoading={isLoading}
				title={title}
				columns={columns}
				options={options}
				actions={actions}
				components={components}
				data={isLoading ? [{}] : props.expendituresList}
			/>
		</PageHoc>
	)
}

export default ExpensesTable;
