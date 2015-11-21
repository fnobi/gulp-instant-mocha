var async = require('async');
var gulp = require('gulp');
var gutil = require('gulp-util');
var through = require('through2');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

var TmpTestHtml = require(__dirname + '/lib/TmpTestHtml');

module.exports = function (opts) {
    var buffers = [];

    function transform(file, encoding, cb) {
        buffers.push(file.contents);
        cb();
    }

    function flush(cb) {
        opts.testCode = Buffer.concat(buffers).toString();
        var tmpTestHtml = new TmpTestHtml(opts);

        async.series([function (next) {
            gutil.log(gutil.colors.green('[create html]', tmpTestHtml.dest));
            tmpTestHtml.writeFile(next);
        }, function (next) {
            gutil.log(gutil.colors.green('[run mocha]'));
            gulp.src(tmpTestHtml.dest)
                .pipe(mochaPhantomJS())
                .on('end', next);
        }], cb);
    }

    return through.obj(transform, flush);
};
