export default Object.freeze({
    concurrency: Number(process.env.JOB_CONCURRENCY) || 10,
    redis: process.env.REDIS_URL || 'redis://redis:6379'
});
