import { dataScienceUrl, retrieveResultAsync } from '../../services/dataScienceService';
import { addGISBoundaries, seedAddresses } from '../../models/seeds/seeds';
import { truncateAll } from '../factories';

describe('dataScienceService', () => {
    beforeAll(async () => {
        addGISBoundaries();
        await seedAddresses();
    });

    afterAll(async () => {
        await truncateAll();
    });

    describe('dataScienceUrl', () => {
        it('test', () => {
            expect(dataScienceUrl()).toEqual('http://datatest/match');
        });
        it('production', () => {
            process.env.APP_ENV = 'production';
            expect(dataScienceUrl()).toEqual('http://openelections-data.local/match');
            process.env.APP_ENV = 'test';
        });
        it('staging', () => {
            process.env.APP_ENV = 'staging';
            expect(dataScienceUrl()).toEqual('http://openelections-data-staging.local/match');
            process.env.APP_ENV = 'test';
        });

        it('development', () => {
            process.env.APP_ENV = 'development';
            expect(dataScienceUrl()).toEqual('http://data/match');
            process.env.APP_ENV = 'test';
        });
    });

    describe('retrieveResultAsync', () => {
        it('exact match', async () => {
            const result = await retrieveResultAsync({
                last_name: 'daniel',
                first_name: 'debbie',
                addr1: '1024 SE Morrison',
                zip_code: '97214',
                city: 'Portland',
                state: 'OR',
                addressPoint: {
                    type: 'Point',
                    coordinates: [-122.676483, 45.523064],
                },
            });
            expect(result.exact.length).toEqual(1);
            expect(result.exact[0].last_name).toEqual('DANIEL');
            expect(result.exact[0].first_name).toEqual('DEBBIE');
            expect(result.donor_info.last_name).toEqual('DANIEL');
            expect(result.donor_info.first_name).toEqual('DEBBIE');
        }, 8000);

        it('strong matches', async () => {
            const result = await retrieveResultAsync({
                last_name: 'daniel',
                first_name: 'debb',
                addr1: '1024 SE Morrison',
                zip_code: '97214',
                city: 'Portland',
                state: 'OR',
                addressPoint: {
                    type: 'Point',
                    coordinates: [-122.676483, 45.523064],
                },
            });
            expect(result.exact.length).toEqual(0);
            expect(result.strong.length).toEqual(1);
            expect(result.strong[0].last_name).toEqual('DANIEL');
            expect(result.strong[0].first_name).toEqual('DEBBIE');
            expect(result.donor_info.last_name).toEqual('DANIEL');
            expect(result.donor_info.first_name).toEqual('DEBB');
        }, 8000);

        it('weak matches', async () => {
            const result = await retrieveResultAsync({
                last_name: 'daniel',
                first_name: 'daniel',
                addr1: '1024 SE Morrison',
                zip_code: '97214',
                city: 'Portland',
                state: 'OR',
                addressPoint: {
                    type: 'Point',
                    coordinates: [-122.676483, 45.523064],
                },
            });
            expect(result.exact.length).toEqual(0);
            expect(result.strong.length).toEqual(0);
            expect(result.weak.length).toEqual(1);
            expect(result.weak[0].last_name).toEqual('DANIEL');
            expect(result.weak[0].first_name).toEqual('DEBBIE');
            expect(result.donor_info.last_name).toEqual('DANIEL');
            expect(result.donor_info.first_name).toEqual('DANIEL');
        }, 8000);

        it('no matches', async () => {
            const result = await retrieveResultAsync({
                last_name: 'smith',
                first_name: 'john',
                addr1: '122 MAIN ST',
                zip_code: '97214',
                city: 'Portland',
                state: 'OR',
                addressPoint: {
                    type: 'Point',
                    coordinates: [-122.676483, 45.523064],
                },
            });
            expect(result.exact.length).toEqual(0);
            expect(result.strong.length).toEqual(0);
            expect(result.weak.length).toEqual(0);
        }, 8000);
    });
});
