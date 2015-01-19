#! /usr/bin/env python
# -*- coding: utf-8 -*-

import time
import logging
import getpass
from optparse import OptionParser
from bson.json_util import dumps
from flask import request, Flask, Response
from flask.ext.cors import CORS
import sleekxmpp


app = Flask(__name__)
CORS(app)

# app.debug = True

class GTMsgBot(sleekxmpp.ClientXMPP):
    def __init__(self, jid, password):
        sleekxmpp.ClientXMPP.__init__(self, jid, password)

        self.add_event_handler("session_start", self.start)
        self.add_event_handler("message", self.message)

    def start(self, event):
        self.send_presence()

    def translate(self, to, msg):
        self.send_message(mto=to, mbody=msg, mtype='chat')

    def message(self, msg):
        if msg['type'] in ('chat'):
            print msg['body']
            app.translation = {'translated': True, 'result': msg['body']}


@app.route("/")
def search():
    q = request.args.get('q')
    bot = request.args.get('bot')

    gt.translate(bot + "@bot.talk.google.com", q)

    app.translation = {'translated': False, 'result': ''}

    timeout = 0
    while not app.translation['translated']:
        time.sleep(1)
        timeout = timeout + 1
        if timeout == 10:
            app.translation = {'translated': True, 'result': 'ERROR'}

    response = Response(response=dumps({'result': app.translation['result']}),
                        status=200,
                        mimetype="application/json")

    return response


if __name__ == "__main__":

    # Setup the command line arguments.
    optp = OptionParser()

    # Output verbosity options.
    optp.add_option('-q', '--quiet', help='set logging to ERROR',
                    action='store_const', dest='loglevel',
                    const=logging.ERROR, default=logging.INFO)
    optp.add_option('-d', '--debug', help='set logging to DEBUG',
                    action='store_const', dest='loglevel',
                    const=logging.DEBUG, default=logging.INFO)
    optp.add_option('-v', '--verbose', help='set logging to COMM',
                    action='store_const', dest='loglevel',
                    const=5, default=logging.INFO)

    # Connection
    optp.add_option("--host", dest="host",
                    help="Host", default="talk.google.com")
    optp.add_option("--port", dest="port",
                    help="Port", default=443)

    # Credentials
    optp.add_option("-j", "--jid", dest="jid",
                    help="JID to use (Username)")
    optp.add_option("-p", "--password", dest="password",
                    help="Password to use")

    # Proxy
    optp.add_option("--phost", dest="proxy_host",
                    help="Proxy hostname")
    optp.add_option("--pport", dest="proxy_port",
                    help="Proxy port")
    optp.add_option("--puser", dest="proxy_user",
                    help="Proxy username")
    optp.add_option("--ppass", dest="proxy_pass",
                    help="Proxy password")

    # Deploy
    optp.add_option("--dhost", dest="dhost",
                    help="Deploy Host", default="0.0.0.0")
    optp.add_option("--dport", dest="dport",
                    help="Port", default=5000)

    opts, args = optp.parse_args()

    # Setup logging.
    logging.basicConfig(level=opts.loglevel,
                        format='%(levelname)-8s %(message)s')

    # Setup Credentials
    if opts.jid is None:
        opts.jid = raw_input("Username: ")
    if opts.password is None:
        opts.password = getpass.getpass("Password: ")

    gt = GTMsgBot(opts.jid, opts.password)

    gt.register_plugin('xep_0030')
    gt.register_plugin('xep_0004')
    gt.register_plugin('xep_0060')
    gt.register_plugin('xep_0199')


    # Setup Proxy
    if opts.proxy_host and opts.proxy_port:
        gt.use_proxy = True
        gt.proxy_config = {
            'host': opts.proxy_host,
            'port': int(opts.proxy_port),
            'username': opts.proxy_user,
            'password': opts.proxy_pass}

    if gt.connect((opts.host, opts.port), use_ssl=True):
        gt.process()

    app.run(host=opts.dhost, port=opts.dport)
