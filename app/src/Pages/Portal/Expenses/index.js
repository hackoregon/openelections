import React from "react";
import { connect } from "react-redux";
import Expenses from './Expenses';
import { getExpenditures, getExpendituresList } from "../../../state/ducks/expenditures";

class ExpensesPage extends React.Component {
  componentDidMount() {
      //fetch data only if it's not in redux
      //refetch on success of adding and removing records 
      if(this.props.expendituresList.length < 1){
        this.props.getExpenditures({ governmentId: 1 })
    }
  }

  render() {
    return <Expenses {...this.props} />
  }
}
export default connect(
    state => ({
        isListLoading: state.expenditures.isLoading,
        expendituresList: getExpendituresList(state)
    }),
  dispatch => ({ getExpenditures: (data) => dispatch(getExpenditures(data))})
)(ExpensesPage);