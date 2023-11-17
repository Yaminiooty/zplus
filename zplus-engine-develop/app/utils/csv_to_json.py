import csv
import json

def csv_to_json(csv_file_lication):
    data=[]
    with open(csv_file_lication, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
        for rows in csvReader:
            data.append(rows)
    return data
