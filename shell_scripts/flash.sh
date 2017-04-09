#!/bin/bash

for (( i=1; i<=$1; i++ ))
do
	gpio_write 7 1
	sleep 1.15
	gpio_write 7 0
	sleep 1.15
done

