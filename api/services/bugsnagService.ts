import Bugsnag from '@bugsnag/js';

export const bugsnagClient = (() => {
    if (process.env.NODE_ENV === 'production') {
        return Bugsnag.start({
            apiKey: process.env.BUG_SNAG_API_KEY,
            releaseStage: process.env.APP_ENV,
        });
    }
    return;
})();
