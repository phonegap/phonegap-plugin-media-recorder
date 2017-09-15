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

#import "CDVAudioRecorder.h"
#import "CDVFile.h"
#import <AVFoundation/AVFoundation.h>
#include <math.h>

#define DOCUMENTS_SCHEME_PREFIX @"documents://"
#define HTTP_SCHEME_PREFIX @"http://"
#define HTTPS_SCHEME_PREFIX @"https://"
#define CDVFILE_PREFIX @"cdvfile://"

@implementation CDVAudio

@synthesize soundCache, avSession, currMediaId, statusCallbackId;

// Maps a url for a resource path for recording
- (NSURL*)urlForRecording:(NSString*)resourcePath
{
    NSURL* resourceURL = nil;
    NSString* filePath = nil;
    NSString* docsPath = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)[0];

    // first check for correct extension
    NSString* ext=[resourcePath pathExtension];
    if ([ext caseInsensitiveCompare:@"wav"] != NSOrderedSame &&
        [ext caseInsensitiveCompare:@"m4a"] != NSOrderedSame) {
        resourceURL = nil;
        NSLog(@"Resource for recording must have wav or m4a extension");
    } else if ([resourcePath hasPrefix:DOCUMENTS_SCHEME_PREFIX]) {
        // try to find Documents:// resources
        filePath = [resourcePath stringByReplacingOccurrencesOfString:DOCUMENTS_SCHEME_PREFIX withString:[NSString stringWithFormat:@"%@/", docsPath]];
        NSLog(@"Will use resource '%@' from the documents folder with path = %@", resourcePath, filePath);
    } else if ([resourcePath hasPrefix:CDVFILE_PREFIX]) {
        CDVFile *filePlugin = [self.commandDelegate getCommandInstance:@"File"];
        CDVFilesystemURL *url = [CDVFilesystemURL fileSystemURLWithString:resourcePath];
        filePath = [filePlugin filesystemPathForURL:url];
        if (filePath == nil) {
            resourceURL = [NSURL URLWithString:resourcePath];
        }
    } else {
        // if resourcePath is not from FileSystem put in tmp dir, else attempt to use provided resource path
        NSString* tmpPath = [NSTemporaryDirectory()stringByStandardizingPath];
        BOOL isTmp = [resourcePath rangeOfString:tmpPath].location != NSNotFound;
        BOOL isDoc = [resourcePath rangeOfString:docsPath].location != NSNotFound;
        if (!isTmp && !isDoc) {
            // put in temp dir
            filePath = [NSString stringWithFormat:@"%@/%@", tmpPath, resourcePath];
        } else {
            filePath = resourcePath;
        }
    }

    if (filePath != nil) {
        // create resourceURL
        resourceURL = [NSURL fileURLWithPath:filePath];
    }
    return resourceURL;
}


// Creates or gets the cached audio file resource object
- (CDVAudioFile*)audioFileForResource:(NSString*)resourcePath withId:(NSString*)mediaId doValidation:(BOOL)bValidate forRecording:(BOOL)bRecord suppressValidationErrors:(BOOL)bSuppress
{
    BOOL bError = NO;
    NSString* errMsg = @"";
    CDVAudioFile* audioFile = nil;
    NSURL* resourceURL = nil;

    if ([self soundCache] == nil) {
        [self setSoundCache:[NSMutableDictionary dictionaryWithCapacity:1]];
    } else {
        audioFile = [[self soundCache] objectForKey:mediaId];
    }
    if (audioFile == nil) {
        // validate resourcePath and create
        if ((resourcePath == nil) || ![resourcePath isKindOfClass:[NSString class]] || [resourcePath isEqualToString:@""]) {
            bError = YES;
            errMsg = @"invalid media src argument";
        } else {
            audioFile = [[CDVAudioFile alloc] init];
            audioFile.resourcePath = resourcePath;
            audioFile.resourceURL = nil;  // validate resourceURL when actually play or record
            [[self soundCache] setObject:audioFile forKey:mediaId];
        }
    }
    if (bValidate && (audioFile.resourceURL == nil)) {
        if (bRecord) {
            resourceURL = [self urlForRecording:resourcePath];
        }
        if ((resourceURL == nil) && !bSuppress) {
            bError = YES;
            errMsg = [NSString stringWithFormat:@"Cannot use audio file from resource '%@'", resourcePath];
        } else {
            audioFile.resourceURL = resourceURL;
        }
    }

    if (bError) {
        CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errMsg];
        [self.commandDelegate sendPluginResult:commandResult callbackId:self.command.callbackId];
    }

    return audioFile;
}

// Creates or gets the cached audio file resource object
- (CDVAudioFile*)audioFileForResource:(NSString*)resourcePath withId:(NSString*)mediaId doValidation:(BOOL)bValidate forRecording:(BOOL)bRecord
{
    return [self audioFileForResource:resourcePath withId:mediaId doValidation:bValidate forRecording:bRecord suppressValidationErrors:NO];
}

