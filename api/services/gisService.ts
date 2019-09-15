import * as fetch from 'node-fetch';

export interface GoogleResult {
    results: [
        {
            address_components: [
                {
                    long_name: string,
                    short_name: string,
                    types: string[]
                },
                {
                    long_name: string,
                    short_name: string,
                    types: string[]
                },
                {
                    long_name: string,
                    short_name: string,
                    types: string[]
                },
                {
                    long_name: string,
                    short_name: string,
                    types: string[]
                },
                {
                    long_name: string,
                    short_name: string,
                    types: string[]
                },
                {
                    long_name: string,
                    short_name: string,
                    types: string[]
                },
                {
                    long_name: string,
                    short_name: string,
                    types: string[]
                }
                ],
            formatted_address: string,
            geometry: {
                location: {
                    lat: number,
                    lng: number
                },
                location_type: string,
                viewport: {
                    northeast: {
                        lat: number,
                        lng: number
                    },
                    southwest: {
                        lat: number,
                        lng: number
                    }
                }
            },
            place_id: number,
            types: string[ ]
        }
        ];
    status: string;
}

export async function geocodeAddressAsync(attrs: {
    address1: string,
    city: string,
    state: string,
    zip: string
}): Promise<[number, number] | null> {
    if (process.env.NODE_ENV === 'test') {
        return;
    }
    const address1 = attrs.address1.replace(/\s/g, '+');

    const url =  `https://maps.googleapis.com/maps/api/geocode/json?address=${address1},+${attrs.city},+${attrs.state},+${attrs.zip}&key=${process.env.GOOGLE_GIS_KEY}`;
    const request = await fetch(url);
    if (request.ok) {
        const json = await request.json() as GoogleResult;
        if (json.status === 'OK' && json.results[0] ) {
            return [json.results[0].geometry.location.lng, json.results[0].geometry.location.lat];
        }
    } else {
        throw new Error('Error geocoding');
    }
    return;
}
