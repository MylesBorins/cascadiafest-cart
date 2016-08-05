#!/usr/bin/env node

var request = require('request-promise');
var track = 1;
var sorryMsg = 'Sorry, nothing to stream for now...';
var async = require('async');

var say = require('say');

var tts = process.argv[2] === '-s' || process.argv[2] === '--say';

var q = async.queue(function(task, callback) {
  process.stdout.write(task.result);
  if (tts) say.speak(task.result, 'Alex', 1, callback);
  else callback();
});

console.log("✨ Streaming Cascadiafest 2016✨ ");

var last = null;

(function tick() {
  request.get('http://www.streamtext.net/text-data.ashx?event=CascadiaFest&last=' + last + '&language=en')
  .then(function(v) {
      v = JSON.parse(v);
      last = v.lastPosition;
      if (v.i && v.i.length) {
        var result = v.i.map(function(v) {
          return decodeURIComponent(v.d);
        }).join('');
        q.push({
          result: result
        });
      }
  })
  .catch(function(err){
    if(err.statusCode === 404) {
      process.stdout.write(sorryMsg);
      sorryMsg = '.';
    }
  })
  .finally(setTimeout.bind({}, tick, 1000));
})(null);

