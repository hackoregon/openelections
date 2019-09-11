import bugsnag from '@bugsnag/js';

export const bugsnagClient = (() => {
    if (process.env.NODE_ENV === 'productiyon') {
        return bugsnag(process.env.BUG_SNAG_API_KEY);
    }
    return;
})();

