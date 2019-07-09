import os

_ROOT = os.path.abspath(os.path.dirname(__file__))
_RESOURCES = os.path.join(_ROOT, 'resources')
_VOTER_LIST = os.path.join(_RESOURCES, 'voter_list', '00_Ex-VotingHistory-nkramer-2017-03-21-050310.txt')
_POSTGRES_LOGIN_FILE = os.path.join(_RESOURCES, 'elections2019_login.json')
_ORESTAR_PATH = os.path.join(_RESOURCES, 'orestar')
