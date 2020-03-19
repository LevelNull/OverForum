import requests
import json
import yaml
import os

with open(os.path.dirname(os.path.realpath(__file__))+'/config.yaml') as file:
    config = yaml.load(file, Loader=yaml.FullLoader)
ADDRESS = config['address']
COOKIES = None
SETUPLOC = ""

def test_0null_Login():
    global ADDRESS
    global COOKIES
    global SETUPLOC
    params = {
        "username":"administrator@localhost",
        "password":"testtest",
        "returnto":ADDRESS
        }
    try:
        requests.packages.urllib3.disable_warnings() 
        page = requests.post(ADDRESS+"/acs", json=params ,verify=False)
    except:
        page = None
    assert page != None
    data = json.loads(page.text)
    assert data["success"] == True
    SETUPLOC = data["goto"]

def test_1setup_page():
    global ADDRESS
    global COOKIES
    global SETUPLOC
    try:
        requests.packages.urllib3.disable_warnings() 
        page = requests.get(ADDRESS+SETUPLOC+"/",cookies=COOKIES ,verify=False)
    except:
        page = None
    assert page != None
    #print(page.text)
    assert "Administrative Setup" in page.text
    COOKIES = page.cookies
    #print(page.cookies.keys())

def test_2mysql_Test():
    global ADDRESS
    global SETUPLOC
    global COOKIES
    mysqlOpts = {
        "options": {
        "host":"",
        "user":"",
        "password":"",
        "database":"",
        "prefix":""
        }
    }
    try:
        requests.packages.urllib3.disable_warnings() 
        page = requests.post(ADDRESS+SETUPLOC+"/mysqlTest",cookies=COOKIES,json=mysqlOpts,verify=False)
    except:
        page = None
    assert page != None
    data = json.loads(page.text)
    assert data["success"] == True
    assert len(data["todo"]) == 4

def test_3preSetup():
    global ADDRESS
    global SETUPLOC
    global COOKIES
    mysqlOpts = {
        "host":"",
        "user":"",
        "password":"",
        "database":"",
        "prefix":""
        }
    credential = {
        "credentials": {
            "password":"testtest",
            "confirmpassword":"testtest",
            "iknowwhatimdoing":True
            },
        "options":mysqlOpts
        }
    try:
        requests.packages.urllib3.disable_warnings() 
        page = requests.post(ADDRESS+SETUPLOC+"/preSetup",cookies=COOKIES,json=credential,verify=False)
    except:
        page = None
    assert page != None
    #print(page.text)
    data = json.loads(page.text)
    assert data["success"] == True

def test_4set_mysql():
    global SETUPLOC
    global COOKIES
    try:
        requests.packages.urllib3.disable_warnings() 
        page = requests.post(ADDRESS+SETUPLOC+"/setMysql",cookies=COOKIES,verify=False)
    except:
        page = None
    assert page != None
    #print(page.text)
    data = json.loads(page.text)
    assert data["success"] == True
    
def test_5create_tables():
    global SETUPLOC
    global COOKIES
    #print(COOKIES.keys())
    try:
        requests.packages.urllib3.disable_warnings() 
        page = requests.post(ADDRESS+SETUPLOC+"/createTables",cookies=COOKIES,verify=False)
    except:
        page = None
    assert page != None
    #print(page.text)
    data = json.loads(page.text)
    assert data["success"] == True

def test_6admin_password():
    global SETUPLOC
    global COOKIES
    print(COOKIES)
    try:
        requests.packages.urllib3.disable_warnings() 
        page = requests.post(ADDRESS+SETUPLOC+"/acs",cookies=COOKIES,verify=False)
    except:
        page = None
    assert page != None
    #print(page.text)
    data = json.loads(page.text)
    assert data["success"] == True

def test_7finish():
    global SETUPLOC
    global COOKIES
    try:
        requests.packages.urllib3.disable_warnings() 
        page = requests.post(ADDRESS+SETUPLOC+"/finish",cookies=COOKIES,verify=False)
    except:
        page = None
    assert page != None
    #print(page.text)
    data = json.loads(page.text)
    assert data["success"] == True


# def main():
#     test_0null_Login()
#     test_1setup_page()
#     test_2mysql_Test()
#     test_3preSetup()
#     test_4set_mysql()
#     test_5create_tables()
#     test_6admin_password()
#     test_7finish()

# main()