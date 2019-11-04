#!/usr/bin/env python3
import configparser
import requests
import sys
import ciso8601
import time
from opencage.geocoder import OpenCageGeocode

def get_api_key(api_name):
    config = configparser.ConfigParser()
    config.read('config.ini')
    return config[api_name]['api']

def get_unixtime(date):
    """return unixtime for date"""
    ts = ciso8601.parse_datetime(date)
    # to get time in seconds:
    return int(time.mktime(ts.timetuple()))


def get_coordinates(api_key, location):
    geocoder = OpenCageGeocode(api_key)
    result = geocoder.geocode(location, no_annotations='1')
    if result and len(result):
        longitude = result[0]['geometry']['lng']
        latitude = result[0]['geometry']['lat']
    else:
        sys.stderr.write("not found: %s\n" % location)
    return latitude,longitude

def get_weather(api_key, lat, long, date):
    weatherdict = {'api_key':api_key,'start':date,'lat':lat,'long':long}
    url = "https://api.darksky.net/forecast/{api_key}/{lat},{long},{start}?exclude=currently,flags,hourly".format(**weatherdict)
    r = requests.get(url)
    return r.json()


def main():
    if len(sys.argv) != 3:
        exit("Usage: {} DATE LOCATION".format(sys.argv[0]))
    date = sys.argv[1]
    epoch_time = str(get_unixtime(date))
    location = sys.argv[2]

    api_key_ds = get_api_key('darksky')
    api_key_oc = get_api_key('opencagedata')
    lat,long = get_coordinates(api_key_oc, location)
    weather = get_weather(api_key_ds, lat,long, epoch_time)

    print(weather['daily']['data'][0]['summary'])


if __name__ == '__main__':
    main()
