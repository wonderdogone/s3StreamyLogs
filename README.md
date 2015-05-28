# s3StreamyLogs
s3logger provided a streaming interface to your AWS S3 buckets.

## Simply provide your AWS credentials, bucket name, and file extension.Something like
```
var s3logger = new S3Logger(<AccessKey>, <SecretKey>, 'this-great-bucket', '.json');

```
then when your ready to log a file to simply write to the stream like
```
s3logger.write(myMessage);

```

## Use Cases:
### Pub/Sub logs.
Example using Redis Pub/Sub.
```
var client1 = redis.createClient(6379, '127.0.0.1');

client1.on("ready", function () {
  client1.subscribe("a nice channel", "another one");
});

client1.on("message", function (channel, message) {
  s3logger.write(message);
  s3logger.end();
});

```
or
with an HTTP request logger like Morgan
```
app.use(morgan('combined', {stream: s3logger}));

```

## currently the logged files will be named as date_uniqueid.<yourextension>



