"""
Match test module
"""
from typing import List, Tuple
import numpy as np
from unittest.mock import patch, MagicMock


def setup_mock_connect(mock_connect: MagicMock, test_data: List[Tuple[str]]) -> None:
    """
    Setup mock postgres connect to return specified data
    """

    mock_cursor = MagicMock()
    mock_cursor.__enter__.return_value.fetchall.return_value = test_data
    mock_connect.return_value.__enter__.return_value.cursor.return_value = mock_cursor


class TestGetMatch():
    """
    Test class for get_match
    """

    @patch('psycopg2.connect')
    def test_exact_match(self, mock_connect):
        """
        Test for exact match
        """
        test_data = [('XX3X', 'JOHN', 'SMITH', '123 MAIN STREET', '', 'PORTLAND', 'OR', '97202')]
        setup_mock_connect(mock_connect=mock_connect, test_data=test_data)

        from openelections.donor_lookup.match import get_match
        matches = get_match(last_name='Smith', first_name='John',
                            addr1='123 main street', zip_code='97202', city='Portland')

        # No weak or strong matches
        assert matches['weak'].size == 0 & matches['strong'].size == 0

        # One exact match
        assert matches['exact'].size == 1

        # Scores correct
        ematch = matches['exact'][0]
        assert ematch['address_sim'] == 1 and ematch['first_name_sim'] == 1 and ematch['last_name_sim'] == 1

    @patch('psycopg2.connect')
    def test_exact_match_addr2(self, mock_connect):
        """
        Test for exact match with address line 2
        """
        test_data = [('XX3X', 'JOHN', 'SMITH', '123 MAIN STREET', 'UNIT 102', 'PORTLAND', 'OR', '97202'),
                     ('XX3Y', 'JOHN', 'SMITH', '123 MAIN STREET', 'UNIT 10', 'PORTLAND', 'OR', '97202')]
        setup_mock_connect(mock_connect=mock_connect, test_data=test_data)

        from openelections.donor_lookup.match import get_match
        matches = get_match(last_name='Smith', first_name='John',
                            addr1='123 main street', addr2='Unit 102', zip_code='97202', city='Portland')

        # No weak
        assert matches['weak'].size == 0

        # One exact match
        assert matches['exact'].size == 1

        # One strong match
        assert matches['strong'].size == 1

        # Scores correct
        ematch = matches['exact'][0]
        assert ematch['address_sim'] == 1 and ematch['first_name_sim'] == 1 and ematch['last_name_sim'] == 1
        assert ematch['address_2'] == 'UNIT 102'

    @patch('psycopg2.connect')
    def test_exact_match_addr2_cat(self, mock_connect):
        """
        Test for exact match when address line 2 concatenated with address line 1 in DB
        """
        test_data = [('XX3X', 'JOHN', 'SMITH', '123 MAIN STREET UNIT 10', '', 'PORTLAND', 'OR', '97202')]
        setup_mock_connect(mock_connect=mock_connect, test_data=test_data)

        from openelections.donor_lookup.match import get_match
        matches = get_match(last_name='Smith', first_name='John',
                            addr1='123 main street', addr2='UNIT 10', zip_code='97202', city='Portland')

        # No weak or strong matches
        assert matches['weak'].size == 0 & matches['strong'].size == 0

        # One exact match
        assert matches['exact'].size == 1

        # Scores correct
        ematch = matches['exact'][0]
        assert ematch['address_sim'] == 1 and ematch['first_name_sim'] == 1 and ematch['last_name_sim'] == 1

    @patch('psycopg2.connect')
    def test_exact_match_addr2_miss(self, mock_connect):
        """
        Test for exact match when address line 2 missing
        """
        test_data = [('XX3X', 'JOHN', 'SMITH', '123 MAIN STREET', 'UNIT 10', 'PORTLAND', 'OR', '97202')]
        setup_mock_connect(mock_connect=mock_connect, test_data=test_data)

        from openelections.donor_lookup.match import get_match
        matches = get_match(last_name='Smith', first_name='John',
                            addr1='123 main street', zip_code='97202', city='Portland')

        # No weak or strong matches
        assert matches['weak'].size == 0 & matches['strong'].size == 0

        # One exact match
        assert matches['exact'].size == 1

        # Scores correct
        ematch = matches['exact'][0]
        assert ematch['address_sim'] == 1 and ematch['first_name_sim'] == 1 and ematch['last_name_sim'] == 1

    @patch('psycopg2.connect')
    def test_strong_match_addr2(self, mock_connect):
        """
        Test for strong match in address line 2 mismatch
        """
        test_data = [('XX3X', 'JOHN', 'SMITH', '123 MAIN STREET', 'UNIT 10', 'PORTLAND', 'OR', '97202')]
        setup_mock_connect(mock_connect=mock_connect, test_data=test_data)

        from openelections.donor_lookup.match import get_match
        matches = get_match(last_name='Smith', first_name='John',
                            addr1='123 main street', addr2='Unit 102', zip_code='97202', city='Portland')

        # No weak or exact matches
        assert matches['weak'].size == 0 and matches['exact'].size == 0

        # One exact match
        assert matches['strong'].size == 1

        # Scores correct
        smatch = matches['strong'][0]
        assert np.isclose(smatch['address_sim'], 0.95) and \
               smatch['first_name_sim'] == 1 and \
               smatch['last_name_sim'] == 1

    @patch('psycopg2.connect')
    def test_exact_match_abr(self, mock_connect):
        """
        Test for exact match with abbreviations and words to ignore
        """
        test_data = [('XX3X', 'JOHN', 'SMITH', '123 NW MAIN ST', '', 'PORTLAND', 'OR', '97202')]
        setup_mock_connect(mock_connect=mock_connect, test_data=test_data)

        from openelections.donor_lookup.match import get_match
        matches = get_match(last_name='Smith', first_name='John',
                            addr1='123 main street', zip_code='97202', city='Portland')

        # No weak or strong matches
        assert matches['weak'].size == 0 and matches['strong'].size == 0

        # One exact match
        assert matches['exact'].size == 1

        # Scores correct
        ematch = matches['exact'][0]
        assert ematch['address_sim'] == 1 and ematch['first_name_sim'] == 1 and ematch['last_name_sim'] == 1

    @patch('psycopg2.connect')
    def test_strong_match_abr(self, mock_connect):
        """
        Test for strong match
        """
        test_data = [('XX3X', 'JOHN', 'SMITH', '123 NW LUMBAR ST', '', 'PORTLAND', 'OR', '97202')]
        setup_mock_connect(mock_connect=mock_connect, test_data=test_data)

        from openelections.donor_lookup.match import get_match
        matches = get_match(last_name='Smith', first_name='John',
                            addr1='123 lumbarr street', zip_code='97202', city='Portland')

        # No weak or exact matches
        assert matches['weak'].size == 0 and matches['exact'].size == 0

        # One exact match
        assert matches['strong'].size == 1

        # Scores correct
        smatch = matches['strong'][0]
        assert np.isclose(smatch['address_sim'], 0.97435) and \
               smatch['first_name_sim'] == 1 and \
               smatch['last_name_sim'] == 1

    @patch('psycopg2.connect')
    def test_max_return(self, mock_connect):
        """
        Test for max return
        """
        test_data = [('XX3X', 'JOHNS', 'SMITH', '523 NE LUMBAR ST', '', 'PORTLAND', 'OR', '97202'),
                     ('XX3Y', 'JOHNS', 'SMITH', '153 NW LUMBARR ST', '', 'PORTLAND', 'OR', '97202'),
                     ('XX3Z', 'JOHN', 'SMITH', '125 NW LUMBAR ST', '', 'PORTLAND', 'OR', '97202')]
        setup_mock_connect(mock_connect=mock_connect, test_data=test_data)

        from openelections.donor_lookup.match import get_match
        matches = get_match(last_name='Smith', first_name='John',
                            addr1='123 lumbar street', zip_code='97202', city='Portland',
                            max_num_matches=2)

        # No weak or exact matches
        assert matches['strong'].size == 0 and matches['exact'].size == 0

        # One exact match
        assert matches['weak'].size == 2

        # Test right two selected
        assert matches['weak'][0]['first_name'] == 'JOHN' and matches['weak'][0]['last_name'] == 'SMITH'
        assert matches['weak'][1]['address_1'] == '523 NE LUMBAR ST'


class TestInPortland():
    """
    Test class for in_portland
    """

    @patch('psycopg2.connect')
    def test_wrong_zip(self, mock_connect):
        """
        Ensure that wrong zip code returns false
        :return:
        """
        test_data = [('t')]
        setup_mock_connect(mock_connect=mock_connect, test_data=test_data)

        from openelections.donor_lookup.match import in_portland

        assert not in_portland(latitude='45.51179', longitude='-122.67563')
