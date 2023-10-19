import requests

url = "http://localhost:5000/convert"

payload = {}
files=[
  ('file',('Kroger_24_09_2022_Revised.csv',open('/home/vatsal.zinzuvadiya/Downloads/Kroger_24_09_2022_Revised.csv','rb'),'text/csv'))
]
headers = {}

response = requests.request("POST", url, headers=headers, data=payload, files=files)

print(response.text)
