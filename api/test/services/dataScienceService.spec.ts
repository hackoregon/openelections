import { expect } from 'chai';
import { dataScienceUrl, retrieveResultAsync } from '../../services/dataScienceService';
import { seedAddresses } from '../../models/seeds/seeds';
import { truncateAll } from '../factories';

describe('dataScienceService', () => {
    before(async () => {
        await seedAddresses();
    });

    after(async () => {
        truncateAll();
    });

    context('dataScienceUrl', () => {
        it('test', () => {
            expect(dataScienceUrl()).to.equal('http://datatest/match');
        });
        it('production', () => {
            process.env.APP_ENV = 'production';
            expect(dataScienceUrl()).to.equal('http://openelections-data.local/match');
            process.env.APP_ENV = 'test';
        });
        it('staging', () => {
            process.env.APP_ENV = 'staging';
            expect(dataScienceUrl()).to.equal('http://openelections-data-staging.local/match');
            process.env.APP_ENV = 'test';
        });

        it('development', () => {
            process.env.APP_ENV = 'development';
            expect(dataScienceUrl()).to.equal('http://data/match');
            process.env.APP_ENV = 'test';
        });
    });

    context('retrieveResultAsync', () => {
        it('exact match', async () => {
            const result = await retrieveResultAsync({
                last_name: 'daniel',
                first_name: 'debbie',
                addr1: '1024 SE Morrison',
                zip_code: '97214',
                city: 'Portland',
                state: 'OR'
            });
            expect(result.exact.length).to.equal(1);
            expect(result.exact[0].last_name).to.equal('DANIEL');
            expect(result.exact[0].first_name).to.equal('DEBBIE');
            expect(result.donor_info.last_name).to.equal('DANIEL');
            expect(result.donor_info.first_name).to.equal('DEBBIE');
        });

        it('strong matches', async () => {
            const result = await retrieveResultAsync({
                last_name: 'daniel',
                first_name: 'debb',
                addr1: '1024 SE Morrison',
                zip_code: '97214',
                city: 'Portland',
                state: 'OR'
            });
            expect(result.exact.length).to.equal(0);
            expect(result.strong.length).to.equal(1);
            expect(result.strong[0].last_name).to.equal('DANIEL');
            expect(result.strong[0].first_name).to.equal('DEBBIE');
            expect(result.donor_info.last_name).to.equal('DANIEL');
            expect(result.donor_info.first_name).to.equal('DEBB');
        });

        it('weak matches', async () => {
            const result = await retrieveResultAsync({
                last_name: 'daniel',
                first_name: 'daniel',
                addr1: '1024 SE Morrison',
                zip_code: '97214',
                city: 'Portland',
                state: 'OR'
            });
            expect(result.exact.length).to.equal(0);
            expect(result.strong.length).to.equal(0);
            expect(result.weak.length).to.equal(1);
            expect(result.weak[0].last_name).to.equal('DANIEL');
            expect(result.weak[0].first_name).to.equal('DEBBIE');
            expect(result.donor_info.last_name).to.equal('DANIEL');
            expect(result.donor_info.first_name).to.equal('DANIEL');
        });

        it('no matches', async () => {
            const result = await retrieveResultAsync({
                last_name: 'smith',
                first_name: 'john',
                addr1: '122 MAIN ST',
                zip_code: '97214',
                city: 'Portland',
                state: 'OR'
            });
            expect(result.exact.length).to.equal(0);
            expect(result.strong.length).to.equal(0);
            expect(result.weak.length).to.equal(0);
        });
    });
});
