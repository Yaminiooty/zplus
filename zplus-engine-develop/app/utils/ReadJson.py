import json

def ReadJsonFile(path):
    with open(path) as f:
        data = json.load(f)
        return data
