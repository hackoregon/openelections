import * as Bull from 'bull';

import config from './config';

const dataScienceResultQueue = new Bull('ds-results-retriever', config.redis);

export default dataScienceResultQueue;
