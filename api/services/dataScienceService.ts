import * as fetch from 'node-fetch';

export function dataScienceUrl() {
    if (process.env.APP_ENV === 'production') {
        return 'http://openelections-data.local/match'; // ECS service name (private hosted zone + service discovery)
    } else if (process.env.APP_ENV === 'staging') {
        return 'http://openelections-data-staging.local/match'; // ECS service name (private hosted zone + service discovery)
    } else if (process.env.APP_ENV === 'test') {
        return 'http://datatest/match'; // docker-compose service name test
    } else {
        return 'http://data/match'; // docker-compose service name development // TODO: fix this url I think
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
export interface MatchDonorInfoType {
    first_name: string;
    last_name: string;
    zip_code: string;
    addr1: string;
    addr2: string;
    city: string;
    max_matches: string;
    eligible_address: any;
}
export interface MatchAddressType {
    exact: PersonMatchType[];
    strong: PersonMatchType[];
    weak: PersonMatchType[];
    donor_info: MatchDonorInfoType;
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
    addressPoint?: any;
}

export async function retrieveResultAsync(attrs: RetrieveDataScienceMatchAttrs): Promise<MatchAddressType> {
    try {
        let urlParams = `?last_name=${attrs.last_name}&first_name=${attrs.first_name}&addr1=${attrs.addr1}${
            attrs.addr2 ? '&addr2=' + attrs.addr2 : ''
        }&zip_code=${attrs.zip_code}&city=${attrs.city}&state=${attrs.state}`;
        if (attrs.addressPoint) {
            urlParams =
                urlParams +
                `&latitude=${attrs.addressPoint.coordinates[1]}&longitude=${attrs.addressPoint.coordinates[0]}`;
        }
        // TODO: locally the datascinceurl is not returning a latitude or longitude and it's fing things up
        // TODO: actually the attrs above are missing them
        const response = await fetch(`${dataScienceUrl()}${urlParams}`);
        const addressInfo: MatchAddressType = await response.json();
        console.log(`Received match info from dataScienceUrl: `, JSON.stringify(addressInfo));
        if (addressInfo.donor_info.eligible_address === 'True') {
            addressInfo.donor_info.eligible_address = true;
        } else {
            addressInfo.donor_info.eligible_address = false;
        }
        return addressInfo;
    } catch (error) {
        const errorReturnAttrs: any = attrs;
        errorReturnAttrs.max_matches = 10;
        errorReturnAttrs.eligibile_address = false;
        return {
            exact: [],
            strong: [],
            weak: [],
            donor_info: errorReturnAttrs,
            error,
        } as MatchAddressType;
    }
}
