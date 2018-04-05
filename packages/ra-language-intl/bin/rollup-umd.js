#!/usr/bin/env node
/* eslint-disable no-undef, no-param-reassign, global-require, no-unused-vars, no-console, no-underscore-dangle, prefer-destructuring */
const { exec, spawn } = require('child_process');
global.path = require('path');
global.fs = require('fs');
global.exec = (command, cb) => {
  exec(command, {
    maxBuffer: 1024 * 1024,
  }, cb);
};
global.spawn = (command, cb) => {
  const split = command.split(' ');
  const program = split[0];
  const args = split.slice(1);
  const child = spawn(program, args || []);
  const outputList = [];
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (data) => outputList.push(data) && console.log(data.replace(/\n$/, '')));
  child.stderr.on('data', (data) => outputList.push(data) && console.log(data.replace(/\n$/, '')));
  child.on('close', (code) => code === 1 ? cb(new Error(`child process exited with code ${code}`, [outputList.join('')])) : cb(null, [outputList.join('')]));
};
global.sedReplace = (input, before, after, output, cb = () => {}) => {
  const file = fs.readFileSync(input, 'utf8');
  const newFile = file.replace(new RegExp(escapeRegExp(before), 'gm'), after);
  fs.writeFileSync(output, newFile, 'utf8');
  cb();
};
global.__base = path.join(__dirname, '..');
global.withLog = (cb) => (err, stdout) => { console.log(stdout); return cb(err, stdout); };

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const argv = require('yargs')
  .commandDir('cmds')
  .demandCommand()
  .help()
  .wrap(100)
  .epilog('Copyright 2017. Yeutech Company Limited.')
  .argv;
