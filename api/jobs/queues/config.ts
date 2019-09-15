export default Object.freeze({
    concurrency: Number(process.env.JOB_CONCURRENCY) || 20,
    redis: process.env.REDIS_URL || 'redis://redis:6379'
});
