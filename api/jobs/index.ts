import { config, dataScienceResultQueue, gisQueue } from './queues';
import { dataScienceRetrieverProcessor, gisProcessor } from './processors';

dataScienceResultQueue.process(config.concurrency, dataScienceRetrieverProcessor);

gisQueue.process(config.concurrency, gisProcessor);
