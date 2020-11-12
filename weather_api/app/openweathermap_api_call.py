#!/usr/bin/env python3
import configparser
import requests
import sys
import ciso8601
import time

def get_api_key():
    config = configparser.ConfigParser()
    config.read('config.ini')
    return config['openweathermap']['api']

def get_unixtime(date):
    """return unixtime for date"""
    ts = ciso8601.parse_datetime(date)
    # to get time in seconds:
    return int(time.mktime(ts.timetuple()))

def get_weather(api_key, location, date):
    weatherdict = {'api_key':api_key,'start':date,'city ID':location}
    url = "http://history.openweathermap.org/data/2.5/history/city?q={city ID}&type=hour&start={start}&cnt=1".format(**weatherdict)
    # url = "https://api.openweathermap.org/data/2.5/weather?q={}&units=metric&appid={}".format(location, api_key)
    r = requests.get(url)
    return r.json()


def main():
    if len(sys.argv) != 3:
        exit("Usage: {} LOCATION".format(sys.argv[0]))
    date = sys.argv[1]
    epoch_time = str(get_unixtime(date))
    location = sys.argv[2]

    api_key = get_api_key()
    weather = get_weather(api_key, location, epoch_time)

    print(weather['weather'][0]['description'])


if __name__ == '__main__':
    main()
