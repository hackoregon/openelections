import * as Bull from 'bull';

import config from './config';
import { dataScienceRetrieverProcessor } from '../processors';

const dataScienceResultQueue = new Bull('ds-results-retriever', config.redis);

dataScienceResultQueue.process(config.concurrency, dataScienceRetrieverProcessor);

export default dataScienceResultQueue;
