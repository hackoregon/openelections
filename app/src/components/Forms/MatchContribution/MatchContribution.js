import React from 'react';
import { connect } from 'react-redux';
import { css, jsx } from '@emotion/core';
/** @jsx jsx */
import NumberFormat from 'react-number-format';
import FormModal from '../../FormModal/FormModal';
import { getModalState, clearModal } from '../../../state/ducks/modal';
import Button from '../../Button/Button';
import {
  updateContribution,
  postContributionComment,
} from '../../../state/ducks/contributions';
import { ContributionStatusEnum } from '../../../api/api';

const matchContributionStyle = css`
  word-break: break-word;
  max-width: 300px;
`;
const buttonContainer = css`
  display: flex;
  margin-top: 30px;
  button {
    margin: 10px;
  }
`;
const matchContributionTitle = css`
  font-size: 24px;
`;

const MatchContribution = ({
  id,
  clearModal,
  updateContribution,
  postContributionComment,
  donationAmount,
}) => {
  const isRequired = true;
  const [matchAmount, setMatchAmount] = React.useState(
    parseFloat(donationAmount) < 50 ? donationAmount : '50.00'
  );
  function handleTextChange(values) {
    const { value } = values;
    setMatchAmount(value);
    return value;
  }

  // function submitOnEnter(e) {
  //   if (e.code === 'Enter') {
  //     clearModal();
  //     updateContribution({
  //       id,
  //       status: ContributionStatusEnum.PROCESSED,
  //       matchAmount: parseInt(matchAmount),
  //       compliant: true,
  //     });
  //   }
  // }

  // document.addEventListener('keydown', submitOnEnter);

  return (
    <FormModal>
      <div css={matchContributionStyle}>
        <h1 css={matchContributionTitle}>Match Contribution</h1>
        <p>Enter Amount of Match</p>
        <NumberFormat
          style={{ height: '50px', width: '100%', fontSize: '24px' }}
          required={isRequired}
          id="matchAmount"
          name="matchAmount"
          value={matchAmount}
          label="Match Amount"
          onValueChange={handleTextChange}
          thousandSeparator
          prefix="$"
          decimalScale="2"
          isNumericString
          allowNegative={false}
          isAllowed={values => {
            const { value } = values;
            return value <= 50;
          }}
        />

        <div css={buttonContainer}>
          <Button buttonType="formDefaultOutlined" onClick={() => clearModal()}>
            Cancel
          </Button>
          <Button
            buttonType="disabledModalButton"
            onClick={() => {
              clearModal();
              updateContribution({
                id,
                status: ContributionStatusEnum.PROCESSED,
                matchAmount: parseInt(matchAmount),
                compliant: true,
              });
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </FormModal>
  );
};

export default connect(
  state => ({
    getModalState: getModalState(state),
  }),
  dispatch => {
    return {
      updateContribution: data => dispatch(updateContribution(data)),
      postContributionComment: (id, comment) =>
        dispatch(postContributionComment(id, comment)),
      clearModal: () => dispatch(clearModal()),
    };
  }
)(MatchContribution);
