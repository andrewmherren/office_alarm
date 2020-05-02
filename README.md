# Office alarm
This is a copy of my gerneral purpose [rAsPI](https://www.github.com/andrewmherren/rAsPI) that has been modified for use as an office alert/alarm. Simply, follow the steps below to install this repo on a raspberry pi, connect a speaker, and connect a light or some other indicator to GPIO pin 7.

Requires Nodejs, git, and sox
```
sudo apt-get install git sox
sudo wget https://nodejs.org/dist/v6.10.2/node-v6.10.2-linux-armv6l.tar.gz
```
Note: it may be necessary to update the link above by going to http://nodejs.org and find the latest ARM version.

Once the tar file has been downloaded, unzip it and copy the contents to the /user/local directory.
```
sudo tar -zxvf node-v6.10.2-linux-armv6l.tar.gz
cd node-v6.10.2-linux-armv61
sudo cp -R * /usr/local
```
confirm node is working properly
```
node -v
```

setup usb sound device.
edit /usr/share/alsa/alsa.conf
find
```
    defaults.ctl.card 0
    defaults.pcm.card 0
```
and change 0 to 1

To setup this project on a raspberry pi after the requirements have been installed:
```
sudo git clone https://github.com/andrewmherren/office_alarm.git
cd office_alarm
npm install
```

Edit the office_alarm/docs/swaggerBase.json file and update the host to be the name used to acess your pi on your network. Typically this would either be its IP address or its hostname with .local appended to the end. (eg ```"host": "raspberrypi.local",``` or ```"host":"192.168.1.10",```)
Note: leaving the the host set to localhost as it is by default will cause swager-ui to only be able to complete API calls when it is accessed from a browser running on the same machine that the API is running on... updating to a more general name as described above will allow swagger-ui to work correctly from any machine on the network.

After making swagger changes, rebuild the swagger.json file:
```
npm run build
```

To start API:
```
npm start
```
You should now be able to open a web browser and navigate to http://host:3000/docs and see the swagger-ui
