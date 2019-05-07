"""
Database module
"""
import os
from typing import Dict, List, Optional
import json
from functools import lru_cache
from openelections import _POSTGRES_LOGIN_FILE, _VOTER_LIST, _ORESTAR_PATH
from psycopg2 import connect
import psycopg2.errors as psqerrors
import pandas as pd

VOTER_LIST_TABLE = 'voter_list'
VOTER_LIST_KEY = {'FIRST_NAME': 'VARCHAR(255)',
                  'MIDDLE_NAME': 'VARCHAR(255)',
                  'LAST_NAME': 'VARCHAR(255)',
                  'HOUSE_NUM': 'VARCHAR(255)',
                  'COUNTY': 'VARCHAR(255)',
                  'EFF_ADDRESS_1': 'VARCHAR(255)',
                  'EFF_ADDRESS_2': 'VARCHAR(255)',
                  'EFF_ADDRESS_3': 'VARCHAR(255)',
                  'EFF_ADDRESS_4': 'VARCHAR(255)',
                  'EFF_CITY': 'VARCHAR(255)',
                  'EFF_STATE': 'VARCHAR(255)',
                  'EFF_ZIP_CODE': 'VARCHAR(255)',
                  'EFF_ZIP_PLUS_FOUR': 'VARCHAR(255)',
                  'RES_ADDRESS_1': 'VARCHAR(255)',
                  'RES_ADDRESS_2': 'VARCHAR(255)',
                  'STATE': 'VARCHAR(255)',
                  'ZIP_CODE': 'VARCHAR(255)',
                  'ZIP_PLUS_FOUR': 'VARCHAR(255)'}

ORESTAR_TABLE = 'orestar'
ORESTAR_KEY = {'Tran Id': 'VARCHAR(255)',
               'Original Id': 'VARCHAR(255)',
               'Filer': 'VARCHAR(255)',
               'Contributor/Payee': 'VARCHAR(255)',
               'Sub Type': 'VARCHAR(255)',
               'Amount': 'FLOAT',
               'Aggregate Amount': 'FLOAT',
               'Filer Id': 'VARCHAR(255)',
               'Attest By Name': 'VARCHAR(255)',
               'Addr Line1': 'VARCHAR(255)',
               'Addr Line2': 'VARCHAR(255)',
               'City': 'VARCHAR(255)',
               'State': 'VARCHAR(255)',
               'Zip': 'VARCHAR(255)',
               'Zip Plus Four': 'VARCHAR(255)',
               'County': 'VARCHAR(255)',
               'Attest Date': 'TIMESTAMP',
               'Tran Date': 'TIMESTAMP'}


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

            fields = ', '.join((f'{field.replace(" ", "_").replace("/", "_")} {dtype}' for field, dtype in
                                field_key.items()))
            cmd = f'CREATE TABLE {table_name} ({fields})'
            curr.execute(cmd)


def initialize_voter_list(zip_codes: Optional[List[str]] = None):
    """
    Initializes the voter list table

    :param zip_codes: List of zip codes to load.  Loads all if not specified.

    >>> initialize_voter_list(zip_codes=['97080'])
    """

    # Create voter list table
    create_table(table_name=VOTER_LIST_TABLE, field_key=VOTER_LIST_KEY, drop_if_exists=True)

    # Load voter list data from file
    data = pd.read_csv(_VOTER_LIST, sep='\t', encoding="latin",
                       usecols=list(VOTER_LIST_KEY.keys()),
                       dtype={field: str for field in VOTER_LIST_KEY.keys()},
                       keep_default_na=False)

    if zip_codes is not None:
        data = data[data['ZIP_CODE'].isin(zip_codes)]

    cmd = f'INSERT INTO {VOTER_LIST_TABLE} ({",".join(data.keys())}) VALUES ({",".join(["%s" for f in data.keys()])})'
    with connect(**POSTGRES_LOGIN) as conn:
        with conn.cursor() as curr:
            curr.executemany(cmd, data.to_numpy())


def initialize_orestar():
    """
    Initializes the Orestar table

    >>> initialize_orestar()
    """
    # Create orestar table
    create_table(table_name=ORESTAR_TABLE, field_key=ORESTAR_KEY, drop_if_exists=True)

    # Load voter list data from file
    data_files = [os.path.join(_ORESTAR_PATH, fname) for fname in os.listdir(_ORESTAR_PATH) if fname.endswith('.csv')]
    data = pd.concat((pd.read_csv(dfile,
                                  keep_default_na=False,
                                  usecols=list(ORESTAR_KEY.keys()),
                                  dtype={field: str for field in ORESTAR_KEY.keys()}) for dfile in data_files))

    # Rename all columns to remove spaces
    data.columns = [cname.replace(" ", "_").replace("/", "_") for cname in data.columns]

    cmd = f'INSERT INTO {ORESTAR_TABLE} ({",".join(data.keys())}) VALUES ({",".join(["%s" for f in data.keys()])})'
    with connect(**POSTGRES_LOGIN) as conn:
        with conn.cursor() as curr:
            curr.executemany(cmd, data.to_numpy())
