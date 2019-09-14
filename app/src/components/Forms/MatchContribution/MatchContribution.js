import React from 'react';
import { connect } from 'react-redux';
import { css, jsx } from '@emotion/core';
/** @jsx jsx */
import TextFieldMaterial from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import FormModal from '../../FormModal/FormModal';
import { getModalState, clearModal } from '../../../state/ducks/modal';
import Button from '../../Button/Button';
import {
  updateContribution,
  postContributionComment,
} from '../../../state/ducks/contributions';
import { ContributionStatusEnum } from '../../../api/api';
import CurrencyField from '../../Fields/CurrencyField';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(3),
  },
}));

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
}) => {
  const classes = useStyles();
  const isRequired = true;
  const [matchAmount, setMatchAmount] = React.useState('');
  function handleTextChange(event) {
    setMatchAmount(event.target.value);
  }

  return (
    <FormModal>
      <div css={matchContributionStyle}>
        <h1 css={matchContributionTitle}>Match Contribution</h1>
        <p>Enter Amount of Match</p>
        {/* <CurrencyField /> */}
        <TextFieldMaterial
          required={isRequired}
          id="matchAmout"
          name="matchAmout"
          value={matchAmount}
          label="Match Amount"
          onChange={handleTextChange}
          helperText="Enter match amount"
          fullWidth
        />
        <div css={buttonContainer}>
          <Button buttonType="formDefaultOutlined" onClick={() => clearModal()}>
            Cancel
          </Button>
          <Button
            disabled={!matchAmount}
            buttonType="matchDisabled"
            onClick={() => {
              clearModal();
              updateContribution({
                id,
                status: ContributionStatusEnum.PROCESSED,
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
