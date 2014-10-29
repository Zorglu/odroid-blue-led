odroid-blue-led
===============

Use Odroid's blue light with nodeJS.

The idea is to manipulate the small blue LED with nodejs in a future development on ODROID .

The goal will be to create a pluggin running nodejs.
An object should do the trick .
A GETTER to read the state of the LED and some SETTERS to adjust it.
The object should be able to turn on or off the LED flash at the desired frequency.

Ref : http://forum.odroid.com/viewtopic.php?f=77&t=3377&p=27705&hilit=leds#p27621

Skeleton of the application inspired by https://github.com/JamesBarwell/rpi-gpio.js