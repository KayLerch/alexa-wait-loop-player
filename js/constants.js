"use strict";

module.exports = Object.freeze({
    // enter your skill-id here
    appId : 'amzn1.ask.skill.xxx',
    // enter the name for a Dynamo table that is created on first execution
    dynamoDBTableName : 'io.klerch.alexa.waitloop',
    
    // mp3 with wait-loop music or any sound you like (adjust play length as you want)
    streamUrlHoldOnMusic : 'https://s3.amazonaws.com/xxx/jeopardy.mp3',
    // mp3 with speech asking user to hold on after each cycle holdon-music. Use AWS Polly for your own choice.
    streamUrlHoldOnSpeech : 'https://s3.amazonaws.com/xxx/joanna-holdon.mp3',
    // mp3 with speech telling a user that a transaction has completed. Use AWS Polly for your own choice.
    streamUrlCompletedSpeech : 'https://s3.amazonaws.com/xxx/joanna-completed.mp3',
    // mp3 with speech telling a user that a transaction has been cancelled. Use AWS Polly for your own choice.
    streamUrlCancelledSpeech : 'https://s3.amazonaws.com/xxx/joanna-cancelled.mp3',
    // mp3 with speech telling a user that time exceeded to complete the transaction. Use AWS Polly for your own choice.
    streamUrlExceededSpeech : 'https://s3.amazonaws.com/xxx/joanna-exceeded.mp3',
});
