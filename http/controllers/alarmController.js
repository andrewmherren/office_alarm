'use strict'
const async = require('async')
const execSync = require('child_process').execSync
const exec = require('child_process').exec

/*
 * @api [post] /api/alarm
 * description: This endpoint allows you to post an allowed command (either sysShutdown or reboot) to be executed by the pi.
 * parameters:
 *   - in: body
 *     name: event
 *     description: An alarm event to send.
 *     schema:
 *       type: object
 *       properties:
 *         phrase: 
 *           description: The phrase to be spoken
 *           type: string
 *         alarm:
 *           description: play the alarm tone before speaking
 *           type: integer
 *         flash:
 *           description: flash the lights before speaking
 *           type: integer
 * responses:
 *   200:
 *     description: Success.
 *     schema:
 *       type: string
 *   400:
 *     description: An error string
 *     schema:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */
exports.post = function (request, response) {
  if (request.body.phrase != null) {
    // If a phrase was requested, download it from the tts site before continuing so its ready to play without a pause later
    execSync('wget -q -U Mozilla -O "/dev/shm/out.wav" "http://api.voicerss.org/?key=' + process.env.VOICE_RSS_KEY + '&src=' + request.body.phrase + '&hl=en-gb&c=WAV&f=16khz_16bit_mono&r=1"')
  }
  // This will run the following two functions (flash and alarm) in parallel and execute the third (speaking) only after they both finish.
  async.parallel([  
    function(parallelCallback) {
      let alarmCnt = request.body.alarm
      if (!isNaN(alarmCnt) && parseInt(alarmCnt) <= 5) {
        // If there was an alarm request, set the appropriate volume and play the sound the appropriate number of times 
        execSync('amixer -c 1 cset numid=6 29,29')
        async.during(
          function(callback) {
            return callback(null, alarmCnt > 0)
          },
          function (callback) {
            alarmCnt--
            exec('play /etc/hipaa_alarm/alarm.wav')
	    // for some reason the previous command returns immediatly even though the sound is still playing. 
            // The following timeout ensures that the next sound doesnt start until this one ends
            setTimeout(function(){ callback(null,'success') }, 2300)
          },
          function (error) {
            parallelCallback(null,'success')
          }
        )
      }
    },
    function(parallelCallback) {
      let flashCnt = request.body.flash
      if (!isNaN(flashCnt) && parseInt(flashCnt) <= 5) {
        // If there was a flash request, flash the requested number of times
        async.during(
          function (callback) {
            return callback(null, flashCnt > 0)
          },
          function (duringCallback) {
            flashCnt--
            async.series([
              function(callback1) { exec('gpio_write.sh 7 1', {cwd: global.scriptDir}, callback1(null,'success'))},
              function(callback2) { setTimeout(function(){ callback2(null,'success')}, 1150)},
              function(callback3) { exec('gpio_write.sh 7 0', {cwd: global.scriptDir}, callback3(null,'success'))},
              function(callback4) { setTimeout(function(){ callback4(null,'success')}, 1150)}
            ],
            function(error, result) {
              duringCallback(null, 'success')
            })
          },
          function(error) {
            parallelCallback(null,'success')
          }
        )
      }
    }
  ], 
  function(error, results) {
    if(error) {
      response.status(400).send({'error': error})
    } else if (request.body.phrase != null) {
      // If speach was requested, adjust the sound level to the correct setting
      execSync('amixer -c 1 cset numid=6 37,37')
      // And then play the sound that was downloaded earlier
      exec('play /dev/shm/out.wav', (error, stdout, stderr) => {
        if (error) {
          response.status(400).send({'error': stderr})
          return null
        } else {
          response.status(200).send({'response': 'success'})
        }
      })
    } else {
      response.status(200).send({'response': 'success'})
    }
  })
}

