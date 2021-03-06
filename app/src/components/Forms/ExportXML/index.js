/* eslint-disable react/prop-types */
/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/core';
import FormModal from '../../FormModal/FormModal';
import Button from '../../Button/Button';
import ExportXMLForm from './ExportXML';

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;
const buttonWrapper = css`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const exportOptionText = css`
  margin-top: 30px;
  text-align: center;
`;

const totalTest = css`
  text-align: center;
  font-size: 0.8em;
  margin: 5px 0 0 0;
`;

const oaeWarning = css`
  font-size: 12px;
  color: red;
`;

const ExportXML = props => {
  const [isAll, setIsAll] = useState(false);
  return (
    <div>
      <FormModal>
        <ExportXMLForm
          onSubmit={values => {
            props.fetch(isAll, values.filerId);
          }}
          initialValues={{
            filerId: '',
          }}
        >
          {({ formSections, isValid, handleSubmit }) => (
            <>
              <p css={formTitle}>Export XML</p>
              <p>
                In order to export XML for upload to ORESTAR, you will need to
                provide your filer id.
              </p>
              {formSections.export}
              <div css={oaeWarning}>
                <ul>
                  <li>
                    This export should not be used to modify existing records in
                    ORESTAR.
                  </li>
                  <li>Only use this export to add new records to ORESTAR.</li>
                  <li>Do not upload the same file multiple times.</li>
                </ul>
              </div>
              <p css={exportOptionText}>
                What records to do you want to export?
              </p>
              <div css={buttonWrapper}>
                <div>
                  <Button
                    buttonType="submit"
                    disabled={!isValid}
                    onClick={() => {
                      setIsAll(false);
                      handleSubmit();
                    }}
                    style={{ margin: '1px' }}
                  >
                    Export Filtered
                  </Button>
                  <p css={totalTest}>{props.totalFiltered} total</p>
                </div>
                <div>
                  <Button
                    buttonType="submit"
                    disabled={!isValid}
                    onClick={() => {
                      setIsAll(true);
                      handleSubmit();
                    }}
                    style={{ margin: '1px' }}
                  >
                    Export All
                  </Button>
                  <p css={totalTest}>{props.total} total</p>
                </div>
              </div>
            </>
          )}
        </ExportXMLForm>
      </FormModal>
    </div>
  );
};

export default ExportXML;
