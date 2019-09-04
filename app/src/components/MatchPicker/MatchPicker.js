/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { connect } from 'react-redux';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';
// import WarningIcon from '@material-ui/icons/Warning';
// import CheckIcon from '@material-ui/icons/Check';
import NoMatchIcon from '@material-ui/icons/ErrorOutlineSharp';
import MatchIcon from '@material-ui/icons/CheckCircleOutlineSharp';
import Button from '../Button/Button';
import {
  containers,
  headerStyles,
  sectionStyles,
  buttonBar,
  matchColors,
} from '../../assets/styles/forms.styles';
import FormModal from '../FormModal/FormModal';
import { clearModal, showModal } from '../../state/ducks/modal';

const Header = ({ matchStrength, showModal, form }) => {
  const data = [];
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <h3
      css={sectionStyles.title}
      onClick={() => showModal({ component: 'MatchPickerForm', data })}
    >
      Contributor <NoMatchIcon css={matchColors.no} />{' '}
      <MatchIcon css={matchColors.exact} />
    </h3>
  );
};
export const MatchPickerHeader = connect(
  state => ({}),
  dispatch => {
    return {
      showModal: payload => dispatch(showModal(payload)),
    };
  }
)(Header);

export const MatchPicker = ({
  currentPage = 2,
  totalPages = 10,
  selected,
  matchStrength,
  id,
  name = 'Noah Fence',
  street1 = '123 Main Street',
  street2,
  city = 'Portland',
  state = 'OR',
  zip = '97203',
}) => {
  const matchStrengthText = `${matchStrength} Match Selected`;
  return (
    <FormModal>
      <div css={containers.main}>
        <div>
          <div>{name}</div>
          <div>{street1}</div>
          {street2 || <div>{street2}</div>}
          <div>
            <div>
              <div css={containers.cityStateZip}>
                <div>
                  {city}, {state} {zip}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>{selected ? matchStrengthText : <Button>Accept</Button>}</div>
        <div css={buttonBar.wrapper}>
          <div css={buttonBar.container}>
            {currentPage > 1 ? <Button>Previous</Button> : null}
            {currentPage === totalPages ? null : <Button>Next</Button>}
          </div>
        </div>
      </div>
    </FormModal>
  );
};

// const RemoveUser = props => {
//   return (
//     <FormModal>
//       <div css={removeUserStyle}>
//         <h1 css={removeUserTitle}>Remove User </h1>
//         <p>
//           {props.location.state.email} will no longer have access to the portal.
//         </p>
//         <p>Are you sure you want to remove them?</p>
//         <div css={buttonContainer}>
//           <Button
//             buttonType="formDefaultOutlined"
//             onClick={() => props.clearModal()}
//           >
//             Cancel
//           </Button>
//           <Button
//             buttonType="formDefault"
//             onClick={() =>
//               props.removeUser(
//                 props.location.state.id,
//                 props.location.state.roleId
//               )
//             }
//           >
//             Submit
//           </Button>
//         </div>
//       </div>
//     </FormModal>
//   );
// };
// // export default RemoveUser;
// export default connect(
//   state => ({
//     getModalState: getModalState(state),
//   }),
//   dispatch => {
//     return {
//       clearModal: () => dispatch(clearModal()),
//     };
//   }
// )(RemoveUser);

MatchPicker.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  street1: PropTypes.string,
  street2: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  zip: PropTypes.string,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  selected: PropTypes.bool,
};
