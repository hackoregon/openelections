import * as fetch from 'node-fetch';


export function dataScienceUrl() {
    if (process.env.APP_ENV === 'production') {
        return 'http://openelections-data.local/match'; // ECS service name
    } else if (process.env.APP_ENV === 'staging') {
        return 'http://openelections-data-staging.local/match'; // ECS service name
    } else if (process.env.APP_ENV === 'test') {
        return 'http://datatest/match';   // docker-compose service name test
    } else {
        return 'http://data/match';  // docker-compose service name development
    }
}

export interface PersonMatchType {
    id: string;
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    zip: string;
    address_sim: string;
    zip_sim: string;
    first_name_sim: string;
    last_name_sim: string;
    eligible_address: string;
}

export interface MatchAddressType {
    exact: PersonMatchType[];
    strong: PersonMatchType[];
    weak: PersonMatchType[];
    donor_info: {
        first_name: string;
        last_name: string;
        zip_code: string;
        addr1: string;
        addr2: string;
        city: string;
        max_matches: string;
        eligible_address: string;
    };
    error?: Error;
}

export interface RetrieveDataScienceMatchAttrs {
    first_name: string;
    last_name: string;
    addr1: string;
    addr2?: string;
    city: string;
    state: string;
    zip_code: string;
}

export async function retrieveResultAsync(attrs: RetrieveDataScienceMatchAttrs): Promise<MatchAddressType> {
    try {
        const urlParams = `?last_name=${attrs.last_name}&first_name=${attrs.first_name}&addr1=${attrs.addr1}${attrs.addr2 ? '&addr2=' + attrs.addr2 : ''}&zip_code=${attrs.zip_code}&city=${attrs.city}&state=${attrs.state}`;
        const response = await fetch(`${dataScienceUrl()}${urlParams}`);
        return (await response.json() as MatchAddressType);

    } catch (error) {
        const errorReturnAttrs: any = attrs;
        errorReturnAttrs.max_matches = 10;
        errorReturnAttrs.eligibile_address = 'False';

        return {
            exact: [],
            strong: [],
            weak: [],
            donor_info: errorReturnAttrs,
            error
        } as MatchAddressType;
    }
}