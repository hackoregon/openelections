import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ContributionsTable from './ContributionsTable';
import PageHoc from '../../../../components/PageHoc/PageHoc';

class ContributionsTablePage extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <PageHoc>
        <ContributionsTable history={history} />
      </PageHoc>
    );
  }
}

export default withRouter(ContributionsTablePage);

ContributionsTablePage.propTypes = {
  history: PropTypes.oneOfType([PropTypes.object]),
};
