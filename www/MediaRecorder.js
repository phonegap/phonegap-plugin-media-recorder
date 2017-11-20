/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/
/* globals Promise, cordova, DOMException, fetch, resolveLocalFileSystemURL */
var exec = cordova.require('cordova/exec');

var MediaRecorder = function (stream, options) {
    this.stream = stream;
    if (options) {
        this.mimeType = options.mimeType;
    } else {
        this.mimeType = '';
    }
    this.videoBitsPerSecond = 0;
    this.audioBitsPerSecond = 0;
    this.state = 'inactive';
    this.onstart = function () {};
    this.onstop = function () {};
    this.ondataavailable = function () {};
    this.onpause = function () {};
    this.onresume = function () {};
    this.onerror = function () {};
    this.id = '';
    this.src = 'cdvfile://localhost/temporary/recording.';
    if (this.stream.getVideoTracks()[0] === undefined) {
        this.typesSupported = {
            '': 'm4a',
            'audio/wav': 'wav',
            'audio/m4a': 'm4a'
        };
    } else {
        this.typesSupported = {
            'video/quicktime': 'mov',
            '': 'mov'
        };
    }
};

MediaRecorder.prototype.start = function (timeslice) {
    if (this.state !== 'inactive') {
        throw new DOMException('', 'InvalidStateError');
    } else {
        this.state = 'recording';
        var that = this;
        if (this.isTypeSupported(this.mimeType)) {
            this.src = this.src + this.typesSupported[this.mimeType];
        } else {
            throw new DOMException(
                'Incompatible mimeType',
                'NotSupportedError'
            );
        }
        // If we have a video stream pass in which camera to use
        var video = this.stream.getVideoTracks()[0]
            ? this.stream.getVideoTracks()[0].label
            : '';
        // If we have an audio stream enable recording of audio
        var audio = this.stream.getAudioTracks().length > 0;
        var success = function (info) {
            if (info.state === 'recording') {
                that.onstart();
            } else if (info.state === 'inactive') {
                that.src = info.url;
                that.requestData();
                this.state = info.state;
                that.onstop();
            }
        };
        var fail = function (error) {
            that.onerror(error);
        };
        if (video !== '') {
            exec(success, fail, 'MediaRecorder', 'start', [
                video,
                audio
            ]);
        } else {
            this.id = this.stream.getAudioTracks()[0].id;
            exec(success, fail, 'AudioRecorder', 'startRecordingAudio', [
                this.id,
                this.src
            ]);
        }
    }
};

MediaRecorder.prototype.stop = function () {
    if (this.state === 'inactive') {
        throw new DOMException('', 'InvalidStateError');
    } else {
        var that = this;
        var success = function (info) {
            resolveLocalFileSystemURL(that.src, function (entry) {
                // eslint-disable-line no-undef
                var nativePath = entry.toURL();
                that.src = nativePath;
                that.requestData();
                that.state = 'inactive';
                that.onstop();
            });
        };
        var fail = function (error) {
            that.onstop();
            that.onerror(error);
        };
        if (this.id === '') {
            exec(success, fail, 'MediaRecorder', 'stop', []);
        } else {
            exec(success, fail, 'AudioRecorder', 'stopRecordingAudio', [
                this.id,
                this.src
            ]);
        }
    }
};

MediaRecorder.prototype.pause = function () {
    if (this.state === 'inactive') {
        throw new DOMException('', 'InvalidStateError');
    } else {
        this.state = 'paused';
        var that = this;
        var success = function (info) {
            that.onpause();
        };
        var fail = function (error) {
            that.onerror(error);
        };
        exec(success, fail, 'AudioRecorder', 'pauseRecordingAudio', [this.id]);
    }
};

MediaRecorder.prototype.resume = function () {
    if (this.state === 'inactive') {
        throw new DOMException('', 'InvalidStateError');
    } else {
        this.state = 'recording';
        var that = this;
        var success = function (info) {
            that.onresume();
        };
        var fail = function (error) {
            that.onerror(error);
        };
        exec(success, fail, 'AudioRecorder', 'resumeRecordingAudio', [this.id]);
    }
};

MediaRecorder.prototype.requestData = function () {
    if (this.state === 'inactive') {
        throw new DOMException('', 'InvalidStateError');
    } else {
        var that = this;
        // works on ios 10.3 and above
        fetch(this.src)
            .then(function (response) {
                return response.blob();
            })
            .then(function (blob) {
                that.ondataavailable(blob);
            });
    }
};

MediaRecorder.prototype.isTypeSupported = function (type) {
    return this.typesSupported[type] !== undefined;
};

module.exports = MediaRecorder;
