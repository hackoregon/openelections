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
    first_name: string,
    last_name: string,
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
        const response = await fetch(`${dataScienceUrl()}?last_name=daniel&first_name=debbie&addr1=1024 SE Morrison&zip_code=97214&city=Portland&state=OR`);
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
