import { createGovernmentAsync } from '../../services/governmentService';

const seeds = [
    {
        name: 'WonderGov'
    }
];

export default async () => {
    if (process.env.NODE_ENV !== 'development') {
        return console.log('Can only seed in development mode');
    }
    return Promise.all(seeds.map(createGovernmentAsync));
};
