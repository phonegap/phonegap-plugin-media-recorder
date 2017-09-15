/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

#import <Foundation/Foundation.h>
#import <AudioToolbox/AudioServices.h>
#import <AVFoundation/AVFoundation.h>

#import <Cordova/CDVPlugin.h>

@interface CDVAudioRecorder : AVAudioRecorder
{
    NSString* mediaId;
}
@property (nonatomic, copy) NSString* mediaId;
@end

@interface CDVAudioFile : NSObject
{
    NSString* resourcePath;
    NSURL* resourceURL;
    CDVAudioRecorder* recorder;
}

@property (nonatomic, strong) NSString* resourcePath;
@property (nonatomic, strong) NSURL* resourceURL;
@property (nonatomic, strong) CDVAudioRecorder* recorder;

@end

@interface CDVAudio : CDVPlugin <AVAudioPlayerDelegate, AVAudioRecorderDelegate>
{
    NSMutableDictionary* soundCache;
    NSString* currMediaId;
    AVAudioSession* avSession;
    AVPlayer* avPlayer;
    NSString* statusCallbackId;
}
@property (nonatomic, strong) NSMutableDictionary* soundCache;
@property (nonatomic, strong) AVAudioSession* avSession;
@property (nonatomic, strong) NSString* currMediaId;
@property (nonatomic, strong) NSString* statusCallbackId;
@property (strong, nonatomic) CDVInvokedUrlCommand * command;

- (void)release:(CDVInvokedUrlCommand*)command;
- (void)getCurrentPositionAudio:(CDVInvokedUrlCommand*)command;
- (void)resumeRecordingAudio:(CDVInvokedUrlCommand*)command;
- (void)pauseRecordingAudio:(CDVInvokedUrlCommand*)command;

- (BOOL)hasAudioSession;

// helper methods
- (NSURL*)urlForRecording:(NSString*)resourcePath;

- (CDVAudioFile*)audioFileForResource:(NSString*)resourcePath withId:(NSString*)mediaId doValidation:(BOOL)bValidate forRecording:(BOOL)bRecord;
- (CDVAudioFile*)audioFileForResource:(NSString*)resourcePath withId:(NSString*)mediaId doValidation:(BOOL)bValidate forRecording:(BOOL)bRecord suppressValidationErrors:(BOOL)bSuppress;

- (void)startRecordingAudio:(CDVInvokedUrlCommand*)command;
- (void)stopRecordingAudio:(CDVInvokedUrlCommand*)command;

@end
