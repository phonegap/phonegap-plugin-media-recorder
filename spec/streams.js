// audio only
var stream1 = {
    id: '8EF37333-A700-4082-AE9A-78211403DD4C',
    audioTracks: [
        {
            id: '7B0A51E2-F6F1-45E0-A743-BDD8A1B7D33D',
            kind: 'audio',
            description: 'AVCaptureDeviceTypeBuiltInMicrophone'
        }
    ],
    videoTracks: [],
    getAudioTracks: function () {
        return stream1.audioTracks;
    },
    getVideoTracks: function () {
        return stream1.videoTracks;
    }
};
// audio + video
var stream2 = {
    id: 'E13D8A74-A1AC-40E3-A3A6-C78262CDC5B7',
    audioTracks: [
        {
            id: '899B406A-B1B7-42EC-AE33-283001D203EF',
            kind: 'audio',
            description: 'AVCaptureDeviceTypeBuiltInMicrophone'
        }
    ],
    videoTracks: [
        {
            id: 'C8F600ED-6C3D-41A7-AAEC-0294A8FBDAD5',
            kind: 'video',
            description: 'rearcamera'
        },
        {
            id: '77F46117-0971-4356-AF12-E3BE64070CC6',
            kind: 'video',
            description: 'frontcamera'
        }
    ],
    getAudioTracks: function () {
        return stream2.audioTracks;
    },
    getVideoTracks: function () {
        return stream2.videoTracks;
    }
};
// video only
var stream3 = {
    id: 'D856DDA8-D3C0-46A7-88B7-ECD8A8DE9A29',
    audioTracks: [],
    videoTracks: [
        {
            id: '67761BF6-F1F1-496D-B8CE-FA0394AEDFDE',
            kind: 'video',
            description: 'rearcamera'
        },
        {
            id: '0E9146B0-CF9B-4CDE-8A0C-5F2C76EBEDD6',
            kind: 'video',
            description: 'frontcamera'
        }
    ],
    getAudioTracks: function () {
        return stream3.audioTracks;
    },
    getVideoTracks: function () {
        return stream3.videoTracks;
    }
};
// none
var stream4 = {
    id: '8F825B0A-7894-46F8-8C3D-F4E4458BE29E',
    audioTracks: [],
    videoTracks: [],
    getAudioTracks: function () {
        return stream4.audioTracks;
    },
    getVideoTracks: function () {
        return stream4.videoTracks;
    }
};

module.exports = {
    audioOnly: stream1,
    audioAndVideo: stream2,
    videoOnly: stream3,
    noStreams: stream4
};
