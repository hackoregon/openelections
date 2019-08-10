import React from "react";
import { connect } from "react-redux";
import ExpensesTable from './ExpensesTable';
import { getExpenditures, getExpendituresList } from "../../../../state/ducks/expenditures";
import { getGovOrCampIdAttributes } from "../../../../state/ducks/auth";

class Index extends React.Component {
  componentDidMount() {  
      const attibutes = this.props.getGovOrCampIdAttributes; //Get list based on current role of user
      this.props.getExpenditures({...attibutes})
  }

  render() {
    return <ExpensesTable {...this.props} />
  }
}
export default connect(
    state => ({
        isListLoading: state.expenditures.isLoading,
        expendituresList: getExpendituresList(state),
        getGovOrCampIdAttributes: getGovOrCampIdAttributes(state)
    }),
  dispatch => ({ getExpenditures: (data) => dispatch(getExpenditures(data))})
)(Index);