<!---
 # license: Licensed to the Apache Software Foundation (ASF) under one
 #         or more contributor license agreements.  See the NOTICE file
 #         distributed with this work for additional information
 #         regarding copyright ownership.  The ASF licenses this file
 #         to you under the Apache License, Version 2.0 (the
 #         "License"); you may not use this file except in compliance
 #         with the License.  You may obtain a copy of the License at
 #
 #           http://www.apache.org/licenses/LICENSE-2.0
 #
 #         Unless required by applicable law or agreed to in writing,
 #         software distributed under the License is distributed on an
 #         "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 #         KIND, either express or implied.  See the License for the
 #         specific language governing permissions and limitations
 #         under the License.
 -->


# phonegap-plugin-media-recorder

This plugin provides an implementation for recording video and audio on a device based on the [W3C MediaStream Recording API](https://www.w3.org/TR/mediastream-recording/) for iOS and Android. In order to achieve the recording, this plugin uses the [phonegap-plugin-media-stream](https://github.com/phonegap/phonegap-plugin-media-stream) which is based on the [W3C Media Stream API](https://www.w3.org/TR/mediacapture-streams/). The phonegap-plugin-media-stream makes the mediastream track available to the phonegap-plugin-media-recorder which allows the user to record a vide/audio. The phonegap-plugin-media-stream is added as a dependency to the phonegap-plugin-media-recorder plugin.



## Installation


phonegap plugin add phonegap-plugin-media-recorder

phonegap plugin add https://github.com/phonegap/phonegap-plugin-media-recorder.git


## MediaRecorder Constructor

The MediaRecorder constructor uses the mediastream track obtained by using the phonegap-plugin-media-stream to create an object. An optional parameter for mimeType can also be passed.In iOS, the current suppported mimeTypes for mediaRecorder are : audio/m4a, audio/wav and video/quicktime. If options parameter is not passed the recording continues with default formats ( audio/m4a for audio recording and video/quicktime for video recording).

### Example

        navigator.mediaDevices.getUserMedia({
            'audio': true,
            'video': {
            facingMode: 'user'
            }
        }).then(function(getmedia) {
            var options = { mimeType : 'video/quicktime'};
            var mediaRecorder = new MediaRecorder(getmedia, options);
        });


## The `mediaRecorder` object

The mediaRecorder object has the following methods:

- [start(optional timeslice)](https://github.com/phonegap/phonegap-plugin-media-recorder#mediarecorderstartoptional-timeslice)
- [stop()](https://github.com/phonegap/phonegap-plugin-media-recorder#mediastop)
- [pause()](https://github.com/phonegap/phonegap-plugin-media-recorder#mediapause)
- [resume()](https://github.com/phonegap/phonegap-plugin-media-recorder#mediaresume)
- [requestData()](https://github.com/phonegap/phonegap-plugin-media-recorder#mediarequestdata)
- [isTypeSupported](https://github.com/phonegap/phonegap-plugin-media-recorder#mediarecorderistypesupported)

The mediaRecorder object also has the following events:

- onstart()
- onstop()
- onpause()
- onresume()
- ondataavailable()


##  mediaRecorder.start(optional timeslice)

The start method accepts an optional timeslice parameter (in milliseconds) and allows the user to record an audio/ video. The timeslice parameter allows the user to specify the duration of the recorded video/audio. For video recording, the implementation in iOS allows the user to open the camera view and record the video. For audio, the iOS implementation does not have a specific UI and works in the background. Android has integrated support for the [W3C Media Stream API](https://www.w3.org/TR/mediacapture-streams/) and the [W3C MediaStream Recording API](https://www.w3.org/TR/mediastream-recording/).

### Example

    mediaRecorder.start();


##  mediaRecorder.stop

The stop method allows the user to stop recording an audio/ video. For video recording, the implementation in iOS allows the user to stop the video using the camera button. For audio, the iOS implementation does not have a specific UI and works in the background.

### Example

    mediaRecorder.stop();


## mediaRecorder.pause

This functionality is supported only for audio recording on iOS. Fully supported on Android.

### Example

    mediaRecorder.pause();


## mediaRecorder.resume

This functionality is supported only for audio recording on iOS. Fully supported on Android.

### Example

    mediaRecorder.resume();


## mediaRecorder.requestData

This functionality allows us to gather the recorded video/audio data in a blob.

### Example

    mediaRecorder.requestData();


## mediaRecorder.isTypeSupported

This method allows us to see if a specific mimeType is supported

### Example

mediaRecorder.isTypeSupported("audio/m4a");   //  returns true


## Gathering and Playing the recorded data

After the requestData() method is called and the blob is created, the `ondataavailable` event is fired which allows us to retieve and play the data. However, in iOS, playing the recorded video using a `blob` as a source for a video tag is not supported yet, and therefore, we assign the native file URI as a source to the video and audio tags.

### Example

Recording video on iOS

    mediaRecorder.onstart = function() {
        console.log('recording started');
    }
    mediaRecorder.onstop = function() {
        console.log ('recording stopped');
    mediaRecorder.requestData();
    }
    mediaRecorder.ondataavailable = function(blob) {
        var videoTag = document.getElementById("vid");  // vid is the video tag 
        videoTag.src = mediaRecorder.src;
    }
    mediaRecorder.start();


The stop(), pause() and resume() events are supported on Android.


Recording Audio

    mediaRecorder.onstart = function() {
        console.log('recording started');
    }
    mediaRecorder.onstop = function() {
        console.log ('recording stopped');
        mediaRecorder.requestData();
    }
    mediaRecorder.ondataavailable = function(blob) {
        var audioTag = document.getElementById("aud");  //  aud is the audio tag 
        audioTag.src = mediaRecorder.src;
    }
    mediaRecorder.start();

// stop recording audio after 10 seconds

    setTimeout(function(){
        mediaRecorder.stop();
    }, 10000);           




## [Contributing](https://github.com/phonegap/phonegap-plugin-media-recorder/blob/master/.github/CONTRIBUTING.md)

## [LICENSE](https://github.com/phonegap/phonegap-plugin-media-recorder/blob/master/LICENSE)

