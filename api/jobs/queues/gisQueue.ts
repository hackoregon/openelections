import * as Bull from 'bull';

import config from './config';
const queue = new Bull('gis-queue', config.redis);
export default queue;
