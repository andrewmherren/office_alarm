#!/bin/bash
pin=$1
val=$2

if [ $1 != "" ] && [ $2 != "" ]
then
	file="/sys/class/gpio/gpio$pin/direction"

	if [ ! -f "$file" ]
	then
		echo $pin > /sys/class/gpio/export
		echo out > /sys/class/gpio/gpio$pin/direction
	fi

	if [ $(cat /sys/class/gpio/gpio$pin/direction) == "out" ]
	then
		echo "writing $val to pin GPIO$pin"
		echo $val > /sys/class/gpio/gpio$pin/value
	else
		echo "This pin is configured as an input";
	fi
else
	echo "Usage: gpio_write arg1 arg2"
	echo "arg1 = pin number"
	echo "arg2 = value to write"
fi

