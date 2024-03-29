var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var transactionsRouter = require('./routes/transactions');
var registryEntitiesRouter = require('./routes/registry_entities');
var invitesRouter = require('./routes/invites');

require('./initializers/sync_registry_entities_events_listener');
require('./initializers/sync_users_events_listener');

var app = express();

// app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
process.on('uncaughtException', function (exception) {
  console.log(exception);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/transactions', transactionsRouter);
app.use('/registry_entities', registryEntitiesRouter);
app.use('/invites', invitesRouter);

module.exports = app;
