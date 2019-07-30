"""
Donor matching code
"""

import traceback
import Levenshtein as leven
from typing import Optional, Dict, Set
import numpy as np
import openelections.data.database as db
import psycopg2
import re
import json

PORTLAND_ZIP_CODES = ['97201',
                      '97202',
                      '97203',
                      '97204',
                      '97205',
                      '97206',
                      '97209',
                      '97210',
                      '97211',
                      '97212',
                      '97213',
                      '97214',
                      '97215',
                      '97216',
                      '97217',
                      '97218',
                      '97219',
                      '97220',
                      '97221',
                      '97222',
                      '97223',
                      '97225',
                      '97227',
                      '97229',
                      '97230',
                      '97231',
                      '97232',
                      '97233',
                      '97236',
                      '97239',
                      '97258',
                      '97266']

ADDRESS_IGNORE = {'SW', 'SE', 'NE', 'NW', 'NE', 'N', 'E', 'S', 'W',
                  'APT', 'APARTMENT', 'UNIT', 'PENTHOUSE', 'PH', 'NO'}

ADDRESS_MAP = {'DRIVE': 'DR',
               'STREET': 'ST',
               'STR': 'ST',
               'STAPT': 'ST',
               'AVENUE': 'AVE',
               'AVEAPT': 'AVE',
               'AV': 'AVE',
               'LANE': 'LN',
               'PLACE': 'PL',
               'COURT': 'CT',
               'PARKWAY': 'PKWY',
               'PRWY': 'PKWY',
               'TERRACE': 'TER',
               'TERR': 'TER',
               'ROAD': 'RD',
               'CIRCLE': 'CIR',
               'SAINT': 'ST',
               'MOUNT': 'MT',
               'FIRST': '1ST',
               'SECOND': '2ND',
               'THIRD': '3RD',
               'FOURTH': '4TH',
               'FIFTH': '5TH',
               'SIXTH': '6TH',
               'SEVENTH': '7TH',
               'EIGHTH': '8TH',
               'NINTH': '9TH',
               'TENTH': '10TH',
               'ELEVENTH': '11TH',
               'TWELFTH': '12TH'}


def tokenize_address(addr1: str, addr2: Optional[str] = None) -> Set[str]:
    """
    Sanitize and tokenize address
    This may not be necessary
    :param address:
    :return:
    """
    regex = re.compile('[^a-zA-Z0-9 ]')
    address = addr1 if addr2 is None else f'{addr1} {addr2}'
    address_tokens = [tkn if tkn.isalpha() else tkn.replace('PH', '').replace('APT', '').replace('NO', '')
                      for tkn in regex.sub('', address).upper().split(' ')]
    return set(ADDRESS_MAP.get(tkn, tkn) for tkn in address_tokens if tkn != '') - ADDRESS_IGNORE


def in_portland(longitude: str, latitude: str) -> bool:
    """
    Returns true if lat/long are within city limits
    NB PostGIS places longitude first!
    :param city:
    :param zip_code:
    :return:
    """

    with psycopg2.connect(**db.POSTGRES_LOGIN) as conn:
        with conn.cursor() as curr:
            cmd = f"SELECT ST_Contains(the_geom, ST_Transform(ST_GeomFromText('Point({longitude} {latitude})',4326)," \
                + f" 900914)) FROM city_limits WHERE cityname='Portland'"
            curr.execute(cmd)
            dbresult = curr.fetchall()

    return (dbresult == 't')


