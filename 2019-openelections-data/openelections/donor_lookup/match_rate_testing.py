"""
Code for testing/estimating match rate
"""

import pickle
import os
import Levenshtein as leven
from typing import Optional
import numpy as np
import openelections.data.database as db
from openelections import _RESOURCES
from psycopg2 import connect
import re
from datetime import datetime


USE_SAVED_FILES = False  # Set to True if you want to use previously saved data

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
        raise Exception(f"Unable to fine file {filename}")

    with open(filename, 'rb') as fin:
        obj = pickle.load(fin)

    return obj


def tokenize_address(address):
    """
    Sanitize and tokenize address

    :param address:
    :return:
    """
    regex = re.compile('[^a-zA-Z0-9 ]')
    address_tokens = [tkn if tkn.isalpha() else tkn.replace('PH', '').replace('APT', '').replace('NO', '')
                      for tkn in regex.sub('', address).upper().split(' ')]
    return set(ADDRESS_MAP.get(tkn, tkn) for tkn in address_tokens if tkn != '') - ADDRESS_IGNORE


def query_name_address(last_name: Optional[str] = None, first_name: Optional[str] = None,
                       zip_code: Optional[str] = None, address: Optional[str] = None,
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

    if address is not None:
        if address_levenshtein > 0:
            where_stmt += f" and levenshtein(res_address_1,'{address.upper()}') <= {address_levenshtein:d}"
        else:
            where_stmt += f" and res_address_1 = '{address.upper()}'"

    # Remove leading and
    where_stmt = where_stmt[4:]

    with connect(**db.POSTGRES_LOGIN) as conn:
        with conn.cursor() as curr:
            cmd = f"SELECT first_name, last_name, house_num, res_address_1, res_address_2, city, state, zip_code" \
                  + f" FROM {db.VOTER_LIST_TABLE} WHERE " \
                  + where_stmt
            curr.execute(cmd)
            dbresult = curr.fetchall()

            cmd = f"SELECT first_name, last_name, house_num, eff_address_1, eff_address_2, eff_city, eff_state," \
                  + " eff_zip_code" \
                  + f" FROM {db.VOTER_LIST_TABLE} WHERE " \
                  + ' eff_address_1 != res_address_1 and ' \
                  + where_stmt.replace('zip_code', 'eff_zip_code').replace('res_address_1', 'eff_address_1')
            curr.execute(cmd)
            dbresult += curr.fetchall()

    data = np.unique(np.array(dbresult, dtype=np.dtype([('first_name', 'U128'),
                                                        ('last_name', 'U128'),
                                                        ('house_num', 'U128'),
                                                        ('res_address_1', 'U128'),
                                                        ('res_address_2', 'U128'),
                                                        ('city', 'U128'),
                                                        ('state', 'U128'),
                                                        ('zip', 'U128')])))

    return data


def get_match(name: str, addr1: str, addr2: str, city: str, state: str, zip_code: str, amount: float):
    """
    Find all possible matches for donor

    :param name:
    :param addr1:
    :param addr2:
    :param city:
    :param state:
    :param zip_code:
    :param amount:
    :return:
    """
    name1, name2 = name.upper().split(' ')

    data = query_name_address(last_name=name2, zip_code=zip_code)
    found_name_zip = data.size > 0

    found_softname_zip = False
    if data.size == 0:
        data = query_name_address(last_name=name2, first_name=name1, zip_code=zip_code, name_levenshtein=2)
        found_softname_zip = data.size > 0

    found_softname = False
    found_softaddress = False
    if data.size == 0:
        data_softname = query_name_address(last_name=name2, first_name=name1, name_levenshtein=2)
        data_softaddress = query_name_address(address=addr1, zip_code=zip_code, address_levenshtein=2)
        found_softaddress = data_softname.size > 0
        found_softname = data_softaddress.size > 0

        data = np.hstack((data_softaddress, data_softname))

    matches = []
    if data.size > 0:

        address_tokens = tokenize_address(addr1)
        for record in data:
            rec_address_tokens = tokenize_address(record['res_address_1'])

            if len(address_tokens) <= len(rec_address_tokens):
                similarities = [np.max([leven.ratio(tkn1, tkn2) for tkn2 in rec_address_tokens])
                                for tkn1 in address_tokens]
            else:
                similarities = [np.max([leven.ratio(tkn1, tkn2) for tkn2 in address_tokens])
                                for tkn1 in rec_address_tokens]

            addr_sim = np.mean(similarities)

            first_name_sim = leven.ratio(name1, record['first_name'])
            last_name_sim = leven.ratio(name2, record['last_name'])
            zip_sim = leven.ratio(zip_code, record['zip'])

            if (found_name_zip or found_softname_zip) and addr_sim >= 0.9:
                matches.append(tuple(list(record) + [addr_sim, zip_sim, first_name_sim, last_name_sim]))
            elif found_softname or found_softaddress:
                matches.append(tuple(list(record) + [addr_sim, zip_sim, first_name_sim, last_name_sim]))

    return np.array(matches, dtype=np.dtype(data.dtype.descr + [('address_sim', np.float),
                                                                ('zip_sim', np.float),
                                                                ('first_name_sim', np.float),
                                                                ('last_name_sim', np.float)]))


def get_orestar():
    """
    Get Orestar data to use for testing

    :return:
    """

    with connect(**db.POSTGRES_LOGIN) as conn:
        with conn.cursor() as curr:
            zip_list = ', '.join(f"'{tmp}'" for tmp in PORTLAND_ZIP_CODES)
            cmd = f"SELECT contributor_payee, amount, addr_line1, addr_line2, city, state, zip," \
                  + f" tran_date FROM {db.ORESTAR_TABLE}" \
                  + " WHERE sub_type = 'Cash Contribution'" \
                  + " and (not addr_line1 = '')" \
                  + f" and zip in ({zip_list})" \
                  + " and city = 'Portland'" \
                  + " and tran_date < '2016-11-08' and tran_date > '2016-01-01'"
            curr.execute(cmd)
            dbresult = curr.fetchall()

    orestar = np.array(dbresult, dtype=np.dtype([('contributor_payee', 'U128'),
                                                 ('amount', np.float),
                                                 ('addr_line1', 'U128'),
                                                 ('addr_line2', 'U128'),
                                                 ('city', 'U128'),
                                                 ('state', 'U128'),
                                                 ('zip', 'U128'),
                                                 ('tran_date', datetime)]))

    valid_payee = np.array([len(payee.split(' ')) == 2 and np.all([tmp.isalpha() for tmp in payee.split(' ')]) for
                            payee in orestar['contributor_payee']])
    orestar = orestar[valid_payee]

    return orestar


if not USE_SAVED_FILES:
    orestar = get_orestar()
    matches = []
    for record in orestar:
        matches.append(get_match(name=record['contributor_payee'],
                                 addr1=record['addr_line1'],
                                 addr2=record['addr_line2'],
                                 city=record['city'],
                                 state=record['state'],
                                 zip_code=record['zip'],
                                 amount=record['amount']))

    save(filename=os.path.join(_RESOURCES, 'orestar.pickle'), obj=orestar)
    save(filename=os.path.join(_RESOURCES, 'orestar_matches.pickle'), obj=matches)

else:
    print('USING SAVED DATA')
    orestar = load(os.path.join(_RESOURCES, 'orestar.pickle'))
    matches = load(os.path.join(_RESOURCES, 'orestar_matches.pickle'))

records_with_matches = [{'cont': cont,
                         'strong': lmatches[(lmatches['last_name_sim'] == 1) &
                                            (lmatches['first_name_sim'] >= 0.8) &
                                            (lmatches['address_sim'] >= 0.9) &
                                            (lmatches['zip_sim'] == 1)],
                         'weak': lmatches[((lmatches['last_name_sim'] == 1) &
                                           (lmatches['first_name_sim'] >= 0.8)) |
                                          ((lmatches['address_sim'] >= 0.9) &
                                           (lmatches['zip_sim'] == 1))],
                         'possible': lmatches} for cont, lmatches in zip(orestar, matches)]

print(f'Number of Orestar Donation Found: {orestar.size:,d}')
print(f'Weak Match Rate: {np.mean([len(tmp["weak"]) > 0 for tmp in records_with_matches]):0.2%}')
print(f'Strong Match Rate: {np.mean([len(tmp["strong"]) > 0 for tmp in records_with_matches]):0.2%}')


weak_matches = [tmp for tmp in records_with_matches if tmp['weak'].size > 0 and tmp['strong'].size == 0]
strong_matches = [tmp for tmp in records_with_matches if tmp['strong'].size > 0]
no_matches = [tmp for tmp in records_with_matches if tmp['weak'].size == 0]
possible_matches = [tmp for tmp in records_with_matches if tmp['possible'].size > 0 and tmp['weak'].size == 0]
