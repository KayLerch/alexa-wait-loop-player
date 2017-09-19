'use strict';

var Alexa = require('alexa-sdk');
var constants = require('./constants');
var transaction = require('./transaction');

var stateHandlers = {
    'LaunchRequest' : function () {
        // todo: assign a unique process-id referring to the transaction you'd like to kick off.
        // it is used as the audioplayer-token 
        var transactionId = transaction.start(this);
        var message = 'Please hold on.';
        // initial loop-count is 1 as wait-music starts playing now for the first time
        this.attributes['loopCount'] = 1;
        // play music
        this.response.speak(message).audioPlayerPlay('REPLACE_ALL', constants.streamUrlHoldOnMusic, transactionId, null, 0);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function () {
        var message = 'Welcome to the wait loop simulation. You can use this as a reference to do asynchronous processing in your skill while informing users of progress.';
        this.response.speak(message);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent' : function () {
        this.response.speak('Good bye.');
        this.emit(':responseReady');
    },
    'AMAZON.PauseIntent' : function () {
        // get transaction-id from token
        var transactionId = (this.event.context.AudioPlayer.token || '').replace('SPEECH_', '');
        // cancel transaction
        var cancelMessage = transaction.cancel(this, transactionId);
        // clear audio queue and respond with a message
        this.response.speak(cancelMessage || 'Good bye.').audioPlayerClearQueue('CLEAR_ALL');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function () {
        var message = 'Good bye.';
        this.response.speak(message);
        this.emit(':responseReady');
    },
    'SessionEndedRequest' : function () {
        // No session ended logic
    },
    'Unhandled' : function () {
        var message = 'Sorry, something went wrong.';
        this.response.speak(message);
        this.emit(':responseReady');
    }
};

module.exports = stateHandlers;