// returns whether or not audioSession is available - creates it if necessary
- (BOOL)hasAudioSession
{
    BOOL bSession = YES;

    if (!self.avSession) {
        NSError* error = nil;

        self.avSession = [AVAudioSession sharedInstance];
        if (error) {
            // is not fatal if can't get AVAudioSession , just log the error
            NSLog(@"error creating audio session: %@", [[error userInfo] description]);
            self.avSession = nil;
            bSession = NO;
        }
    }
    return bSession;
}

- (void)release:(CDVInvokedUrlCommand*)command
{
    NSString* mediaId = [command argumentAtIndex:0];
    //NSString* mediaId = self.currMediaId;

    if (mediaId != nil) {
        CDVAudioFile* audioFile = [[self soundCache] objectForKey:mediaId];

        if (audioFile != nil) {
            if (audioFile.recorder && [audioFile.recorder isRecording]) {
                [audioFile.recorder stop];
            }
            if (avPlayer != nil) {
                [avPlayer pause];
                avPlayer = nil;
            }
            if (self.avSession) {
                [self.avSession setActive:NO error:nil];
                self.avSession = nil;
            }
            [[self soundCache] removeObjectForKey:mediaId];
            NSLog(@"Media with id %@ released", mediaId);
        }
    }
}


- (void)startRecordingAudio:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = command.callbackId;
    self.command = command;

#pragma unused(callbackId)

    NSString* mediaId = [command argumentAtIndex:0];
    CDVAudioFile* audioFile = [self audioFileForResource:[command argumentAtIndex:1] withId:mediaId doValidation:YES forRecording:YES];
    __block NSString* errorMsg = @"";

    if ((audioFile != nil) && (audioFile.resourceURL != nil)) {

        __weak CDVAudio* weakSelf = self;

        void (^startRecording)(void) = ^{
            NSError* __autoreleasing error = nil;

            if (audioFile.recorder != nil) {
                [audioFile.recorder stop];
                audioFile.recorder = nil;
            }
            // get the audioSession and set the category to allow recording when device is locked or ring/silent switch engaged
            if ([weakSelf hasAudioSession]) {
                if (![weakSelf.avSession.category isEqualToString:AVAudioSessionCategoryPlayAndRecord]) {
                    [weakSelf.avSession setCategory:AVAudioSessionCategoryRecord error:nil];
                }

                if (![weakSelf.avSession setActive:YES error:&error]) {
                    // other audio with higher priority that does not allow mixing could cause this to fail
                    errorMsg = [NSString stringWithFormat:@"Unable to record audio: %@", [error localizedFailureReason]];
                    CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorMsg];
                    [self.commandDelegate sendPluginResult:commandResult callbackId:command.callbackId];
                    return;
                }
            }

            // create a new recorder for each start record
            bool isWav=[[audioFile.resourcePath pathExtension] isEqualToString:@"wav"];
            NSMutableDictionary *audioSettings = [NSMutableDictionary dictionaryWithDictionary:
                                            @{AVSampleRateKey: @(44100),
                                             AVNumberOfChannelsKey: @(1),
                                             }];
            if (isWav)  {
                audioSettings[AVFormatIDKey]=@(kAudioFormatLinearPCM);
                audioSettings[AVLinearPCMBitDepthKey]=@(16);
                audioSettings[AVLinearPCMIsBigEndianKey]=@(false);
                audioSettings[AVLinearPCMIsFloatKey]=@(false);
            } else {
                audioSettings[AVFormatIDKey]=@(kAudioFormatMPEG4AAC);
                audioSettings[AVEncoderAudioQualityKey]=@(AVAudioQualityMedium);
            }
            audioFile.recorder = [[CDVAudioRecorder alloc] initWithURL:audioFile.resourceURL settings:audioSettings error:&error];

            bool recordingSuccess = NO;
            if (error == nil) {
                audioFile.recorder.delegate = weakSelf;
                audioFile.recorder.mediaId = mediaId;
                audioFile.recorder.meteringEnabled = YES;
                recordingSuccess = [audioFile.recorder record];
                if (recordingSuccess) {
                    NSLog(@"Started recording audio sample '%@'", audioFile.resourcePath);
                    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"recording"];
                    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                }
            }

            if ((error != nil) || (recordingSuccess == NO)) {
                if (error != nil) {
                    errorMsg = [NSString stringWithFormat:@"Failed to initialize AVAudioRecorder: %@\n", [error localizedFailureReason]];
                } else {
                    errorMsg = @"Failed to start recording using AVAudioRecorder";
                }
                audioFile.recorder = nil;
                if (weakSelf.avSession) {
                    [weakSelf.avSession setActive:NO error:nil];
                }
                CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorMsg];
                [self.commandDelegate sendPluginResult:commandResult callbackId:command.callbackId];
            }
        };

        SEL rrpSel = NSSelectorFromString(@"requestRecordPermission:");
        if ([self hasAudioSession] && [self.avSession respondsToSelector:rrpSel])
        {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
            [self.avSession performSelector:rrpSel withObject:^(BOOL granted){
                if (granted) {
                    startRecording();
                } else {
                    NSString* msg = @"Error creating audio session, microphone permission denied.";
                    NSLog(@"%@", msg);
                    audioFile.recorder = nil;
                    if (weakSelf.avSession) {
                        [weakSelf.avSession setActive:NO error:nil];
                    }
                    CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:msg];
                    [self.commandDelegate sendPluginResult:commandResult callbackId:command.callbackId];
                }
            }];
