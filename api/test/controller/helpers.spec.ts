import { FileArray, UploadedFile } from 'express-fileupload';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { expect } from 'chai';
import { parseBulkCsvData } from '../../controller/helpers';

let bulkUploadBody = {
    governmentId: '1',
    campaignId: '1',
    currentUserId: '1',
    filename: '1',
};
let mockCsv = null;
function createMockCsv(mockFileName: string): FileArray {
    const mockFile = path.join(path.join(__dirname, 'fixtures'), mockFileName);
    const mockBuffer = fs.readFileSync(mockFile);
    const mockMd5 = crypto.createHash('md5').update(mockBuffer).digest('hex');
    const mockFileOpts: UploadedFile = {
        name: mockFileName,
        encoding: 'utf-8',
        mimetype: 'text/csv',
        data: mockBuffer,
        tempFilePath: mockFile,
        md5: mockMd5,
        truncated: false,
        mv: () => null,
        size: Buffer.byteLength(mockBuffer),
    };
    return { file: mockFileOpts };
}

describe('controller/helpers', () => {
    beforeEach(async () => {
        mockCsv = null;
    });

    it('parseBulkCsvData: contributions-invalid-name.csv', async () => {
        mockCsv = createMockCsv('contributions-invalid-name.csv');
        const parsedData = await parseBulkCsvData(bulkUploadBody, mockCsv);
        expect(parsedData).to.deep.equal({
            info: { governmentId: 1, campaignId: 1, currentUserId: 1, filename: '1' },
            contributions: [
                {
                    amount: 293,
                    type: 'contribution',
                    subType: 'cash',
                    contributorType: 'individual',
                    oaeType: 'allowable',
                    lastName: 'DENNIS',
                    address1: 'PO BOX 29035',
                    city: 'PORTLAND',
                    state: 'OR',
                    zip: '97229',
                    occupation: 'Other',
                    paymentMethod: 'credit_card_online',
                    date: 1662656400000,
                    campaignId: 1,
                    governmentId: 1,
                    currentUserId: 1,
                },
            ],
        });
    });

    it('parseBulkCsvData: contributions-invalid-name-and-address.csv', async () => {
        mockCsv = createMockCsv('contributions-invalid-name-and-address.csv');
        const parsedData = await parseBulkCsvData(bulkUploadBody, mockCsv);
        expect(parsedData).to.deep.equal({
            info: { governmentId: 1, campaignId: 1, currentUserId: 1, filename: '1' },
            contributions: [
                {
                    amount: 293,
                    type: 'contribution',
                    subType: 'cash',
                    contributorType: 'individual',
                    oaeType: 'allowable',
                    lastName: 'DENNIS',
                    city: 'PORTLAND',
                    state: 'OR',
                    zip: '97229',
                    occupation: 'Other',
                    paymentMethod: 'credit_card_online',
                    date: 1662656400000,
                    campaignId: 1,
                    governmentId: 1,
                    currentUserId: 1,
                },
            ],
        });
    });

    it('parseBulkCsvData: contributions-invalid-same-name-address.csv', async () => {
        mockCsv = createMockCsv('contributions-invalid-same-name-address.csv');
        const parsedData = await parseBulkCsvData(bulkUploadBody, mockCsv);
        expect(parsedData).to.deep.equal({
            info: { governmentId: 1, campaignId: 1, currentUserId: 1, filename: '1' },
            contributions: [
                {
                    amount: 293,

                    type: 'contribution',
                    subType: 'cash',
                    contributorType: 'individual',
                    oaeType: 'allowable',
                    firstName: 'BULK',
                    city: 'PORTLAND',
                    state: 'OR',
                    zip: '97229',
                    occupation: 'Other',
                    paymentMethod: 'credit_card_online',
                    date: 1662656400000,
                    campaignId: 1,
                    governmentId: 1,
                    currentUserId: 1,
                },
            ],
        });
    });

    it('parseBulkCsvData: contributions-download-v-small.csv', async () => {
        mockCsv = createMockCsv('contributions-download-v-small.csv');
        const parsedData = await parseBulkCsvData(bulkUploadBody, mockCsv);
        expect(parsedData).to.deep.equal({
            info: { governmentId: 1, campaignId: 1, currentUserId: 1, filename: '1' },
            contributions: [
                {
                    amount: 293,

                    type: 'contribution',
                    subType: 'cash',
                    contributorType: 'individual',
                    oaeType: 'allowable',
                    firstName: 'BULK',
                    lastName: 'DENNIS',
                    address1: 'PO BOX 29035',
                    city: 'PORTLAND',
                    state: 'OR',
                    zip: '97229',
                    occupation: 'Other',
                    paymentMethod: 'credit_card_online',
                    date: 1662656400000,
                    campaignId: 1,
                    governmentId: 1,
                    currentUserId: 1,
                },
                {
                    amount: 445,
                    type: 'contribution',
                    subType: 'cash',
                    contributorType: 'individual',
                    oaeType: 'allowable',
                    firstName: 'BULK',
                    lastName: 'LARRY',
                    address1: '2445 NW WESTOVER RD 403',
                    city: 'PORTLAND',
                    state: 'OR',
                    zip: '97210',
                    occupation: 'Other',
                    paymentMethod: 'credit_card_online',
                    date: 1678377600000,
                    campaignId: 1,
                    governmentId: 1,
                    currentUserId: 1,
                },
            ],
        });
    });
});
