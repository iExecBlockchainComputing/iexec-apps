#!/usr/bin/env python
import dwollav2
import sys
payment_id = sys.argv[1]


client = dwollav2.Client(
  key = 'XfEX77omgP2XNRjI04wQOA3nusm6xrJy7xRoiulVLdh4hxhwDS',
  secret = 'HhpRzVXYX3t4NMpcwS7pC4XgJsqXi5E2DQIBNWevGGwvQOxpda',
  environment = 'sandbox'
)

app_token = client.Auth.client()

payment_info = app_token.get('https://api-sandbox.dwolla.com/transfers/%s' % payment_id)
amount = '%(value)s %(currency)s' % (payment_info.body['amount'])
payer_ID = payment_info.body['id']
print(amount,payer_ID)


