/* eslint-disable react/prop-types */
/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';
import { css, jsx } from '@emotion/core';
import FormModal from '../../FormModal/FormModal';
import Button from '../../Button/Button';
import BulkImportForm from './BulkImport';
import {
  clearBulkUploadState,
  getBulkUploadStatus,
} from '../../../state/ducks/contributions';

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;

const buttonWrapper = css`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 30px;
`;

const oaeWarning = css`
  font-size: 12px;
  color: red;
`;

const BulkImport = props => {
  React.useEffect(() => {
    return () => {
      props.clearBulkUploadState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <FormModal>
        <BulkImportForm
          onSubmit={values => {
            props.uploadCsv(values.fileUpload);
          }}
          initialValues={{
            fileUpload: '',
          }}
          onValidate={() => {
            props.clearBulkUploadState();
          }}
        >
          {({ formSections, isValid, handleSubmit }) => (
            <>
              <p css={formTitle}>Bulk Import</p>
              <p>
                To successfully bulk import your contribution data, your the CSV
                file rows and columns <b>must adhere</b> to the standard upload
                format. Before proceeding, please download the standard{' '}
                <a href="/bulk-contributions.csv" target="_blank" download>
                  CSV template here
                </a>
                .
              </p>
              {props.bulkUpload.status === 'success' ? (
                <p>{props.bulkUpload.message}</p>
              ) : (
                <>
                  <div css={oaeWarning}>
                    <p>{props.bulkUpload.error ?? props.bulkUpload.error}</p>
                  </div>
                  {formSections.fileUpload}
                  <div css={oaeWarning}>
                    {props.bulkUpload.contributionErrors &&
                      props.bulkUpload.contributionErrors.length && (
                        <>
                          <p>Errors:</p>
                          <ul>
                            {props.bulkUpload.contributionErrors.map(error => (
                              <li key={error}>{error}</li>
                            ))}
                          </ul>
                        </>
                      )}
                  </div>
                  <div css={buttonWrapper}>
                    <div>
                      <Button
                        buttonType="submit"
                        disabled={!isValid}
                        onClick={() => {
                          handleSubmit();
                        }}
                        style={{ margin: '1px' }}
                      >
                        Import
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </BulkImportForm>
      </FormModal>
    </div>
  );
};

export default connect(
  state => ({
    bulkUpload: getBulkUploadStatus(state),
  }),
  dispatch => ({
    clearBulkUploadState: () => dispatch(clearBulkUploadState()),
  })
)(BulkImport);
