import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import {
  getContributionById,
  getCurrentContribution,
} from '../../../state/ducks/contributions';
import {
  AddHeaderSection,
  BasicsSection,
  ContributorSection,
} from '../../../Pages/Portal/Contributions/Utils/ContributionsSections';
import { contributionsEmptyState } from '../../../Pages/Portal/Contributions/Utils/ContributionsFields';
import AddContributionForm from '../AddContribution/AddContributionForm';
import {
  mapContributionDataToForm,
  // mapContributionFormToData,
} from '../../../api/api';

const onSubmit = (data, props) => {
  console.log('hshs');
};

const mapData = () => {
  mapContributionDataToForm();
};

class ViewContribution extends React.Component {
  constructor(props) {
    super(props);
    console.log('zzz');
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    getContributionById(2);
  }

  render() {
    console.log('zzz');

    return (
      <AddContributionForm
        sss={console.log('zzz')}
        onSubmit={data => onSubmit(data, this.props)}
        initialValues={contributionsEmptyState}
        sadasdsa={console.log(this.props.getit)}
      >
        {({ formFields, isValid, handleSubmit, visibleIf, formErrors }) => {
          // console.log('Required fields', Object.keys(formErrors));

          // eslint-disable-next-line no-undef
          // console.log(getit);
          return (
            <>
              <AddHeaderSection isValid={isValid} handleSubmit={handleSubmit} />
              <BasicsSection
                formFields={formFields}
                checkSelected={visibleIf.checkSelected}
                showInKindFields={visibleIf.showInKindFields}
              />
              <ContributorSection
                formFields={formFields}
                showEmployerSection={visibleIf.showEmployerSection}
                isPerson={visibleIf.isPerson}
                emptyOccupationLetterDate={visibleIf.emptyOccupationLetterDate}
              />
              {/* <OtherDetailsSection formFields={formFields} /> */}
            </>
          );
        }}
      </AddContributionForm>
    );
  }
}
export default connect(
  state => ({
    getit: getCurrentContribution(state),
  }),
  dispatch => ({
    getContributionById: data => dispatch(getContributionById(2)),
  })
)(ViewContribution);

// class SignUp extends React.Component {
//   render() {
//     const { location } = this.props;
//     const params = queryString.parse(location.search);
//     const { invitationCode } = params;
//     return (
//       <PageHoc>
//         <SignUpForm code={invitationCode} {...this.props} />
//       </PageHoc>
//     );
//   }
// }
