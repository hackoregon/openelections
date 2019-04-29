from typing import Dict
import json
from functools import lru_cache
from openelections import _POSTGRES_LOGIN_FILE, _VOTER_LIST
from psycopg2 import connect
import psycopg2.errors as psqerrors
import pandas as pd

VOTER_LIST_KEY = {'FIRST_NAME': str,
                  'MIDDLE_NAME': str,
                  'LAST_NAME': str,
                  'HOUSE_NUM': str,
                  'COUNTY': str,
                  'EFF_ADDRESS_1': str,
                  'EFF_ADDRESS_2': str,
                  'EFF_ADDRESS_3': str,
                  'EFF_ADDRESS_4': str,
                  'EFF_CITY': str,
                  'EFF_STATE': str,
                  'EFF_ZIP_CODE': str,
                  'EFF_ZIP_PLUS_FOUR': str,
                  'RES_ADDRESS_1': str,
                  'RES_ADDRESS_2': str,
                  'STATE': str,
                  'ZIP_CODE': str,
                  'ZIP_PLUS_FOUR': str}

VOTER_LIST_TABLE = 'voter_list'


@lru_cache(1)
def _get_db_login_info() -> Dict[str, str]:
    '''
    Get database login details.  Looks for _POSTGRES_LOGIN_FILE.

    File schema:

        {
            "host": "xxx",
            "port": "xxx",
            "database": "xxx",
            "user": "xxx",
            "password": "xxx"
        }

    :return:
    '''

    with open(_POSTGRES_LOGIN_FILE, 'r') as f:
        login_info = json.load(f)
    return login_info


POSTGRES_LOGIN = _get_db_login_info()


def create_table(table_name: str, field_key: Dict[str, str], drop_if_exists: bool = False):
    """
    Crates a database table with specified name and fields

    :param table_name: Table name
    :param field_key: Dictionary of field names and data types
    :return:
    """

    with connect(**POSTGRES_LOGIN) as conn:
        with conn.cursor() as curr:

            # Check if table already exists
            cmd = "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
            curr.execute(cmd)
            dbresult = curr.fetchall()
            current_tables = list(zip(*dbresult))[0]

            if table_name in current_tables:
                if drop_if_exists:
                    print('Deleting existing table')
                    cmd = f'drop table {table_name}'
                    curr.execute(cmd)
                else:
                    raise psqerrors.DuplicateTable

            fields = ', '.join((f'{field} {"VARCHAR(255)" if dtype == str else dtype}' for field, dtype in
                                field_key.items()))
            cmd = f'CREATE TABLE {table_name} ({fields})'
            curr.execute(cmd)


def initialize_voter_list():
    """
    Initializes the voter list table
    """

    # Create voter list table
    create_table(table_name=VOTER_LIST_TABLE, field_key=VOTER_LIST_KEY, drop_if_exists=True)

    # Load voter list data from file
    data = pd.read_csv(_VOTER_LIST, sep='\t', encoding="latin",
                       usecols=list(VOTER_LIST_KEY.keys()), dtype=VOTER_LIST_KEY, keep_default_na=False)

    cmd = f'INSERT INTO {VOTER_LIST_TABLE} ({",".join(data.keys())}) VALUES ({",".join(["%s" for f in data.keys()])})'
    with connect(**POSTGRES_LOGIN) as conn:
        with conn.cursor() as curr:
            curr.executemany(cmd, data.to_numpy())
