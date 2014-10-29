/*jslint node: true */
"use strict";
var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var async = require('async');

var PATH = '/sys/class/leds/led1';

var LED   = {};
LED.UNDEF = "null";
LED.OFF   = "none";
LED.ON    = "default-on";
LED.BLINK = "timer";

function BlueLed() {
	var pollFrequency = 5007;

	this.path = PATH;

	this.init = function() {
		var led = this;

		createListener.call(this, this.path);
		this.setDelayOn(100);
		this.setDelayOff(60000);
	};

	this.on = function(cb) {
		this.write("trigger", LED.ON, cb || function() {
		});
	};

	this.off = function(cb) {
		this.write("trigger", LED.OFF, cb || function() {
		});
	};

	this.not = function(cb) {
		var led = this;
		this.read(function(err, state) {
			if (state == LED.ON) {
				led.off();
			} else {
				led.on();
			}
		});
	};

	this.blink = function(cb) {
		this.write("trigger", LED.BLINK, cb || function() {
		});
	};

	this.blinkExt = function(delay_on, delay_off, cb) {
		var led = this;
		this.setDelayOn(delay_on, function() {
			led.setDelayOff(delay_off, function() {
				led.blink();
			});
		});
	};

	this.setDelayOn = function(delay_on, cb) {
		this.write("delay_on", delay_on, cb || function() {
		});
	};

	this.setDelayOff = function(delay_off, cb) {
		this.write("delay_off", delay_off, cb || function() {
		});
	};

	this.write = function(what, value, cb) {
		var led = this;
		fs.writeFile(this.path + '/' + what, value, 'utf-8', function(err) {
			if (err !== null) {
				throw new Error('Failed to write value ' + value + ' on ' + what + 'LED ' + led.path);
			} else {
				cb(err);
			}
		});
	};

	this.read = function(cb) {
		var led = this;
		fs.readFile(this.path + '/trigger', 'utf-8', function(err, data) {
			var value = LED.UNDEF;
			if (err !== null) {
				throw new Error('Failed to read on LED ' + led.path);
			} else {
				var re = /\[(.+)\]/i;
				var m = re.exec(data);
				if (m !== null) {
					value = m[1];
				}
			}
			return cb(err, value);
		});
	};

	EventEmitter.call(this);
	this.init();

	function createListener() {
		/*jshint validthis:true */
		var led = this;
		fs.watchFile(led.path + '/trigger', {
			persistent : true,
			interval : pollFrequency
		}, function(current, previous) {
			if (current.mtime > previous.mtime) {
				led.read(function(err, value) {
					if (err !== null) {
						throw new Error('Failed to read value after a change on LED ' + led.path);
					} else {
						led.emit('change', led.path, value);
					}
				});
			}
		});
	}
}

util.inherits(BlueLed, EventEmitter);

module.exports = new BlueLed();