#pragma clang diagnostic pop
        } else {
            startRecording();
        }

    } else {
        // file did not validate
        NSString* errorMsg = [NSString stringWithFormat:@"Could not record audio at '%@'", audioFile.resourcePath];
        CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorMsg];
        [self.commandDelegate sendPluginResult:commandResult callbackId:command.callbackId];

    }
}

- (void)stopRecordingAudio:(CDVInvokedUrlCommand*)command
{
    NSString* mediaId = [command argumentAtIndex:0];
    self.command = command;
    CDVAudioFile* audioFile = [[self soundCache] objectForKey:mediaId];

    if ((audioFile != nil) && (audioFile.recorder != nil)) {
        NSLog(@"Stopped recording audio sample '%@'", audioFile.resourcePath);
        [audioFile.recorder stop];
        // no callback - that will happen in audioRecorderDidFinishRecording
    }
}

- (void)audioRecorderDidFinishRecording:(AVAudioRecorder*)recorder successfully:(BOOL)flag
{
    CDVAudioRecorder* aRecorder = (CDVAudioRecorder*)recorder;
    NSString* mediaId = aRecorder.mediaId;
    CDVAudioFile* audioFile = [[self soundCache] objectForKey:mediaId];
    
    if (audioFile != nil) {
        NSLog(@"Finished recording audio sample '%@'", audioFile.resourcePath);
    }
    if (flag) {
        AVAudioSession* tempSess = [AVAudioSession sharedInstance];
        NSError *setCategoryError = nil;
        flag = [tempSess setCategory:AVAudioSessionCategoryPlayback
                               error:&setCategoryError];
        
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"stopped recording"];
        [self.commandDelegate sendPluginResult:result callbackId:self.command.callbackId];
    } else {
        CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:nil];
        [self.commandDelegate sendPluginResult:commandResult callbackId:self.command.callbackId];
    }
}

- (void)onMemoryWarning
{
    [[self soundCache] removeAllObjects];
    [self setSoundCache:nil];
    [self setAvSession:nil];
    [super onMemoryWarning];
}

- (void)dealloc
{
    [[self soundCache] removeAllObjects];
}

- (void)onReset
{
    for (CDVAudioFile* audioFile in [[self soundCache] allValues]) {
        if (audioFile != nil) {
            if (audioFile.recorder != nil) {
                [audioFile.recorder stop];
            }
        }
    }

    [[self soundCache] removeAllObjects];
}

 - (void)resumeRecordingAudio:(CDVInvokedUrlCommand*)command
  {
     NSString* mediaId = [command argumentAtIndex:0];

     CDVAudioFile* audioFile = [[self soundCache] objectForKey:mediaId];

     if ((audioFile != nil) && (audioFile.recorder != nil)) {
         NSLog(@"Resumed recording audio sample '%@'", audioFile.resourcePath);
         [audioFile.recorder record];
         // no callback - that will happen in audioRecorderDidFinishRecording
         CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"resumed recording"];
         [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
     }

}

 - (void)pauseRecordingAudio:(CDVInvokedUrlCommand*)command
  {
     NSString* mediaId = [command argumentAtIndex:0];

     CDVAudioFile* audioFile = [[self soundCache] objectForKey:mediaId];

     if ((audioFile != nil) && (audioFile.recorder != nil)) {
         NSLog(@"Paused recording audio sample '%@'", audioFile.resourcePath);
         [audioFile.recorder pause];
         // no callback - that will happen in audioRecorderDidFinishRecording
         CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"paused recording"];
         [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
     }
 }

- (void)messageChannel:(CDVInvokedUrlCommand*)command
{
    self.statusCallbackId = command.callbackId;
}


@end

@implementation CDVAudioFile

@synthesize resourcePath;
@synthesize resourceURL;
@synthesize recorder;

@end

@implementation CDVAudioRecorder

@synthesize mediaId;

@end
