import requests
import json
import yaml
import os

with open(os.path.dirname(os.path.realpath(__file__))+'/config.yaml') as file:
    config = yaml.load(file, Loader=yaml.FullLoader)
ADDRESS = config['address']

try:
    requests.packages.urllib3.disable_warnings() 
    page = requests.get(ADDRESS,verify=False)
except:
    page = None

def test_Code():
    assert page.status_code == 200

def test_Header():
    assert 'text/html' in page.headers['content-type']

def test_Content():
    assert 'Recent Threads' in page.text
    assert 'Site News' in page.text