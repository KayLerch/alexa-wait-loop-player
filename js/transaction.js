'use strict';

var Alexa = require('alexa-sdk');
var constants = require('./constants');
const uuidv5 = require('uuid/v5');

module.exports = {
    // define the max number of cycles users can wait for completion of this transaction
    // two loop cycles equal the time it takes to play back the wait-loop-music + please-hold-on-speech audio
    // 5 loop cycles = 3x music (it starts with music) and 2x please hold on speech
    // if this limit exceeds without isComplete return true cancel-method is called and wait-loop is exited
    maxLoopCyclesToComplete : 5,

    'start' : function (handler) { 
        // 1) generate a transaction-id. of course you can get a transaction-id from your backend and use it as a return
        var transactionId = uuidv5.DNS;
        // 2) create a record with transaction-id as a key and some value indicating the progress
        handler.attributes[transactionId] = 0;
        // 3) at this point you should kick off a process in your backend that is updating the progress-value constantly
        // ...
        // return the transaction-id
        return transactionId;
    },
    'cancel' : function (handler, transactionId) {
        // do whatever it takes to cancel the request in your backend
        handler.attributes[transactionId] = 0;
        // optionally, return a cancellation message that is returned as outputspeech to the user
        return 'your transaction has been cancelled';
    },
    'isComplete' : function (handler, transactionId) {
        // read out progress from dynamo. you could also reach out to your backend but should be really fast
        // best practice is to decouple your skill from your backend and let it propagate progess state to dynamo instead
        var progress = (handler.attributes[transactionId] || 0);
        // we are just simulating progress here
        handler.attributes[transactionId] = progress + 25;
        // return true or false depending on the propagated transaction state
        return handler.attributes[transactionId] >= 100;
    }
}