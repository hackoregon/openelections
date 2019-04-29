import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { Government } from '../../models/entity/Government';

let governmentRepository: any;

describe('Government', () => {
    before(() => {
        governmentRepository = getConnection('default').getRepository('Government');
    });

    afterEach(async () => {
        await governmentRepository.query('TRUNCATE "government" CASCADE');
    });

    context('Validations', () => {
        it('name', async () => {
            const government = new Government();
            await government.validateAsync();
            expect(government.errors[0].property).equal('name');
            expect(government.errors[0].constraints.isDefined).equal('name should not be null or undefined');
        });

        it('isValid', async () => {
            const government = new Government();
            expect(await government.isValidAsync()).to.be.false;
            government.name = 'City of Portland';
            expect(await government.isValidAsync()).to.be.true;
        });

        it('validate throws error', async () => {
            const government = new Government();
            try {
                await governmentRepository.save(government);
            } catch (e) {
                expect(e.message).to.equal('government has one or more validation problems');
            }
        });

        it('validate does not throws error', async () => {
            const government = new Government();
            government.name = 'City of Portland';
            expect(await governmentRepository.count()).equal(0);
            await governmentRepository.save(government);
            expect(await governmentRepository.count()).equal(1);
        });

    });

    context('JSON', () => {
        it('toJson', async () => {
            const government = new Government();
            government.name = 'City of Portland';
            await governmentRepository.save(government);
            const governmentJson = government.toJSON();
            expect(governmentJson.id).to.not.be.undefined;
            expect(governmentJson.name).to.equal('City of Portland');
        });
    });

});
