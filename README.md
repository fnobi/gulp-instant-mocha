gulp-instant-mocha
==============

Create mocha html & run mocha test with Phantom.js.

## install

### from npm

```
npm install gulp-instant-mocha
```

### from github

```
git clone git://github.com/fnobi/gulp-instant-mocha.git
```

## usage in gulp

```
mocha = require 'gulp-instant-mocha'

# test
gulp.task 'test', ->
    gulp.src("#{DEST_JS}/*Test.js")
        .pipe(mocha({
            assertPath: 'node_modules/chai/chai.js'
        }))
```
