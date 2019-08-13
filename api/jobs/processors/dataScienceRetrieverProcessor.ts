export default (job: any): Promise<any> => {
    console.log(job.data);
    return Promise.resolve();
};
