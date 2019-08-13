import * as path from 'path';

export const dataScienceRetrieverProcessor =
    process.env.NODE_ENV === 'development'
        ? path.resolve('jobs/processors/build/dataScienceRetrieverProcessor.js')
        : path.resolve('build/jobs/processors/dataScienceRetrieverProcessor.js');
