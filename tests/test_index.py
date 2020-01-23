import requests
ADDRESS = "https://localhost/"
try:
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