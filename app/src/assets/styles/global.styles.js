import { css } from '@emotion/core';
import { OEFontFamily } from './variables';

const styles = css`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: ${OEFontFamily};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 10px;
  }

  h1 {
    font-size: 40px;
  }
  h2 {
    font-size: 30px;
  }

  h3 {
    font-size: 25px;
  }

  h4 {
    font-size: 20px;
  }

  h5 {
    font-size: 18px;
  }

  h6 {
    font-size: 15px;
  }

  a {
    color: #5e63f6;
    text-decoration: none;

    transition: color 0.2s;

    &:hover {
      color: darken(#5e63f6, 15%);
    }
  }

  input::file-selector-button {
    font-weight: bold;
    padding: 0.5em;
    border: thin solid grey;
    border-radius: 3px;
    color: rgba(0, 0, 0, 0.87);
    padding: 6px 16px;
    font-size: 0.875rem;
    min-width: 64px;
    box-sizing: border-box;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-weight: 500;
    line-height: 1.75;
    border-radius: 4px;
    letter-spacing: 0.02857em;
    text-transform: uppercase;
    color: #fff;
    background-color: #3f51b5;
    cursor: pointer;
    margin-right: 10px;
  }

  input::file-selector-button:hover {
    background-color: #303f9f;
  }

  input#fileUpload {
    height: auto;
    cursor: pointer;
  }

  // .file-input label {
  //   position: relative;
  //   padding: 20px;
  //   transform: none;
  //   background-color: #e0e0e0;
  //   border: 1px dashed #676767;
  //   cursor: pointer;
  // }

  .oe-page-container,
  .oe-portal-container {
    position: relative;
    min-height: 100vh;
    transform: translateZ(0);
  }
  .oe-page-container-inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    transition: opacity 0.35s, transform 0.35s;
    will-change: opacity, transform;
  }

  .page-appear,
  .page-enter,
  .page-exit-active {
    opacity: 0.0001;
    transform: translate3d(0, 30px, 0);
  }
  .page-appear-active,
  .page-enter-active,
  .page-exit {
    opacity: 0.0001;
    transform: translate3d(0, 30px, 0);
  }
  .page-enter-done,
  .page-appear-done {
    opacity: 0.9999;
    transform: translate3d(0, 0px, 0);
  }

  header nav {
    transition: opacity 0.35s, transform 0.35s;
  }
  .nav-intro-appear,
  .nav-intro-enter,
  .nav-intro-exit-active {
    opacity: 0.0001;
    transition: opacity 0.35s, transform 0.35s;
    will-change: opacity, transform;
  }
  .nav-intro-appear-active,
  .nav-intro-enter-active,
  .nav-intro-exit {
    opacity: 0.0001;
    transform: translate3d(30px, 0, 0);
  }
  .nav-intro-enter-done,
  .nav-intro-appear-done {
    opacity: 0.9999;
    transform: translate3d(0, 0, 0);
  }

  .move-enter {
    opacity: 0.01;
    transform: translate3d(0, 40px, 0);
  }
  .move-enter-active {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  .move-exit {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  .move-exit-active {
    opacity: 0.01;
    transform: translate3d(0, 40px, 0);
  }
`;

export default styles;
