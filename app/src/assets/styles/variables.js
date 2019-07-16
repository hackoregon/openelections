
export const font_family = "'Poppins', sans-serif;";

export const accents = {
	purple: '#9013FE',
	lightGrey: 'rgba(0,0,0,0.15)'
};

export const mediaSizes = {
	smallScreenUp: 601,
	mediumScreenUp: 993,
	largeScreenUp: 1201,
	smallScreen: 600,
	mediumScreen: 992,
	largeScreen: 1200
};

export const mediaQueryRanges = {
	mediumAndUp: `only screen and (min-width : ${mediaSizes.smallScreenUp}px)`,
	largeAndUp: `only screen and (min-width : ${mediaSizes.mediumScreenUp}px)`,
	extraLargeAndUp: `only screen and (minWidth : ${mediaSizes.largeScreenUp})`,
	smallAndDown: `only screen and (maxWidth : ${mediaSizes.smallScreen})`,
	mediumAndDown: `only screen and (maxWidth : ${mediaSizes.mediumScreen})`,
	mediumOnly: `only screen and (min-width : ${mediaSizes.smallScreenUp}) and (max-width : ${mediaSizes.mediumScreen})`
};