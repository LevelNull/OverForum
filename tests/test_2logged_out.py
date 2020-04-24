import requests
import json
import yaml
import os

with open(os.path.dirname(os.path.realpath(__file__))+'/config.yaml') as file:
    config = yaml.load(file, Loader=yaml.FullLoader)
ADDRESS = config['address']
COOKIES = None
FOUROHFOUR = 'The resource you\'re looking for is either not here, or is inaccessible.'

def query(path,params={}):
    global ADDRESS
    global COOKIES
    try:
        requests.packages.urllib3.disable_warnings() 
        return requests.get(ADDRESS+"/"+path, json=params, cookies=COOKIES ,verify=False)
    except:
        return None


def test_0index():
    page = query("")
    assert page != None
    assert page.status_code == 200
    assert "Recent Threads" in page.text


def test_1login_Page():
    page = query("login")
    assert page != None
    assert page.status_code == 200
    assert "<h2>Login</h2>" in page.text

def test_2admin_panel():
    page = query("admin/panel")
    assert page != None
    assert page.status_code == 404
    assert FOUROHFOUR in page.text