def query_name_address(last_name: Optional[str] = None, first_name: Optional[str] = None,
                       zip_code: Optional[str] = None, addr1: Optional[str] = None, addr2: Optional[str] = None,
                       name_levenshtein: int = 0, address_levenshtein: int = 0,
                       zip_levenshtein: int = 0) -> np.ndarray:

    """
    Query database for donors
    :param last_name:
    :param first_name:
    :param zip_code:
    :param address:
    :param name_levenshtein:
    :param address_levenshtein:
    :param zip_levenshtein:
    :return:
    """

    where_stmt = ''

    if last_name is not None:
        if name_levenshtein > 0:
            where_stmt += f" and levenshtein(last_name,'{last_name.upper()}') <= {name_levenshtein:d}"
        else:
            where_stmt += f" and last_name = '{last_name.upper()}'"

    if first_name is not None:
        if name_levenshtein > 0:
            where_stmt += f" and levenshtein(first_name,'{first_name.upper()}') <= {name_levenshtein:d}"
        else:
            where_stmt += f" and first_name = '{first_name.upper()}'"

    if zip_code is not None:
        if zip_levenshtein > 0:
            where_stmt += f" and levenshtein(zip_code,'{zip_code}') <= {zip_levenshtein:d}"
        else:
            where_stmt += f" and zip_code = '{zip_code}'"

    if addr1 is not None:
        if address_levenshtein > 0:
            where_stmt += f" and levenshtein(address_1,'{addr1.upper()}') <= {address_levenshtein:d}"
        else:
            where_stmt += f" and address_1 = '{addr1.upper()}'"

    if addr2 is not None:
        if address_levenshtein > 0:
            where_stmt += f" and levenshtein(address_2,'{addr2.upper()}') <= {address_levenshtein:d}"
        else:
            where_stmt += f" and address_2 = '{addr2.upper()}'"

    # add zip constraint from George
    zip_list = ', '.join(f"'{tmp}'" for tmp in PORTLAND_ZIP_CODES)
    where_stmt += f" and zip_code in ({zip_list})"
    # Remove leading and
    where_stmt = where_stmt[4:]

    with psycopg2.connect(**db.POSTGRES_LOGIN) as conn:
        with conn.cursor() as curr:
            cmd = f"SELECT id, first_name, last_name, address_1, address_2, city, state, zip_code" \
                  + f" FROM {db.UNIFIED_TABLE} WHERE " \
                  + where_stmt
            curr.execute(cmd)
            dbresult = curr.fetchall()

    data = np.unique(np.array(dbresult, dtype=np.dtype([('id', 'U256'),
                                                        ('first_name', 'U256'),
                                                        ('last_name', 'U256'),
                                                        ('address_1', 'U2556'),
                                                        ('address_2', 'U256'),
                                                        ('city', 'U256'),
                                                        ('state', 'U256'),
                                                        ('zip', 'U256')])))

    return data


