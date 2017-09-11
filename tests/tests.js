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

/* globals MediaRecorder */
/* jshint jasmine: true */

exports.defineManualTests = function (contentEl, createActionButton) {
    var setVideo = function (constraints) {
        navigator.mediaDevices.getUserMedia(constraints
        ).then(function (getmedia) {
            var media = new MediaRecorder(getmedia);
            media.onstop = function () {
                media.requestData();
            };
            media.ondataavailable = function (blob) {
                // how to play in video element
                var v = document.getElementById('vid');
                v.src = media.src;
            };
            media.start();

        });

    };

    var clickPicture = '<div id ="Take_Video"></div>';
    contentEl.innerHTML = '<video id="vid"></video>' + clickPicture;

    createActionButton('Audio + Video (Front)', function () {
        var constraints = {
            'audio': true,
            'video': {
                facingMode: 'user'
            }
        };
        setVideo(constraints);
    }, 'Take_Video');
    createActionButton('Audio + Video (Rear)', function () {
        var constraints = {
            'audio': true,
            'video': {
                facingMode: 'environment'
            }
        };
        setVideo(constraints);
    }, 'Take_Video');
    createActionButton('Audio (False) + Video (Front)', function () {
        var constraints = {
            'audio': false,
            'video': {
                facingMode: 'user'
            }
        };
        setVideo(constraints);
    }, 'Take_Video');
    createActionButton('Audio (False) + Video (Rear)', function () {
        var constraints = {
            'audio': false,
            'video': {
                facingMode: 'environment'
            }
        };
        setVideo(constraints);
    }, 'Take_Video');
    createActionButton('Video Only(Front)', function () {
        var constraints = {
            'video': {
                facingMode: 'user'
            }
        };
        setVideo(constraints);
    }, 'Take_Video');
    createActionButton('Video Only(Rear)', function () {
        var constraints = {
            'video': {
                facingMode: 'environment'
            }
        };
        setVideo(constraints);
    }, 'Take_Video');

};
