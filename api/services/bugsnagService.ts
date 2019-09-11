import bugsnag from '@bugsnag/js';

export const bugsnagClient = bugsnag(process.env.BUG_SNAG_API_KEY);

