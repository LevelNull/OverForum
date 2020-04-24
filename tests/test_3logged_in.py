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

def test_0admin_Login():
    global ADDRESS
    global COOKIES
    params = {
        "username":"administrator@localhost",
        "password":"testtest",
        "returnto":ADDRESS
        }
    page = query("acs",params)
    assert page != None
    data = json.loads(page.text)
    assert data["success"] == True
    COOKIES = page.cookies

def test_1login_Page():
    page = query("login")
    assert page != None
    assert page.status_code == 200
    assert "<h2>Login</h2>" in page.text

def test_2admin_panel():
    global ADDRESS
    global COOKIES
    page = query("admin/panel")
    assert page != None
    assert page.status_code == 200
    assert "<h2>Navigation</h2>" in page.text

def test_3admin_js():
    page = query("admin/adminPanel.js")
    assert page != None
    assert page.status_code == 200