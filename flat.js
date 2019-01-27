#! /usr/bin/env node

const yargs = require("yargs");

const comps = require('./companies');

const argv = yargs
  .help("help")
  .usage("Usage: pls <command> [options]")
  .scriptName("")
  .command(comps).argv;
