/** @jsx jsx */
import { css, jsx } from '@emotion/core'; // eslint-disable-line no-unused-vars

const filterOuter = css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  > div {
    margin: 0 5px;
  }
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

const filterWrapper = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const filterInner = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  // flex-wrap: wrap;
  > div {
    margin: 5px;
  }
  @media screen and (max-width: 900px) {
    flex-wrap: wrap;
    > div {
      width: calc(50% - 10px);
    }
  }
`;

const paginateOptions = css`
  margin: 10px 0;
  display: flex;
  > div {
    max-width: 25%;
  }
  @media screen and (max-width: 900px) {
    > div {
      max-width: 50%;
    }
  }
`;

const btnContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  > button {
    margin: 5px;
  }
  a.reset-button {
    text-align: center;
    font-size: 14px;
    transition: opacity 0.1s;
    cursor: pointer;
    &[disabled] {
      opacity: 0;
      color: gray;
    }
  }
  @media screen and (max-width: 900px) {
    width: 100%;
  }
`;

export {
  paginateOptions,
  filterInner,
  filterWrapper,
  filterOuter,
  btnContainer,
};
