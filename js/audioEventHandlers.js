'use strict';

var Alexa = require('alexa-sdk');
var constants = require('./constants');
var transaction = require('./transaction');

// Binding audio handlers to PLAY_MODE State since they are expected only in this mode.
var audioEventHandlers = {
    'PlaybackStarted' : function () {
        console.log("PlaybackStarted");
        this.response.audioPlayerClearQueue('CLEAR_ENQUEUED');
        // increase loop-count by one
        this.attributes['loopCount'] = (this.attributes['loopCount'] || 0) + 1;
        this.emit(':responseReady');
    },
    'PlaybackFinished' : function () {
        console.log("PlaybackFinished");
        this.emit(':responseReady', true);
    },
    'PlaybackStopped' : function () {
        console.log("PlaybackStopped");
        this.emit(':responseReady');
    },
    'PlaybackNearlyFinished' : function () {
        // if compeleted-speech is playing let it end without enqueuing anything else
        if (this.event.request.token.startsWith("EXIT_")) {
            console.log("PlaybackNearlyFinished follows up with nothing as transaction has been completed.");
            this.response.audioPlayerClearQueue('CLEAR_ENQUEUED');
        }
        else {
            var newToken = '';
            var streamUrl = '';
            var expectedToken = null;
            var directive = 'ENQUEUE';

            // eliminate prefix marker indicating that speech is playing
            var transactionId = this.event.request.token.replace('SPEECH_','');

            // check if transaction is completed
            if (transaction.isComplete(this, transactionId)) {
                // if transaction completed follow up with completed speech
                streamUrl = constants.streamUrlCompletedSpeech;
                newToken = 'EXIT_' + transactionId;
                directive = 'REPLACE_ALL';
                console.log("PlaybackNearlyFinished follows up with completed-speech");
            } 
            else if ((this.attributes['loopCount'] || 0) > transaction.maxLoopCyclesToComplete) {
                streamUrl = constants.streamUrlExceededSpeech;
                newToken = 'EXIT_' + transactionId;
                directive = 'REPLACE_ENQUEUED';
                console.log("PlaybackNearlyFinished follows up with exceeded-speech");
            }
            // transaction is still running. Follow up with music in case speech is playing
            else if (this.event.request.token.startsWith('SPEECH_')) {
                streamUrl = constants.streamUrlHoldOnMusic;
                newToken = transactionId;
                expectedToken = this.event.request.token;
                console.log("PlaybackNearlyFinished follows up with holdon-music");
            } 
            // follow up with holdon-speech in case music is playing
            else {
                streamUrl = constants.streamUrlHoldOnSpeech;
                newToken = 'SPEECH_' + transactionId;
                expectedToken = this.event.request.token;
                console.log("PlaybackNearlyFinished follows up with holdon-speech");
            }
            this.response.audioPlayerPlay(directive, streamUrl, newToken, expectedToken, 0);
        }
        this.emit(':responseReady');
    },
    'PlaybackFailed' : function () {
        console.log("Playback Failed : %j", this.event.request.error);
        this.response.audioPlayerClearQueue('CLEAR_ENQUEUED');
        this.emit(':responseReady');
    }
};

module.exports = audioEventHandlers;