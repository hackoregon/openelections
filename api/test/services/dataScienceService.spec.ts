import { expect } from 'chai';
import { dataScienceUrl } from '../../services/dataScienceService';

describe('dataScienceService', () => {
    context('dataScienceUrl', () => {
        it('test', () => {
            expect(dataScienceUrl()).to.equal('http://data');
        });
        it('production', () => {
            process.env.APP_ENV = 'production';
            expect(dataScienceUrl()).to.equal('http://openelections-data.local');
            process.env.APP_ENV = 'test';
        });
        it('staging', () => {
            process.env.APP_ENV = 'staging';
            expect(dataScienceUrl()).to.equal('http://openelections-data-staging.local');
            process.env.APP_ENV = 'test';
        });
    });

    context('retrieveResultAsync', () => {
        it('exact match', async () => {
// exact matches
// curl http://data/match -d "last_name=daniel&first_name=debbie&addr1=1024 SE Morrison&zip_code=97214&city=Portland&state=OR"
// {
//     "exact": [
//     {
//         "id": "3d5dc6f9-a795-4e76-bbad-81f390e5732b",
//         "first_name": "DEBBIE",
//         "last_name": "DANIEL",
//         "address_1": "1024 SE MORRISON",
//         "address_2": "",
//         "city": "PORTLAND",
//         "state": "OR",
//         "zip": "97214",
//         "address_sim": "1.0",
//         "zip_sim": "1.0",
//         "first_name_sim": "1.0",
//         "last_name_sim": "1.0",
//         "eligible_address": "True"
//     }
// ],
//     "strong": [],
//     "weak": [],
//     "donor_info": {
//     "last_name": "DANIEL",
//         "first_name": "DEBBIE",
//         "zip_code": "97214",
//         "addr1": "1024 SE MORRISON",
//         "addr2": "",
//         "city": "PORTLAND",
//         "max_matches": "10",
//         "eligible_address": "True"
// }
// }
        });
    });
});

// exact matches
// curl http://data/match -d "last_name=daniel&first_name=debbie&addr1=1024 SE Morrison&zip_code=97214&city=Portland&state=OR"
// {
//     "exact": [
//     {
//         "id": "3d5dc6f9-a795-4e76-bbad-81f390e5732b",
//         "first_name": "DEBBIE",
//         "last_name": "DANIEL",
//         "address_1": "1024 SE MORRISON",
//         "address_2": "",
//         "city": "PORTLAND",
//         "state": "OR",
//         "zip": "97214",
//         "address_sim": "1.0",
//         "zip_sim": "1.0",
//         "first_name_sim": "1.0",
//         "last_name_sim": "1.0",
//         "eligible_address": "True"
//     }
// ],
//     "strong": [],
//     "weak": [],
//     "donor_info": {
//     "last_name": "DANIEL",
//         "first_name": "DEBBIE",
//         "zip_code": "97214",
//         "addr1": "1024 SE MORRISON",
//         "addr2": "",
//         "city": "PORTLAND",
//         "max_matches": "10",
//         "eligible_address": "True"
// }
// }

// strong
// curl http://data/match -d "last_name=daniel&first_name=debb&addr1=1024 SE Morrison&zip_code=97214&city=Portland&state=OR"
// {
//     "exact": [],
//     "strong": [
//     {
//         "id": "3d5dc6f9-a795-4e76-bbad-81f390e5732b",
//         "first_name": "DEBBIE",
//         "last_name": "DANIEL",
//         "address_1": "1024 SE MORRISON",
//         "address_2": "",
//         "city": "PORTLAND",
//         "state": "OR",
//         "zip": "97214",
//         "address_sim": "1.0",
//         "zip_sim": "1.0",
//         "first_name_sim": "0.8",
//         "last_name_sim": "1.0",
//         "eligible_address": "True"
//     },
//     {
//         "id": "2f76c383-5b89-4d2d-8792-13d1fb195ccb",
//         "first_name": "DEBBIE",
//         "last_name": "DANIEL",
//         "address_1": "1024 SE MORRISON",
//         "address_2": "",
//         "city": "PORTLAND",
//         "state": "OR",
//         "zip": "97214",
//         "address_sim": "1.0",
//         "zip_sim": "1.0",
//         "first_name_sim": "0.8",
//         "last_name_sim": "1.0",
//         "eligible_address": "True"
//     }
// ],
//     "weak": [],
//     "donor_info": {
//     "last_name": "DANIEL",
//         "first_name": "DEBB",
//         "zip_code": "97214",
//         "addr1": "1024 SE MORRISON",
//         "addr2": "",
//         "city": "PORTLAND",
//         "max_matches": "10",
//         "eligible_address": "True"
// }
// }

// weak matches
// curl http://data/match -d "last_name=daniel&first_name=DANIEL&addr1=1024 SE Morrison&zip_code=97214&city=Portland&state=OR"
// {
//     "exact": [],
//     "strong": [],
//     "weak": [
//     {
//         "id": "3d5dc6f9-a795-4e76-bbad-81f390e5732b",
//         "first_name": "DEBBIE",
//         "last_name": "DANIEL",
//         "address_1": "1024 SE MORRISON",
//         "address_2": "",
//         "city": "PORTLAND",
//         "state": "OR",
//         "zip": "97214",
//         "address_sim": "1.0",
//         "zip_sim": "1.0",
//         "first_name_sim": "0.5",
//         "last_name_sim": "0.5",
//         "eligible_address": "True"
//     },
//     {
//         "id": "2f76c383-5b89-4d2d-8792-13d1fb195ccb",
//         "first_name": "DEBBIE",
//         "last_name": "DANIEL",
//         "address_1": "1024 SE MORRISON",
//         "address_2": "",
//         "city": "PORTLAND",
//         "state": "OR",
//         "zip": "97214",
//         "address_sim": "1.0",
//         "zip_sim": "1.0",
//         "first_name_sim": "0.5",
//         "last_name_sim": "0.5",
//         "eligible_address": "True"
//     }
// ],
//     "donor_info": {
//     "last_name": "DEBBIE",
//         "first_name": "DANIEL",
//         "zip_code": "97214",
//         "addr1": "1024 SE MORRISON",
//         "addr2": "",
//         "city": "PORTLAND",
//         "max_matches": "10",
//         "eligible_address": "True"
// }
// }

// No match
// curl http://127.0.0.1/match -d "last_name=Smith&first_name=John&addr1=123 Main St&zip_code=97202&city=Portland"
// {
//     "exact": [],
//     "strong": [],
//     "weak": [],
//     "donor_info": {
//     "last_name": "SMITH",
//         "first_name": "JOHN",
//         "zip_code": "97202",
//         "addr1": "123 MAIN ST",
//         "addr2": "",
//         "city": "PORTLAND",
//         "max_matches": "10",
//         "eligible_address": "True"
// }
// }
