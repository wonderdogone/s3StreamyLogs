
/*jshint node:true */
'use strict';

var S3 = require('aws-sdk');
var uuid = require('node-uuid');
var stream = require('stream');
var util = require('util');
var Uploader = require('s3-streaming-upload').Uploader;

var S3Stream = stream.Transform;

function S3Logger(key, secret, bucket, extension, options) {
  this.key = key;
  this.secret = secret;
  this.bucket = bucket;
  this.file_extension = extension;

  if (!(this instanceof S3Logger)) {
    return new S3Logger(key, secret, bucket, extension, options);
  }
  // init S3Stream
  if (!options) options = {};
  options.objectMode = true; //object mode
  S3Stream.call(this, options);
}
util.inherits(S3Logger, S3Stream);

S3Logger.prototype._transform = function (chunk, enc, done) {

  var n = JSON.stringify(chunk),
  upload = null,
  stream = n;

  upload = new Uploader({
    // credentials to access AWS
    accessKey:  this.key,
    secretKey:  this.secret,
    bucket:     this.bucket,
    objectName: Date.now()  + '_' + uuid() + this.file_extension,
    stream:     stream,
    debug:      true
  });

  //file upload -- error if a problem
  upload.send(function (err) {
    if (err) {
      console.error('Upload error' + err);
    }

  });

  var logName = (upload.objectName);
  //send a confirm message to stdout
  this.push('Logged file ' + logName + ' to S3');
  done();
};

module.exports = S3Logger;