def get_match(last_name: Optional[str] = None, first_name: Optional[str] = None,
              zip_code: Optional[str] = None, addr1: Optional[str] = None,
              addr2: Optional[str] = None, city: Optional[str] = None,
              state: Optional[str] = None, max_num_matches: int = 10) -> Dict[str, np.ndarray]:
    """
    Find all possible matches for donor: exact, then strong + weak, then none
    This is a modification of George's original get_match algorithm
    :param last_name:
    :param first_name:
    :param zip_code:
    :param addr1:
    :param addr2:
    :param city:
    :param state:
    :return:
    """

    data = query_name_address(last_name=last_name, first_name=first_name, zip_code=zip_code, addr1=addr1, addr2=addr2)

    if data.size == 0:
        data = query_name_address(last_name=last_name, zip_code=zip_code)

    if data.size == 0:
        data = query_name_address(last_name=last_name, first_name=first_name, zip_code=zip_code, name_levenshtein=2)

    if data.size == 0:
        data_softname = query_name_address(last_name=last_name, first_name=first_name, name_levenshtein=2)
        data_softaddress = query_name_address(addr1=addr1, addr2=addr2, zip_code=zip_code, address_levenshtein=2)
        data = np.hstack((data_softaddress, data_softname))

    matches = []
    if data.size > 0:
        # may want to integrate addr2 eventually - see ticket #328

        address_tokens = tokenize_address(addr1, addr2)
        for record in data:
            rec_address_tokens = tokenize_address(record['address_1'], record['address_2'])
            # do we want to tokenize res_address_2 too?

            if len(address_tokens) <= len(rec_address_tokens):
                similarities = [np.max([leven.ratio(tkn1, tkn2) for tkn2 in rec_address_tokens])
                                for tkn1 in address_tokens]
            else:
                similarities = [np.max([leven.ratio(tkn1, tkn2) for tkn2 in address_tokens])
                                for tkn1 in rec_address_tokens]

            addr_sim = np.mean(similarities)

            first_name_sim = leven.ratio(first_name.upper(), record['first_name'].upper())
            last_name_sim = leven.ratio(last_name.upper(), record['last_name'].upper())
            zip_sim = leven.ratio(zip_code, record['zip'])

            matches.append(tuple(list(record) + [addr_sim, zip_sim, first_name_sim, last_name_sim]))

    matches = np.array(matches, dtype=np.dtype(data.dtype.descr + [('address_sim', np.float),
                                                                   ('zip_sim', np.float),
                                                                   ('first_name_sim', np.float),
                                                                   ('last_name_sim', np.float)]))

    # Sort matches
    index = np.argsort(matches[['last_name_sim', 'zip_sim', 'address_sim', 'first_name_sim']])[::-1]
    matches = matches[index]

    is_exact = (matches['last_name_sim'] == 1) & \
               (matches['first_name_sim'] == 1) & \
               (matches['address_sim'] == 1) & \
               (matches['zip_sim'] == 1)

    is_strong = ~is_exact & \
                (matches['last_name_sim'] == 1) & \
                (matches['first_name_sim'] >= 0.8) & \
                (matches['address_sim'] >= 0.9) & \
                (matches['zip_sim'] == 1)

    is_weak = ~is_exact & ~is_strong & \
              (((matches['last_name_sim'] == 1) & (matches['first_name_sim'] >= 0.8)) |
               ((matches['address_sim'] >= 0.9) & (matches['zip_sim'] == 1)))

    # Do we want to add a flag to indicate the specified address is not in Portland
    return {'exact': matches[is_exact][:max_num_matches],
            'strong': matches[is_strong][:max_num_matches],
            'weak': matches[is_weak][:max_num_matches]}


def cli() -> None:
    """
    Command line interface for get_match. Prints JSON output.
    >>> # Call from top level directory
    >>> python -m openelections.donor_lookup.match --first_name John --last_name Smith ...
    >>> --addr1 "123 Main" --zip_code 97202 --city Portland
    """
    try:
        from argparse import ArgumentParser

        aparser = ArgumentParser()
        aparser.add_argument("--last_name", dest="last_name", type=str)
        aparser.add_argument("--first_name", dest="first_name", type=str)
        aparser.add_argument("--zip_code", dest="zip_code", type=str)
        aparser.add_argument("--addr1", dest="addr1", type=str)
        aparser.add_argument("--addr2", dest="addr2", default=None, type=str)
        aparser.add_argument("--city", dest="city", default=None, type=str)
        #we are assuming that this is called from the command line. TBD if not
        aparser.add_argument("--latitude", dest="latitude", type=str)
        aparser.add_argument("--longitude", dest="longitude", type=str)
        aparser.add_argument("--max_matches", dest="max_matches", default=10, type=int)

        options = vars(aparser.parse_args())

        matches = get_match(last_name=options['last_name'], first_name=options['first_name'],
                            zip_code=options['zip_code'], addr1=options['addr1'],
                            addr2=options['addr2'], city=options['city'], max_num_matches=options['max_matches'])

        matches_dict = dict()
        for mtype, tmatches in matches.items():
            fields = tmatches.dtype.names
            matches_dict[mtype] = []
            for match in tmatches:
                matches_dict[mtype].append({field: str(match[field]) for field in fields})

        # Add donor information to outout
        donor = {key: str(val).upper() if val is not None else "" for key, val in options.items()}
        donor['eligible_address'] = str(in_portland(longitude=options['longitude'], latitude=options['latitude']))
        matches_dict['donor_info'] = donor

        # Print JSON output
        print(json.dumps(matches_dict))

    except BaseException:
        # Catch error and print message to stdout
        print(traceback.format_exc())


if __name__ == '__main__':
    cli()
