#!/bin/sh
export PORT=4001
forever start server.js -o /tmp/skratchpad-out.log -e /tmp/skratchpad-error.log
