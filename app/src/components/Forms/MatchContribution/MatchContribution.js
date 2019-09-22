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

class MatchContribution extends React.Component {
  constructor(props) {
    super(props);

    this.isRequired = true;
    this.state = {
      matchAmount: parseFloat(props.donationAmount),
    };

    this.submitModal = this.submitModal.bind(this);
    this.submitOnEnter = this.submitOnEnter.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.submitOnEnter);
  }

  componentWillUnmount() {
    // Removing the Enter event listener after submission
    document.removeEventListener('keydown', this.submitOnEnter);
  }

  handleTextChange(values) {
    const { value } = values;
    this.setState({ matchAmount: value });
    return value;
  }

  submitModal() {
    const { id, clearModal, updateContribution } = this.props;
    clearModal();
    updateContribution({
      id,
      status: ContributionStatusEnum.PROCESSED,
      matchAmount: parseInt(this.state.matchAmount),
      compliant: true,
    });
  }

  submitOnEnter(e) {
    if (e.code === 'Enter') {
      this.submitModal();
    }
  }

  render() {
    const { clearModal } = this.props;
    return (
      <FormModal>
        <div css={matchContributionStyle}>
          <h1 css={matchContributionTitle}>Match Contribution</h1>
          <p>Enter Amount of Match</p>
          <NumberFormat
            style={{ height: '50px', width: '100%', fontSize: '24px' }}
            required={this.isRequired}
            id="matchAmount"
            name="matchAmount"
            value={this.state.matchAmount}
            label="Match Amount"
            onValueChange={this.handleTextChange}
            thousandSeparator
            prefix="$"
            decimalScale="2"
            isNumericString
            allowNegative={false}
          />
          <div css={buttonContainer}>
            <Button
              buttonType="formDefaultOutlined"
              onClick={() => clearModal()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              buttonType="disabledModalButton"
              onClick={this.submitModal}
            >
              Submit
            </Button>
          </div>
        </div>
      </FormModal>
    );
  }
}

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
