/* globals require, describe, it, expect, spyOn, beforeEach, jasmine */

/*!
 * Module dependencies.
 */
var cordova = require('./helper/cordova');
var window = require('./helper/resolveLocalFileSystemURL'); // eslint-disable-line no-unused-vars
var testStreams = require('./streams');
var MediaRecorder = require('../www/MediaRecorder');
var execWin;
var execSpy;

describe('phonegap-plugin-media-recorder', function () {
    beforeEach(function () {
        execWin = jasmine.createSpy();
        execSpy = spyOn(cordova.required, 'cordova/exec').andCallFake(execWin);
    });

    describe('MediaRecorder', function () {
        it('should exist', function () {
            expect(MediaRecorder).toBeDefined();
            expect(typeof MediaRecorder === 'function').toBe(true);
        });

        it('should take a MediaStream as constructor argument with audio', function () {
            var options = { mimeType: 'audio/m4a' };
            spyOn(MediaRecorder.prototype, 'requestData').andCallFake(function () {
                var dummyString = 'fetch';
                return dummyString;
            });
            var media = new MediaRecorder(testStreams.audioOnly, options);
            expect(media).toBeDefined();
            expect(typeof media === 'object').toBe(true);
            expect(media.stream).toBeDefined();
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
            expect(media.isTypeSupported('video/mp4')).toEqual(false);
            expect(media.isTypeSupported('audio/m4a')).toEqual(true);
            expect(media.isTypeSupported('audio/wav')).toEqual(true);
            expect(media.isTypeSupported('video/quicktime')).toEqual(false);
            expect(media.isTypeSupported('')).toEqual(true);
            expect(media.state).toBe('inactive');
            execSpy.andCallFake(function (win, fail, service, id, args) {
                win({
                    state: 'recording'
                });
            });
            var startSpy = spyOn(media, 'onstart');
            var pauseSpy = spyOn(media, 'onpause');
            var resumeSpy = spyOn(media, 'onresume');
            var stopSpy = spyOn(media, 'onstop');
            media.start();
            expect(media.state).toBe('recording');
            expect(startSpy).toHaveBeenCalled();
            media.pause();
            expect(media.state).toBe('paused');
            expect(pauseSpy).toHaveBeenCalled();
            media.resume();
            expect(media.state).toBe('recording');
            expect(resumeSpy).toHaveBeenCalled();
            media.stop();
            expect(media.state).toBe('inactive');
            expect(stopSpy).toHaveBeenCalled();
        });

        it('should take a MediaStream as constructor argument with audio + video', function () {
            var options = { mimeType: 'video/quicktime' };
            spyOn(MediaRecorder.prototype, 'requestData').andCallFake(function () {
                var dummyString = 'fetch';
                return dummyString;
            });
            var media = new MediaRecorder(testStreams.audioAndVideo, options);
            expect(media).toBeDefined();
            expect(typeof media === 'object').toBe(true);
            expect(media.stream).toBeDefined();
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
            expect(media.isTypeSupported('video/mp4')).toEqual(false);
            expect(media.isTypeSupported('audio/m4a')).toEqual(false);
            expect(media.isTypeSupported('audio/wav')).toEqual(false);
            expect(media.isTypeSupported('video/quicktime')).toEqual(true);
            expect(media.isTypeSupported('')).toEqual(true);
            execSpy.andCallFake(function (win, fail, service, id, args) {
                win({
                    state: 'recording'
                });
            });
            var startSpy = spyOn(media, 'onstart');
            var stopSpy = spyOn(media, 'onstop');
            media.start();
            expect(media.state).toBe('recording');
            expect(startSpy).toHaveBeenCalled();
            media.stop();
            expect(media.state).toBe('inactive');
            expect(stopSpy).toHaveBeenCalled();
        });

        it('should take a MediaStream as constructor argument with video only', function () {
            var options = { mimeType: 'video/quicktime' };
            spyOn(MediaRecorder.prototype, 'requestData').andCallFake(function () {
                var dummyString = 'fetch';
                return dummyString;
            });
            var media = new MediaRecorder(testStreams.videoOnly, options);
            expect(media).toBeDefined();
            expect(typeof media === 'object').toBe(true);
            expect(media.stream).toBeDefined();
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
            expect(media.isTypeSupported('video/mp4')).toEqual(false);
            expect(media.isTypeSupported('audio/m4a')).toEqual(false);
            expect(media.isTypeSupported('audio/wav')).toEqual(false);
            expect(media.isTypeSupported('video/quicktime')).toEqual(true);
            expect(media.isTypeSupported('')).toEqual(true);
            execSpy.andCallFake(function (win, fail, service, id, args) {
                win({
                    state: 'recording'
                });
            });
            var startSpy = spyOn(media, 'onstart');
            var stopSpy = spyOn(media, 'onstop');
            media.start();
            expect(media.state).toBe('recording');
            expect(startSpy).toHaveBeenCalled();
            media.stop();
            expect(media.state).toBe('inactive');
            expect(stopSpy).toHaveBeenCalled();
        });
    });
});
