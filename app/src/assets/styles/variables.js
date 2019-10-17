export const OEFontFamily = "'Poppins', sans-serif;";

export const accents = {
  purple: '#9013FE',
  lightGrey: 'rgba(0,0,0,0.15)',
};

export const mediaSizes = {
  smallScreenUp: 601,
  mediumScreenUp: 993,
  largeScreenUp: 1201,
  smallScreen: 600,
  mediumScreen: 992,
  largeScreen: 1200,
};

export const mediaQueryRanges = {
  mediumAndUp: `only screen and (min-width : ${mediaSizes.smallScreenUp}px)`,
  largeAndUp: `only screen and (min-width : ${mediaSizes.mediumScreenUp}px)`,
  extraLargeAndUp: `only screen and (min-width : ${mediaSizes.largeScreenUp}px)`,
  smallAndDown: `only screen and (max-width : ${mediaSizes.smallScreen}px)`,
  mediumAndDown: `only screen and (max-width : ${mediaSizes.mediumScreen}px)`,
  mediumOnly: `only screen and (min-width : ${mediaSizes.smallScreenUp}px) and (max-width : ${mediaSizes.mediumScreen}px)`,
};
