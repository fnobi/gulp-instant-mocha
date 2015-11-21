var path = require('path');
var fs = require('fs');
var jade = require('jade');

var JADE_PATH = __dirname + '/../jade/runner.jade';

var TmpTestHtml = function (opts) {
    opts = opts || {};

    this.dest = opts.dest || 'test.html';
    this.mochaPath = opts.mochaPath || 'node_modules/mocha/mocha.js';
    this.assertPath = opts.assertPath;
    this.testType = opts.testType || 'bdd';
    this.useCheckLeaks = !!opts.useCheckLeaks;
    this.testCode = opts.testCode || '';
};

TmpTestHtml.prototype.writeFile = function (cb) {
    var dest = this.dest;
    var testCode = this.testCode;

    var mochaPath = path.relative(path.dirname(dest), this.mochaPath);
    var assertPath = this.assertPath
            ? path.relative(path.dirname(dest), this.assertPath)
            : '';
    
    var fn = jade.compile(fs.readFileSync(JADE_PATH));
    
    fs.writeFile(dest, fn({
        testCode: testCode,
        setupCode: 'mocha.setup("' + this.testType + '")',
        mochaPath: mochaPath,
        assertPath: assertPath,
        useCheckLeaks: this.useCheckLeaks
    }), cb);
};

TmpTestHtml.prototype.clean = function (cb) {
    fs.unlink(this.dest, cb);
};

module.exports = TmpTestHtml;
