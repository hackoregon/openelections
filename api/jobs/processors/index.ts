import * as path from 'path';

// eek, we need the JS version for BULL :/
export const dataScienceRetrieverProcessor = path.resolve('/app/build/jobs/processors/dataScienceRetrieverProcessor.js');
export const nightEmailProcessor = path.resolve('/app/build/jobs/processors/sendNightlyEmailProcessor.js');
export const cronEmailProcessor = path.resolve('/app/build/jobs/processors/cronNightlyEmailProcessor.js');
