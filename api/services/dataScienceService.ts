
export function dataScienceUrl() {
    if (process.env.APP_ENV === 'production') {
        return 'http://openelections-data.local'; // ECS service name
    } else if (process.env.APP_ENV === 'staging') {
        return 'http://openelections-data-staging.local'; // ECS service name
    } else {
        return 'http://data';  // docker-compose service name
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
}

export async function retrieveResultAsync(): MatchAddressType {

}
