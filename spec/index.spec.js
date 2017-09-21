/* globals require, describe, it, expect */

/*!
 * Module dependencies.
 */
var cordova = require('./helper/cordova');
var testStreams = require('./streams');
var MediaRecorder = require('../www/MediaRecorder');

describe('phonegap-plugin-media-recorder', function () {
    describe('MediaRecorder', function () {
        it('should exist', function () {
            expect(MediaRecorder).toBeDefined();
            expect(typeof MediaRecorder === 'function').toBe(true);
        });

        it('should take a MediaStream as constructor argument with audio', function () {
            var options = { mimeType: 'video/quicktime' };
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
            // spyOn(media,'onstart');
            // media.start();
            // expect(media.state).toBe('recording');
            // // expect(media.onstart).toHaveBeenCalled();
            // media.pause();
            // expect(media.state).toBe('paused');
            // media.resume();
            // expect(media.state).toBe('recording');
            // // spyOn(media,'onstop');
            // media.stop();
            // expect(media.state).toBe('inactive');
        });

        it('should take a MediaStream as constructor argument with audio + video', function () {
            var options = { mimeType: 'video/quicktime' };
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
            // media.start();
            // expect(media.state).toBe('recording');
            // media.stop();
            // expect(media.state).toBe('inactive');
        });

        it('should take a MediaStream as constructor argument with video only', function () {
            var options = { mimeType: 'video/quicktime' };
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
            // media.start();
            // expect(media.state).toBe('recording');
            // media.stop();
            // expect(media.state).toBe('inactive');
        });
    });
});
