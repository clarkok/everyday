"use strict";

var async = require('async');
var md5 = require('MD5');

var knex = require('knex')({
  client : 'mysql',
  connection : require('./db.json')
});

var username = process.argv[2];
var password = md5(process.argv[3]);

async.series([
  function (cb) {
    return knex.schema.dropTableIfExists('users').exec(function (err) {
      if (err)
        throw err
      console.log('drop users');
      cb();
    });
  },
  function (cb) {
    return knex.schema.createTable('users', function (table) {
      table.increments('id').primary();
      table.string('username');
      table.string('password');
    }).exec(function (err) {
      if (err)
        throw err
      console.log('create users');
      cb();
    });
  },
  function (cb) {
    return knex.insert({
      username : username,
      password : password
    }).into('users').exec(function (err) {
      if (err)
        throw err
      console.log('insert users');
      return cb();
    })
  },
  function (cb) {
    return knex.schema.dropTableIfExists('entries').exec(function (err) {
      if (err)
        throw err
      console.log('drop entries');
      cb();
    });
  },
  function (cb) {
    return knex.schema.createTable('entries', function (table) {
      table.increments('id').primary();
      table.string('content');
      table.date('date');
      table.integer('deleted').defaultTo(0);
      table.integer('views').defaultTo(0);
    }).exec(function (err) {
      if (err)
        throw err
      console.log('create entries');
      cb();
    });
  },
  function (cb) {
    return knex.schema.dropTableIfExists('pictures').exec(function (err) {
      if (err)
        throw err
      console.log('drop pictures');
      cb();
    });
  },
  function (cb) {
    return knex.schema.createTable('pictures', function (table) {
      table.increments('id').primary();
      table.string('url');
      table.integer('entry');
      table.integer('deleted').defaultTo(0);
      table.integer('width');
      table.integer('height');
    }).exec(function (err) {
      if (err)
        throw err
      console.log('create pictures');
      cb();
    });
  },
  function (cb) {
    return knex.schema.dropTableIfExists('sessions').exec(function (err) {
      if (err)
        throw err
      console.log('drop sessions');
      cb();
    })
  },
  function (cb) {
    return knex.schema.createTable('sessions', function (table) {
      table.increments('id').primary();
      table.string('username');
      table.string('token');
      table.datetime('expire');
    }).exec(function (err) {
      if (err)
        throw err
      console.log('create sessions');
      cb();
    })
  }
]);
