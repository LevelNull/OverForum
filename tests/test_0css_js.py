import requests
import json
import yaml
import os

with open(os.path.dirname(os.path.realpath(__file__))+'/config.yaml') as file:
    config = yaml.load(file, Loader=yaml.FullLoader)
ADDRESS = config['address']
COOKIES = None

def query(path,params=None):
    global ADDRESS
    global COOKIES
    if params != None:
        try:
            requests.packages.urllib3.disable_warnings() 
            return requests.post(ADDRESS+"/"+path, json=params, cookies=COOKIES ,verify=False)
        except:
            return None
    else:
        try:
            requests.packages.urllib3.disable_warnings() 
            return requests.get(ADDRESS+"/"+path, json=params, cookies=COOKIES ,verify=False)
        except:
            return None

def test_0css_basic():
    css = {
        "menu.css": 200,
        "infopane.css": 200,
        "loginPage.css": 200,
        "overlay.css": 200,
        "topiclist.css": 200,
        "header.css": 200,
        "main.css": 200,
        "objects/switch.css": 200,
        "gimme.css": 404
    }
    for key,val in css.items():
        page = query(key)
        assert page != None
        assert page.status_code == val


def test_1js_basic():
    js = {
        "jquery.js": 200,
        "auth/loginPage.js": 200,
        "auth/logout.js": 200,
        "auth/registerPage.js": 200,
        "admin/adminPanel.js": 404
    }
    for key,val in js.items():
        page = query(key)
        assert page != None
        assert page.status_code == val