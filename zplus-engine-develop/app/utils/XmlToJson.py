import json, xmltodict

def xml2json(xml): 
    xml_file = open(xml)
    xml_content = xml_file.read()
    xml_file.close()
    xmljson = json.dumps(xmltodict.parse(xml_content), indent=4, sort_keys=True)
    json_data = json.loads(xmljson)
    return replace_keys_without_at_sign(json_data)

def replace_keys_without_at_sign(data):
    if isinstance(data, dict):
        new_data = {}
        for key, value in data.items():
            if key.startswith("@"):
                new_key = key[1:]
            else:
                new_key = key
            new_value = replace_keys_without_at_sign(value)
            new_data[new_key] = new_value
        return new_data
    elif isinstance(data, list):
        new_list = [replace_keys_without_at_sign(item) for item in data]
        return new_list
    else:
        return data
