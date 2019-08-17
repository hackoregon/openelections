"""
REST API for donor match

To Launch RESTful Server (will run on Port 8080)
>>> python -m openelections.api.donor_lookup

Example Request:
curl http://127.0.0.1:8080/match -d
"last_name=Smith&first_name=John&addr1=123 Main St&zip_code=97202&city=Portland&latitude=45.51179&longitude=-122.67563"
"""
import sys
sys.path.insert(0, "/app")

import traceback  # noqa: E402
from flask import Flask  # noqa: E402
from flask_restful import Resource, Api, reqparse  # noqa: E402
from openelections.donor_lookup.match import get_match, in_portland  # noqa: E402

app = Flask(__name__)
api = Api(app)


class DonorMatch(Resource):
    """
    Donor match endpoint
    """

    def get(self) -> dict:
        """
        Get donor match

        :return: dict
        """
        try:
            aparser = reqparse.RequestParser()
            aparser.add_argument("last_name", type=str, required=True)
            aparser.add_argument("first_name", type=str, required=True)
            aparser.add_argument("zip_code", type=str, required=True)
            aparser.add_argument("addr1", type=str, required=True)
            aparser.add_argument("addr2", default=None, type=str)
            aparser.add_argument("city", default=None, type=str)
            aparser.add_argument("latitude", dest="latitude", type=str)
            aparser.add_argument("longitude", dest="longitude", type=str)
            aparser.add_argument("max_matches", default=10, type=int)

            options = aparser.parse_args()
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
            return matches_dict

        except BaseException:
            # Catch error and print message to stdout
            print(traceback.format_exc())


class Status(Resource):

    def get(self) -> dict:
        return "healthy"


api.add_resource(DonorMatch, '/match')

api.add_resource(Status, '/status')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
