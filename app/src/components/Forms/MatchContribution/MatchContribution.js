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
  function handleTextChange() {
    setMatchAmount();
  }

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
          // onValueChange={values => {
          //   const { formattedValue } = values;
          //   formattedValue > 50.0
          //     ? console.log('more than 50')
          //     : console.log('formatted & value: ', formattedValue);
          // }}
        />

        <div css={buttonContainer}>
          <Button buttonType="formDefaultOutlined" onClick={() => clearModal()}>
            Cancel
          </Button>
          <Button
            disabled={!matchAmount || matchAmount > 50}
            type="submit"
            buttonType="disabledModalButton"
            onClick={() => {
              matchAmount > 50 ? alert('nope') : 'yep';
              clearModal();
              updateContribution({
                id,
                status: ContributionStatusEnum.PROCESSED,
                matchAmount: parseFloat(matchAmount),
                compliant: true,
              });
              postContributionComment(id, matchAmount);
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
