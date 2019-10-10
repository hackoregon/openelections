/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export const containers = {
  header: css`
    width: 96%;
    min-height: 100%;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
    margin-right: 38px;
    z-index: 1;
    position: relative;
  `,
  halfWidth: css`
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 20px;
  `,
  fullWidth: css`
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: 20px;
  `,
  cityStateZip: css`
    width: 100%;
    min-height: 25px;
    display: grid;
    grid-template-columns: 1.5fr 0.5fr 0.9fr;
    grid-column-gap: 20px;
  `,
  employerStateZip: css`
    width: 100%;
    min-height: 25px;
    display: grid;
    grid-template-columns: 1.5fr 0.9fr 0.5fr;
    grid-column-gap: 20px;
  `,
};

export const headerStyles = {
  header: css`
    display: flex;
    justify-content: space-between;
    margin-right: 38px;
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
  `,
  leftColumn: css`
    margin-right: 70px;
  `,
  rightColumn: css`
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-end;
  `,
  invoice: css`
    font-size: 48px;
    line-height: 57px;
    margin: 0px;
    /* identical to box height */
    color: #333333;
  `,
  subheading: css`
    font-size: 16px;
    line-height: 19px;
    margin-top: 0px;
    width: 360px;
  `,
  subheadingWide: css`
    font-size: 16px;
    line-height: 19px;
    margin-top: 0px;
  `,
  // labelBlock: css`
  //   margin-right: 40px;
  // `,
  // labels: css`
  //   font-size: 13px;
  //   line-height: 15px;
  //   color: #979797;
  //   margin-bottom: 4px;
  // `,
  smallBlueText: css`
    font-size: 13px;
    line-height: 15px;
    margin: 0px;
    /* Link */
    color: #5f5fff;
  `,
  largerBlueText: css`
    font-size: 16px;
    line-height: 19px;
    margin: 0px;
    /* Link */
    color: #5f5fff;
  `,
  status: css`
    font-size: 13px;
    line-height: 15px;
    color: #979797;
    margin-bottom: 4px;
  `,
  actualStatus: css`
    font-size: 21px;
    line-height: 25px;
    color: #000000;
    margin-top: 0px;
    margin-bottom: 20px;
  `,
  statusBlock: css`
    flex-direction: column;
    align-items: left;
  `,
  buttonDiv: css`
    display: flex;
    justify-content: space-between;
    align-self: flex-end;
  `,
  submitButton: css`
    background-color: #42b44a;
    border-radius: 5px;
    color: white;
    width: 225px;
    height: 50px;
    margin: 5px;
  `,
  draftButton: css`
    background-color: #d8d8d8;
    border-radius: 5px;
    color: white;
    width: 165px;
    height: 50px;
    margin-right: 8px !important;
  `,
  trashButton: css`
    background-color: #d8d8d8;
    border-radius: 5px;
    color: white;
    width: 165px;
    height: 50px;
    margin-right: 8px !important;
  `,
};

export const sectionStyles = {
  dividerLine: css`
    margin-left: -20px;
  `,
  title: css`
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 28px;
    width: 100%;
    color: #000000;
    margin-top: 55px;
  `,
  notes: css`
    margin-top: 75px;
    margin-bottom: 75px;
  `,
};

export const buttonBar = {
  wrapper: css`
    position: relative;
  `,
  container: css`
    position: absolute;
    right: 0;
    bottom: 0;
  `,
  button: css`
    margin: 1px;
  `,
  modal: css`
    position: absolute;
    right: 4;
    bottom: 4;
  `,
};

export const matchPickerModal = {
  wrapper: css`
    width: 320px;
    min-height: 180px;
  `,
  container: css`
    display: flex;
    justify-content: space-between;
    padding: 15px 0px;
  `,
  addressContainer: css`
    line-height: 0.9;
    min-height: 100px;
  `,
  addressFields: css`
    margin: 10px;
  `,
  address: css`
    display: flex;
    flex-direction: column;
    width: max-content;
    padding: 15px 0px;
  `,
  acceptButtonContainer: css`
    display: flex;
    margin-top: 40px;
    // align-items: center;
  `,
  acceptButton: css`
    height: 35px;
    button:disabled,
    button[disabled] {
      border: 1px solid grey;
      color: #grey;
    }
  `,
  linksContainer: css`
    display: flex;
    width: 100%;
    justify-content: space-between;
  `,
  matchTextHeader: css`
    text-align: center;
    text-transform: capitalize;
    font-size: 16px;
  `,
  matchText: css`
    text-align: center;
    text-transform: uppercase;
  `,
};

export const matchColors = {
  no: css`
    color: red;
  `,
  weak: css`
    color: orange;
  `,
  strong: css`
    color: yellow;
  `,
  exact: css`
    color: green;
  `,
};

// Activity Stream Styles
export const activitySectionStyles = {
  status: css`
    font-size: 13px;
    line-height: 15px;
    color: #979797;
    margin-bottom: 4px;
  `,
  main: css`
    margin-top: 65px;
    margin-right: 34px;
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
  `,
  title: css`
    font-size: 28px;
    line-height: 33px;
    padding-top: 33px;
    margin-bottom: 34px;
    color: #000000;
  `,
  timestamp: css`
    font-family: Rubik;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #979797;
    margin-right: 5px;
    margin-bottom: 0px;
    margin-top: 0px;
    color: #000000;
  `,
  username: css`
    font-size: 21px;
    line-height: 25px;
    margin-top: 5px;
    color: #979797;
  `,
  reply: css`
    font-size: 28px;
    line-height: 33px;
    color: #000000;
  `,
  messageBox: css`
    height: 281px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    padding: 23px 18px;
  `,
  message: css`
    font-size: 28px;
    line-height: 33px;
    color: #979797;
  `,
  divider: css`
    border: 1px solid #d8d8d8;
  `,
  boxAndButton: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
  `,
  sendToCampaignButton: css`
    padding: 30px 30px;
    width: 100%;
    height: 91px;
    border: 1px solid blue;
    display: flex;
    justify-content: center;
    margin-bottom: 38px;
  `,
  timelineGroup: css`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  timeline: css`
    flex-grow: 1;
    height: 1px;
    background-color: #9f9f9f;
  `,
  activityList: css`
    padding-left: 0;
  `,
};

export const messageBoxStyles = {
  main: css`
    margin-top: 65px;
    margin-right: 34px;
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
  `,
  messageBox: css`
    height: 281px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    padding: 23px 18px;
  `,
  message: css`
    font-size: 28px;
    line-height: 33px;
    color: #979797;
  `,
  divider: css`
    border: 1px solid #d8d8d8;
  `,
  boxAndButton: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 38px;
  `,
  sendToCampaignButton: css`
    padding: 30px 30px;
    width: 100%;
    height: 91px;
    border: 1px solid blue;
    display: flex;
    justify-content: center;
    margin-bottom: 38px;
  `,
  timelineGroup: css`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  timeline: css`
    flex-grow: 1;
    height: 1px;
    background-color: #9f9f9f;
  `,
};
