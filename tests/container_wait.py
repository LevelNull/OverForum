import requests
import json
import time
ADDRESS = "https://localhost"
MAX_RETRIES = 10

def checkfor_web(count):
    if count > MAX_RETRIES:
        return False
    try:
        requests.packages.urllib3.disable_warnings() 
        page = requests.post(ADDRESS ,verify=False)
    except:
        page = None
    if page != None:
        return True
    else:
        print("("+str(count)+") Waiting for Node Web Server...")
        time.sleep(4)
        checkfor_web(count+1)

def main():
    isUp = checkfor_web(0)
    if isUp:
        print("Server online, beginning tests...")
        exit(0)
    else:
        print("Server didn't resond after "+str(MAX_RETRIES)+" retries!")
        exit(1)

main()
