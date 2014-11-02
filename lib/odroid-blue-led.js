/*jslint node: true */
"use strict";
var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Inotify = require('inotify').Inotify;

var PATH = '/sys/class/leds/led1';

var LED        = {};
LED.UNDEF      = "null";
LED.OFF        = "none";
LED.ON         = "default-on";
LED.BLINK      = "timer";
LED.MMC0       = "mmc0"; 
LED.MMC1       = "mmc1"; 
LED.ONESHOT    = "oneshot"; 
LED.HEARTBEAT  = "heartbeat";
LED.BLACKLIGHT = "backlight";
LED.GPIO       = "gpio";
LED.CPU0       = "cpu0";
LED.CPU1       = "cpu1";
LED.CPU2       = "cpu2";
LED.CPU3       = "cpu3";
LED.TRANSIENT  = "transient";

function BlueLed() {
	this.path = PATH;

	this.init = function() {
		var led = this;
		createListener.call(this, this.path);
	};

	this.lightOn = function(cb) {
		this.write("trigger", LED.ON,  cb || function() {});
	};

	this.lightOff = function(cb) {
		this.write("trigger", LED.OFF, cb || function() {});
	};

	this.lightInverse = function(cb) {
		var led = this;
		this.read('trigger', function(err, state) {
			if (state == LED.ON) {
				led.lightOff(cb || function() {});
			} else {
				led.lightOn(cb || function() {});
			}
		});
	};
	
	this.lightBlink = function(cb) {
		this.write("trigger", LED.BLINK, cb || function() {});
	};

	this.lightBlinkExt = function(delay_on, delay_off, cb) {
		var led = this;				
		this.lightSetDelayOn(delay_on, cb || function() {
			led.lightSetDelayOff(delay_off, cb || function() {});
		});
	};

	this.lightSetDelayOn = function(delay_on, cb) {
		var led = this;
		this.lightBlink( cb || function(){
			led.write("delay_on", delay_on, cb || function() {});		
		});		
	};

	this.lightSetDelayOff = function(delay_off, cb) {
		var led = this;
		this.lightBlink(cb || function(){
			led.write("delay_off", delay_off, cb || function() {});		
		});
	};

	this.lightMmc0 =function(cb){
		this.write("trigger", LED.MMC0, cb || function() {});
	};

	this.lightMmc1 =function(cb){
		this.write("trigger", LED.MMC1, cb || function() {});
	};

	this.lightOneShot =function(cb){
		this.write("trigger", LED.ONESHOT, cb || function() {});
	};

	this.lightBlackLight =function(cb){
		this.write("trigger", LED.BLACKLIGHT, cb || function() {});
	};
	
	this.lightHeartBeat =function(cb){
		this.write("trigger", LED.HEARTBEAT, cb || function() {});
	};
	
	this.lightGpio =function(cb){
		this.write("trigger", LED.GPIO, cb || function() {});
	};
	
	this.lightCpu0 =function(cb){
		this.write("trigger", LED.CPU0, cb || function() {});
	};
	
	this.lightCpu1 =function(cb){
		this.write("trigger", LED.CPU1, cb || function() {});
	};
	
	this.lightCpu2 =function(cb){
		this.write("trigger", LED.CPU2, cb || function() {});
	};

	this.lightCpu3 =function(cb){
		this.write("trigger", LED.CPU3, cb || function() {});
	};

	this.lightTransient =function(cb){
		this.write("trigger", LED.TRANSIENT, cb || function() {});
	};
	
	this.write = function(what, value, cb) {
		var led = this;
		fs.writeFile(led.path + '/' + what, value, 'utf-8', cb || function(err) {
			if (err !== null) {
				throw new Error('Failed to write value ' + value + ' on ' + what + ' LED ' + led.path);
			} else {
				cb(err);
			}
		});
	};

	this.read = function(what, cb) {
		var led = this;
		fs.readFile(this.path + '/' + what, 'utf-8', function(err, data) {
			var value = LED.UNDEF;
			if (err !== null) {
				throw new Error('Failed to read ' + what + ' on LED ' + led.path);
			} else {
				var re = /\[(.+)\]/i;
				var m = re.exec(data);
				if (m !== null) {
					value = m[1];
				}
			}
			cb(err, value);
		});
	};

	EventEmitter.call(this);
	this.init();

	function createListener() {
		/*jshint validthis:true */
		var led = this;
		
		var inotify = new Inotify();
		
		var watch_led = {
				path: led.path + '/trigger',
				watch_for: Inotify.IN_CLOSE_WRITE,
                callback:  function(event){
                	led.read('trigger', function(err, value) {
    					if (err !== null) {
    						throw new Error('Failed to read value after a change on LED ' + led.path);
    					} else {
    						led.emit('change', led.path, value);
    					}
    				});
                }
		};
		var watch_led_descriptor = inotify.addWatch(watch_led);
	}
}

util.inherits(BlueLed, EventEmitter);

exports.BlueLed = BlueLed;