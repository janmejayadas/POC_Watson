#!/usr/bin/env
/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

require('dotenv').config({silent: true});

var app = require('./app');
var port = process.env.PORT || 3000;

var server = app.listen(port, function() {
  // eslint-disable-next-line
  console.log('Server running on port: %d', port);
});

var io = require('socket.io').listen(server);

app.post('/notification', function(req, res) { 
  console.log('got notification: ' + JSON.stringify(req.body));
  io.emit('server message', req.body);
  return res.json();
});
