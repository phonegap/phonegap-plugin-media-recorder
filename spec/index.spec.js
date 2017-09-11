/* globals require, describe, it, expect */

/*!
 * Module dependencies.
 */
var cordova = require('./helper/cordova');
var MediaRecorder = require('../www/MediaRecorder');

describe('phonegap-plugin-media-recorder', function () {

    describe('MediaRecorder', function () {

        it('should exist', function () {
            expect(MediaRecorder).toBeDefined();
            expect(typeof MediaRecorder === 'function').toBe(true);
        });

        it('should take a MediaStream as constructor argument', function (done) {
            try {
                var constraints = {
                    audio: true,
                    video: true
                };
                var p = navigator.mediaDevices.getUserMedia(constraints);
                expect(p).toBeDefined();
                p.then(function (stream) {
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
                    expect(typeof media.isTypeSupported).toBe('function');
                    done();
                }, function (err) {
                    expect(err).toBeDefined();
                    console.log(err);
                    done();
                });
            } catch (err) {
                done();
            }
        });

    });
});
