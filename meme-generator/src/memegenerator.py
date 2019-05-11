#!/bin/python

import html
import imgkit
import json
import sys

options = json.load(open('/dataset/options.json', 'r'))
args = json.loads(' '.join(sys.argv[1:]))
text = [ '' for i in range(32) ]
text[0:len(args)] = [ html.escape(x).replace('\n', '<br/>') for x in args ]

with open('/src/base.html', 'r') as infile:
	body = infile.read().format(img='/dataset/template.png', text=text)
	imgkit.from_string(body, '/iexec_out/result.jpg', css=['/src/base.css', '/dataset/template.css'], options={"xvfb": "", **options})
