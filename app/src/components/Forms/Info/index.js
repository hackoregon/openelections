/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useCookies } from 'react-cookie';

import IntroInfo from './IntroInfo';
import DetailedInfo from './DetailedInfo';

const modalWrapper = css`
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const Info = () => {
  const [cookies] = useCookies('visited');

  return (
    <div css={modalWrapper}>
      {cookies.visited ? <DetailedInfo /> : <IntroInfo />}
    </div>
  );
};

export default Info;
