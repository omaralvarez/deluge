#!/usr/bin/env python
import os
import sys
import fileinput
import fnmatch
from slimit import minify

"""Minifies the Webui JS files

Usage: python minify_web_js.py deluge/ui/web/js/deluge-all
"""

if len(sys.argv) != 2:
    print "Specify a source js directory... e.g. "
    sys.exit(1)

SOURCE_DIR = os.path.abspath(sys.argv[1])
BUILD_NAME = os.path.basename(SOURCE_DIR)
BUILD_DIR = os.path.dirname(SOURCE_DIR)
SRC_FILE_LIST = []
for root, dirnames, filenames in os.walk(SOURCE_DIR):
    for filename in fnmatch.filter(filenames, '*.js'):
        SRC_FILE_LIST.append(os.path.join(root, filename))

if not SRC_FILE_LIST:
    print 'No js files found'
    sys.exit(1)

print 'Minifying %s' % BUILD_NAME

# generate the single file, unminified version
file_dbg_js = os.path.join(BUILD_DIR, BUILD_NAME + '-debug.js')
with open(file_dbg_js, 'w') as _file:
    input_lines = fileinput.input(SRC_FILE_LIST)
    _file.writelines(input_lines)

# generate the minified version
fileout_js = os.path.join(BUILD_DIR, BUILD_NAME + '.js')
with open(fileout_js, 'w') as out_file:
    with open(file_dbg_js, 'r') as in_file:
        out_file.write(minify(in_file.read()))
