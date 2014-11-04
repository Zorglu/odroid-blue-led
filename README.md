odroid-blue-led
===============

Use Odroid's blue light with nodeJS.

The idea is to manipulate the small blue LED with nodejs in a future development on ODROID .

The goal will be to create a pluggin running nodejs.
An object should do the trick .
A GETTER to read the state of the LED and some SETTERS to adjust it.
The object should be able to turn on or off the LED flash at the desired frequency.


## Installation
 NodeJS versions 10.12.x are currently supported and tested.

### Install from NPM (Easy way)
    $ npm install odroid-blue-led

    
## API

* `var led = new BlueLed();` Create a new instance of odroid-blue-led.

* `lightOn([cb])` Light the Blue LED

* `lightOff([cb])` Power off the Blue LED

* `lightInverse([cb])` Boolean NOT operation on le LED
Turn off the lamp when it is on and the switch when it is off

* `lightBlink([cb])` Do blink he LED
 
* `lightBlinkExt(delay_on, delay_off[, cb])` 
Flash LED by adjusting the ignition and extinction times of the LED
 
* `lightSetDelayOn(delay_on[, cb])` Adjust the ignition delay of the LED

* `lightSetDelayOff(delay_off[, cb])` Adjust the extinction of the LED

* `lightMmc0([cb])` The LED flash when the MMC0 is using

* `lightMmc1([cb])`  The LED flash when the MMC1 is using

* `lightOneShot([cb])` Flash the LED one time

* `lightBlackLight([cb])` ???

* `lightHeartBeat([cb])` Flash the LED

* `lightGpio([cb])`  The LED flash when the GPIO is using

* `lightCpu0([cb])`  The LED flash when the CPU0 is using

* `lightCpu1([cb])`  The LED flash when the CPU1 is using

* `lightCpu2([cb])`  The LED flash when the CPU2 is using

* `lightCpu3([cb])`  The LED flash when the CPU3 is using

* `lightTransient([cb])`  ???

### Events See Node [EventEmitter](http://nodejs.org/api/events.html) for documentation on listening to events.
* `change` 
Emited when the state of the LED has changed
	* value contain the value of change


all function can be used with ou without callback.


## Example of use

```javascript
/**
 * New instance of BlueLed
 */
var led = new BlueLed();

//You can catch event emited when the Blue LED has changed state
led.on('change', function(who, value){
	console.log("Led " + who + " state changed ", value);
});


led.lightOn(function(err){
	if( err !== null ){
		console.log("Blue LED error", err);
	}else{
		console.log("Blue LED is on");
	}
});



```
 
  

    



Ref : http://forum.odroid.com/viewtopic.php?f=77&t=3377&p=27705&hilit=leds#p27621

Skeleton of the application inspired by https://github.com/JamesBarwell/rpi-gpio.js