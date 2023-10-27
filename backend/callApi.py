import requests

url = "http://localhost:8000/api/file_upload/file_upload"

payload = {}
files=[
  ('file',('003.csv',open('/home/xbyte/Desktop/testCsv/003.csv','rb'),'text/csv'))
]
headers = {
  'Cookie': 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTM2MjJkOTg5NDZiMDhjZDI1OGQ1NzMiLCJpYXQiOjE2OTgwNDY3OTIsImV4cCI6MTcwMDYzODc5Mn0.diMYiHTA38K1ITNpv6YUuTnDV_x5lRJhI0MGYYajHUU'
}

response = requests.request("POST", url, headers=headers, data=payload, files=files)

print(response.text)
