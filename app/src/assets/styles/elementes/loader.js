import { css } from '@emotion/core';

// Found at: https://jsfiddle.net/subodhghulaxe/t568u/
function convertHex(hexParam, opacity) {
  let hex = hexParam.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split().reduce((a, b) => a + b + b, '');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${opacity / 100})`;
}

export default (radiusParam, colorParam) => {
  const radius = radiusParam || 5;
  const color = colorParam || '#ffffff';

  return css`
    &,
    &:after {
      border-radius: 50%;
      width: ${radius}px;
      height: ${radius}px;
    }
    & {
      display: inline-block;
      font-size: 10px;
      position: relative;
      color: transparent;
      border-top: ${radius / 10}px solid ${convertHex(color, 20)};
      border-right: ${radius / 10}px solid ${convertHex(color, 20)};
      border-bottom: ${radius / 10}px solid ${convertHex(color, 20)};
      border-left: ${radius / 10}px solid ${color};
      -webkit-transform: translateZ(0);
      -ms-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-animation: load8 1.1s infinite linear;
      animation: load8 1.1s infinite linear;
    }
    @-webkit-keyframes load8 {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    @keyframes load8 {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
  `;
};
