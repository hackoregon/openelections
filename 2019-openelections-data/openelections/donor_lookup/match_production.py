"""
Natalia's attempt at productionizing George's initial match code.

Goals:
1. This is a flow chart rule diagram
2. Fire "green" signal if exact match goes
3. If exact match not true, shunt to different fuzzy matching algo, return list of signals and possible matches
"""

import pickle
import os
import Levenshtein as leven
from typing import Optional
import numpy as np
import openelections.data.database as db
from psycopg2 import connect
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

'''
Will we need the pickles when this is running on a server?

Handled separately as functionality
'''

def save(obj: object, filename: str):
    """
    Save to pickle file

    :param obj:
    :param filename:
    :return:
    """
    with open(filename, 'wb') as fout:
        pickle.dump(obj, fout)


def load(filename: str) -> object:

    """
    Load from pickle file

    :param filename:
    :return:
    """
    if not os.path.exists(filename):
        raise Exception(f"Unable to find file {filename}")

    with open(filename, 'rb') as fin:
        obj = pickle.load(fin)

    return obj


'''
This is actually the start of the process, when the command line passes in an address
grab CLI with str(input()) <- note that I : cast explicitly to string 
Note I don't actually know data specs when it's passed to the DS layer
'''

def tokenize_address(addr1: Optional[str] = None, addr2: Optional[str]= None):
    """
    Sanitize and tokenize address
    This may not be necessary

    :param address:
    :return:
    """
    regex = re.compile('[^a-zA-Z0-9 ]')
    if addr2 is None:
        address_tokens = [tkn if tkn.isalpha() else tkn.replace('PH', '').replace('APT', '').replace('NO', '')
                      for tkn in regex.sub('', addr1).upper().split(' ')]
    else:
        address = addr1 + addr2
        address_tokens = [tkn if tkn.isalpha() else tkn.replace('PH', '').replace('APT', '').replace('NO', '')
                  for tkn in regex.sub('', address).upper().split(' ')]

    return set(ADDRESS_MAP.get(tkn, tkn) for tkn in address_tokens if tkn != '') - ADDRESS_IGNORE


def in_portland(city, zip):
    """
    Returns true if city and zip are both Portland-esque

    :param city:
    :param zip:
    :return:
    """
    return (city == 'PORTLAND') and (zip in PORTLAND_ZIP_CODES)


def query_name_address(last_name: Optional[str] = None, first_name: Optional[str] = None,
                       zip_code: Optional[str] = None, addr1: Optional[str] = None, addr2:Optional[str] = None,
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

    with connect(**db.POSTGRES_LOGIN) as conn:
        with conn.cursor() as curr:
            cmd = f"SELECT first_name, last_name, address_1, address_2, city, state, zip_code" \
                  + f" FROM {db.UNIFIED_TABLE} WHERE " \
                  + where_stmt
            curr.execute(cmd)
            dbresult = curr.fetchall()

    data = np.unique(np.array(dbresult, dtype=np.dtype([('first_name', 'U128'),
                                                        ('last_name', 'U128'),
                                                        ('res_address_1', 'U128'),
                                                        ('res_address_2', 'U128'),
                                                        ('city', 'U128'),
                                                        ('state', 'U128'),
                                                        ('zip', 'U128')])))

    return data


def get_match(last_name: Optional[str] = None, first_name: Optional[str] = None,
              zip_code: Optional[str] = None, addr1: Optional[str] = None,
              addr2: Optional[str] = None, city: Optional[str] = None):
    """
    Find all possible matches for donor: exact, then strong + weak, then none

    This is a modification of George's original get_match algorithm

    :param name:
    :param addr1:
    :param zip_code:
    :return:
    """

    if addr2 is None:
        data = query_name_address(last_name=last_name, first_name=first_name, zip_code=zip_code, addr1=addr1, addr2=addr2)
    else:
        data = query_name_address(last_name=last_name, first_name=first_name, zip_code=zip_code, addr1=addr1, addr2=addr2)


    found_exact = data.size > 0

    found_name_zip = False
    if data.size == 0:
        data = query_name_address(last_name=last_name, zip_code=zip_code)
        found_name_zip = data.size > 0

    found_softname_zip = False
    if data.size == 0:
        data = query_name_address(last_name=last_name, first_name=first_name, zip_code=zip_code, name_levenshtein=2)
        found_softname_zip = data.size > 0

    found_softname = False
    found_softaddress = False
    if data.size == 0:
        data_softname = query_name_address(last_name=last_name, first_name=first_name, name_levenshtein=2)

        if addr2 is None:
            data_softaddress = query_name_address(addr1=addr1, zip_code=zip_code, address_levenshtein=2)
        else:
            data_softaddress = query_name_address(addr1=addr1, addr2 = addr2, zip_code=zip_code, address_levenshtein=2)


        found_softaddress = data_softname.size > 0
        found_softname = data_softaddress.size > 0

        data = np.hstack((data_softaddress, data_softname))

    matches = []
    if data.size > 0:
        # may want to integrate addr2 eventually - see ticket #328

        address_tokens = tokenize_address(addr1, addr2)
        for record in data:
            rec_address_tokens = tokenize_address(record['res_address_1'], record['res_address_2'])

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
            correct_city = in_portland(record['city'].upper(), record['zip'])
            #this is currently using City as reported in possible matches
            #we may not need to include city in the function call

            if (found_name_zip or found_softname_zip) and addr_sim >= 0.9:
                matches.append(tuple(list(record) + [addr_sim, zip_sim, first_name_sim, last_name_sim, correct_city]))
            elif found_softname or found_softaddress:
                matches.append(tuple(list(record) + [addr_sim, zip_sim, first_name_sim, last_name_sim, correct_city]))

    matches = np.array(matches, dtype=np.dtype(data.dtype.descr + [('address_sim', np.float),
                                                         ('zip_sim', np.float),
                                                         ('first_name_sim', np.float),
                                                         ('last_name_sim', np.float),
                                                         ('correct_city', np.float)]))
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
              (((matches['last_name_sim'] == 1) & \
                (matches['first_name_sim'] >= 0.8)) | \
               ((matches['address_sim'] >= 0.9) & \
                (matches['zip_sim'] == 1)))

    return {'exact': matches[is_exact],
            'strong': matches[is_strong],
            'weak': matches[is_weak]}
##We need something in here that tells me if the zip code is just wrong


def cli():
    from argparse import ArgumentParser

    #(last_name="Zhang", first_name="Natasha", zip_code = "97123", addr1="563 SW 201st ST")

    aparser = ArgumentParser()
    aparser.add_argument("--last_name", dest="last_name", type=str)
    aparser.add_argument("--first_name", dest="first_name", type=str)
    aparser.add_argument("--zip_code", dest="zip_code", type=str)
    aparser.add_argument("--addr1", dest="addr1", type=str)
    aparser.add_argument("--addr2", dest="addr2", default=None, type=str)
    aparser.add_argument("--city", dest="city", default=None, type=str)

    options = vars(aparser.parse_args())

    matches = get_match(last_name=options['last_name'], first_name=options['first_name'],
                                zip_code = options['zip_code'], addr1=options['addr1'],
                                addr2=options['addr2'], city = options['city'])

    # for mtype, tmatches in matches.items():
    #     print(mtype)
    #     print(tmatches)

    matches_dict = dict()
    for mtype, tmatches in matches.items():
        fields = sorted(tmatches.dtype.names)
        matches_dict[mtype] = []
        for match in tmatches:
            matches_dict[mtype].append({field: match[field] for field in fields})

    j = json.dumps(matches_dict)
    print(j)

if __name__ == '__main__':
    cli()