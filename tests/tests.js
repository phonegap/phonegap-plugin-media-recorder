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

exports.defineAutoTests = function () {

    describe('phonegap-plugin-media-recorder', function () {

        describe('MediaRecorder', function () {

            it('should exist', function () {
                expect(MediaRecorder).toBeDefined();
                expect(typeof MediaRecorder === 'function').toBe(true);
            });

            it('should take a MediaStream as constructor argument', function (done) {
                console.log('here1');
                try {
                    var constraints = {
                        audio: true,
                        video: true
                    };
                    var p = navigator.mediaDevices.getUserMedia(constraints);
                    console.log(typeof p);
                    expect(p).toBeDefined();
                    p.then(function (stream) {
                        console.log('here');
                        var media = new MediaRecorder(stream);
                        expect(media).toBeDefined();
                        expect(typeof media === 'object').toBe(true);
                        expect(media.stream).toBeDefined();
                        expect(media.stream.id).toBeDefined();
                        expect(typeof media.stream.id).toBe('string');
                        expect(media.stream.getVideoTracks()[0]).toBeDefined();
                        console.log(media.stream.getVideoTracks[0]);
                        console.log(typeof media.stream.getVideoTracks[0]);
                        expect(media.stream.getAudioTracks()[0]).toBeDefined();
                        expect(media.stream.getTracks()).toBeDefined();
                        expect(media.stream.getTrackbyId()).toBeDefined();
                        expect(media.stream.addTrack()).toBeDefined();
                        expect(media.stream.removeTrack()).toBeDefined();
                        expect(media.stream.onaddtrack).toBeDefined();
                        expect(media.stream.onremovetrack).toBeDefined();
                        expect(media.stream.clone()).toBeDefined();
                        expect(media.stream.active).toBeDefined();
                        expect(typeof media.stream.active).toBe('number');
                        expect(media.mimeType).toBeDefined();
                        expect(typeof media.mimeType).toBe('string');
                        expect(media.state).toBeDefined();
                        var recState = ['inactive', 'recording', 'paused'];
                        expect(recState).toContain(media.state);
                        expect(media.onstart).toBeDefined();
                        expect(media.onstop).toBeDefined();
                        expect(media.ondataavailable).toBeDefined();
                        expect(media.onpause).toBeDefined();
                        expect(media.onresume).toBeDefined();
                        expect(media.onerror).toBeDefined();
                        expect(media.videoBitsPerSecond).toBeDefined();
                        expect(typeof media.videoBitsPerSecond).toBe('number');
                        expect(media.audioBitsPerSecond).toBeDefined();
                        expect(typeof media.audioBitsPerSecond).toBe('number');
                        expect(media.start).toBeDefined();
                        expect(typeof media.start).toBe('function');
                        expect(media.stop).toBeDefined();
                        expect(typeof media.stop).toBe('function');
                        expect(media.pause).toBeDefined();
                        expect(typeof media.pause).toBe('function');
                        expect(media.resume).toBeDefined();
                        expect(typeof media.resume).toBe('function');
                        expect(media.requestData).toBeDefined();
                        expect(typeof media.requestData).toBe('function');
                        expect(media.isTypeSupported).toBeDefined();
                        done();

                    }, function (err) {
                        expect(err).toBeDefined();
                        console.log(err);
                        fail(err);
                        done();
                    });
                } catch (err) {
                    fail(err);
                    done();

                }
            });

        });
    });
};
