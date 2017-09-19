/* globals require, describe, it, expect */

/*!
 * Module dependencies.
 */
var cordova = require('./helper/cordova');
var MediaRecorder = require('../www/MediaRecorder');
// audio only
var stream1 = {id: "8EF37333-A700-4082-AE9A-78211403DD4C", audioTracks: [{id: "7B0A51E2-F6F1-45E0-A743-BDD8A1B7D33D", kind: "audio", description: "AVCaptureDeviceTypeBuiltInMicrophone"}], videoTracks: [], getAudioTracks: function() { return stream1.audioTracks;}, getVideoTracks: function() { return stream1.videoTracks;}};
// audio + video
var stream2 = {id: "E13D8A74-A1AC-40E3-A3A6-C78262CDC5B7", audioTracks: [{id: "899B406A-B1B7-42EC-AE33-283001D203EF", kind: "audio", description: "AVCaptureDeviceTypeBuiltInMicrophone"}], videoTracks: [{id: "C8F600ED-6C3D-41A7-AAEC-0294A8FBDAD5", kind: "video", description: "rearcamera"}, {id: "77F46117-0971-4356-AF12-E3BE64070CC6", kind: "video", description: "frontcamera"}], getAudioTracks: function() { return stream2.audioTracks;}, getVideoTracks: function() { return stream2.videoTracks;}};
// video only
var stream3 = {id: "D856DDA8-D3C0-46A7-88B7-ECD8A8DE9A29", audioTracks: [], videoTracks: [{id: "67761BF6-F1F1-496D-B8CE-FA0394AEDFDE", kind: "video", description: "rearcamera"}, {id: "0E9146B0-CF9B-4CDE-8A0C-5F2C76EBEDD6", kind: "video", description: "frontcamera"}], getAudioTracks: function() { return stream3.audioTracks;}, getVideoTracks: function() { return stream3.videoTracks;}};
// none
var stream4 = {id: "8F825B0A-7894-46F8-8C3D-F4E4458BE29E", audioTracks: [], videoTracks: [], getAudioTracks: function() { return stream4.audioTracks;}, getVideoTracks: function() { return stream4.videoTracks;}};



describe('phonegap-plugin-media-recorder', function () {

    describe('MediaRecorder', function () {

        it('should exist', function () {
            expect(MediaRecorder).toBeDefined();
            expect(typeof MediaRecorder === 'function').toBe(true);
        });

        it('should take a MediaStream as constructor argument with audio', function () {
            var options = {mimeType : 'video/quicktime'};
            var media = new MediaRecorder(stream1);
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
            media.start();
            expect(media.state).toBe('recording');
            // expect(media.onstart).toHaveBeenCalled();
            media.pause();
            expect(media.state).toBe('paused');
            media.resume();
            expect(media.state).toBe('recording');
            // spyOn(media,'onstop');
            media.stop();
            expect(media.state).toBe('inactive');
             
        });

        it('should take a MediaStream as constructor argument with audio + video', function () {
            var options = {mimeType : 'video/quicktime'};
            var media = new MediaRecorder(stream2, options);
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
            media.start();
            expect(media.state).toBe('recording');
            media.stop();
            expect(media.state).toBe('inactive');
        });

        it('should take a MediaStream as constructor argument with video only', function () {
            var options = {mimeType : 'video/quicktime'};
            var media = new MediaRecorder(stream3);
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
            media.start();
            expect(media.state).toBe('recording');
            media.stop();
            expect(media.state).toBe('inactive');
        });
    });
});
