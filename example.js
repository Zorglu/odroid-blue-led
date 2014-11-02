var BlueLed = require ('./lib/odroid-blue-led.js').BlueLed;

/**
 * New instance of BlueLed
 */
var led = new BlueLed();

/**
 *  Turn on the led without Callback
 */
led.lightOn();

/**
 * Turn on the led with Callback
 */

led.lightOn(function(err){
	if( err !== null ){
		console.log("lightOn error", err);
	}else{
		console.log("Led is on");
	}
});

/**
 * Blink with setting of ON and OFF delay flashing
 * without callback
 */
led.lightBlinkExt(50, 50);

/**
 * catch 'on change' event emitted by BlueLed when his state has changed
 * who is the emiter of event
 * value is the new state
 */
led.on('change', function(who, value){
	console.log("Led " + who + " state changed ", value);
});
