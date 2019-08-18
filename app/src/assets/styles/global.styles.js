import { css } from '@emotion/core';
import { font_family } from './variables';

const styles = css`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: ${font_family};
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
