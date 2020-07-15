#!/bin/python

import html
import imgkit
import json
import os
import sys

PWD = os.getcwd();
formatPath = lambda path: path if PWD is "/" else PWD+path

options = json.load(open(formatPath('/dataset/options.json'), 'r'))
args = json.loads(' '.join(sys.argv[1:]))
text = [ '' for i in range(32) ]
text[0:len(args)] = [ html.escape(x).replace('\n', '<br/>') for x in args ]

with open(formatPath('/src/base.html'), 'r') as infile:
	body = infile.read().format(img=formatPath('/dataset/template.jpg'), text=text)
	imgkit.from_string(body, formatPath('/iexec_out/result.jpg'), css=[formatPath('/src/base.css'), formatPath('/dataset/template.css')], options={"xvfb": "", **options})
