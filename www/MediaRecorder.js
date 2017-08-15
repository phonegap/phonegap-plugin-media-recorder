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
/* globals Promise, cordova */
var exec = cordova.require('cordova/exec');
var utils = cordova.require('cordova/utils');

var MediaRecorder = function (stream, options) {
    this.stream = stream;
    if(!options.mimeType){
    	this.mimeType = '';
    };
    this.state = 'inactive';
    if(!options.videoBitsPerSecond){
    	this.videoBitsPerSecond = 0;
    };
    if(!options.audioBitsPerSecond){
    	this.audioBitsPerSecond = 0;
    };
    this.onstart = function () {};
    this.onstop = function () {};
    this.ondataavailable = function () {};
    this.onpause = function () {};
    this.onresume = function () {};
    this.onerror = function () {};
};

MediaRecorder.prototype.start = function (timeslice) {
    if(this.state != 'inactive'){
        var name = 'InvalidStateError';
        var description = '';
        var domException = new DOMException(description, name);
        return domException;
    }
    else {
    	this.state = 'recording';
        var success = function (info) {           
            this.onstart();       
        };
        var fail = function (error) {      
        };
        exec(success, fail, 'MediaRecorder', 'start', [timeslice]);
    }
};
MediaRecorder.prototype.stop = function () {
    if(this.state === 'inactive'){
        var name = 'InvalidStateError';
        var description = '';
        var domException = new DOMException(description, name);
        return domException;
    }
    else {
    	this.state = 'inactive';
        var success = function (info) {           
            this.onstop();       
        };
        var fail = function (error) {      
        };
        exec(success, fail, 'MediaRecorder', 'stop', []);
    }
};
MediaRecorder.prototype.pause = function () {
    if(this.state === 'inactive'){
        var name = 'InvalidStateError';
        var description = '';
        var domException = new DOMException(description, name);
        return domException;
    }
    else {
    	this.state = 'paused';
        var success = function (info) {           
            this.onpause();       
        };
        var fail = function (error) {      
        };
        exec(success, fail, 'MediaRecorder', 'pause', []);
    }
};
MediaRecorder.prototype.resume = function () {
	if(this.state === 'inactive'){
        var name = 'InvalidStateError';
        var description = '';
        var domException = new DOMException(description, name);
        return domException;
    }
    else {
    	this.state = 'recording';
        var success = function (info) {           
            this.onresume();       
        };
        var fail = function (error) {      
        };
        exec(success, fail, 'MediaRecorder', 'resume', []);
    }
};
MediaRecorder.prototype.requestData = function () {
    this.ondataavailable();
};
MediaRecorder.prototype.isTypeSupported = function (type) {
   // return true/false;
};

module.exports = MediaRecorder;
