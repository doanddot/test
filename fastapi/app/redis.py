import redis as r

redis = r.from_url("redis://redis", decode_responses=True)