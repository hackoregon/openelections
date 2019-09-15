import { config, dataScienceResultQueue } from './queues';
import { dataScienceRetrieverProcessor } from './processors';

dataScienceResultQueue.process(config.concurrency, dataScienceRetrieverProcessor);
