import * as Bull from 'bull';
import { dataScienceJob } from './dataScienceRetrieverJob';

export const dataScienceResultQueue: any  = new Bull('ds-results-retriever', 'redis://redis:6379');
dataScienceResultQueue.process('DataScienceRetriever', 10, (job, done) => {});
