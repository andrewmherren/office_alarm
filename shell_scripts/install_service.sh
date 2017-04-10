#!/bin/bash
cp gpio-init.service /etc/systemd/system/gpio-init.service
cp office-alarm.service /etc/systemd/system/office-alarm.service
systemctl daemon-reload
systemctl enable office-alarm.service
echo "service installed. Type 'sudo systemctl start office-alarm' to start the service" 
