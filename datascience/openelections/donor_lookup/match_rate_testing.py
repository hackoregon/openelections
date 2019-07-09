"""
Code for testing/estimating match rate
"""

import pickle
import os
import time
import numpy as np
import openelections.data.database as db
from openelections import _RESOURCES
from psycopg2 import connect
from datetime import datetime
from openelections.donor_lookup.match import get_match, PORTLAND_ZIP_CODES


USE_SAVED_FILES = True  # Set to True if you want to use previously saved data


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
    runtimes = []
    for record in orestar:
        start_time = time.time()
        first_name, last_name = record['contributor_payee'].split(' ')
        local_matches = get_match(first_name=first_name,
                                  last_name=last_name,
                                  addr1=record['addr_line1'],
                                  addr2=record['addr_line2'],
                                  city=record['city'],
                                  state=record['state'],
                                  zip_code=record['zip'])
        local_matches['cont'] = record
        matches.append(local_matches)
        runtimes.append(time.time() - start_time)

    print(f'Average lookup time: {np.mean(runtimes):0,.3}sec')
    save(filename=os.path.join(_RESOURCES, 'orestar.pickle'), obj=orestar)
    save(filename=os.path.join(_RESOURCES, 'orestar_matches.pickle'), obj=matches)

else:
    print('USING SAVED DATA')
    orestar = load(os.path.join(_RESOURCES, 'orestar.pickle'))
    matches = load(os.path.join(_RESOURCES, 'orestar_matches.pickle'))

rate_weak = np.mean([len(tmp["weak"]) > 0 and len(tmp["strong"]) == 0 and len(tmp["exact"]) == 0 for tmp in matches])
rate_strong = np.mean([len(tmp["strong"]) > 0 and len(tmp["exact"]) == 0 for tmp in matches])
rate_exact = np.mean([len(tmp["exact"]) > 0 for tmp in matches])

print(f'Number of Orestar Donation Found: {orestar.size:,d}')
print(f'Weak Match Rate: {rate_weak:0.2%}')
print(f'Strong Match Rate: {rate_strong:0.2%}')
print(f'Exact Match Rate: {rate_exact:0.2%}')
