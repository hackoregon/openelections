import React from 'react';
import { withRouter } from 'react-router-dom';
import ContributionsTable from './ContributionsTable';
import PageHoc from '../../../../components/PageHoc/PageHoc';

class ContributionsTablePage extends React.Component {
  render() {
    return (
      <PageHoc>
        <ContributionsTable
        //   filterOptions={{
        //     from: match.from,
        //     to: match.to,
        //     status: match.status,
        //   }}
        />
      </PageHoc>
    );
  }
}

export default withRouter(ContributionsTablePage);
