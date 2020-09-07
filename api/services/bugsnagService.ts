import bugsnag from '@bugsnag/js';
const pack = require('../package.json');
export const bugsnagClient = (() => {
    if (process.env.NODE_ENV === 'production') {
        return bugsnag({
            apiKey: process.env.BUG_SNAG_API_KEY,
            releaseStage: process.env.APP_ENV,
            appVersion: pack.version
        });
    }
    return;
})();

