var async = require('async');
var gulp = require('gulp');
var gutil = require('gulp-util');
var through = require('through2');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

var TmpMochaRunner = require(__dirname + '/lib/TmpMochaRunner');

module.exports = function (opts) {
    var buffers = [];

    function transform(file, encoding, cb) {
        buffers.push(file.contents);
        cb();
    }

    function flush(cb) {
        opts.testCode = Buffer.concat(buffers).toString();
        var tmpMochaRunner = new TmpMochaRunner(opts);

        async.series([function (next) {
            gutil.log(gutil.colors.green('[create html]', tmpMochaRunner.dest));
            tmpMochaRunner.writeFile(next);
        }, function (next) {
            gutil.log(gutil.colors.green('[run mocha]'));
            gulp.src(tmpMochaRunner.dest)
                .pipe(mochaPhantomJS())
                .on('error', next)
                .on('end', next);
        }], function (err) {
            console.log('callback', err);
            cb();
        });
    }

    return through.obj(transform, flush);
};
