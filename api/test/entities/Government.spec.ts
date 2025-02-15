import db from '../../models/db';
import { Government } from '../../models/entity/Government';
import { truncateAll } from '../factories';

let governmentRepository: any;

describe('Government', () => {
    beforeEach(async () => {
        const dataSource = await db();
        governmentRepository = dataSource.getRepository('Government');
    });

    afterEach(async () => {
        await truncateAll();
    });

    describe('Validations', () => {
        it('name', async () => {
            const government = new Government();
            await government.validateAsync();
            expect(government.errors[0].property).toEqual('name');
            expect(government.errors[0].constraints.isDefined).toEqual('name should not be null or undefined');
        });

        it('isValid', async () => {
            const government = new Government();
            expect(await government.isValidAsync()).toBeFalsy();
            government.name = 'City of Portland';
            expect(await government.isValidAsync()).toBeTruthy();
        });

        it('validate throws error', async () => {
            const government = new Government();
            try {
                await governmentRepository.save(government);
            } catch (e) {
                expect(e.message).toEqual('government has one or more validation problems');
            }
        });

        it('validate does not throws error', async () => {
            const government = new Government();
            government.name = 'City of Portland';
            expect(await governmentRepository.count()).toEqual(0);
            await governmentRepository.save(government);
            expect(await governmentRepository.count()).toEqual(1);
        });
    });

    describe('JSON', () => {
        it('toJson', async () => {
            const government = new Government();
            government.name = 'City of Portland';
            await governmentRepository.save(government);
            const governmentJson = government.toJSON();
            expect(governmentJson.id).toBeDefined();
            expect(governmentJson.name).toEqual('City of Portland');
        });
    });
});
