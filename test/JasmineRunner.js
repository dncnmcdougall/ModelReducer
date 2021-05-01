/*eslint no-console: off*/

var fs = require('fs'); 
var path = require('path'); 
var Util = require('./Util.js');

var print = function(str) {
    process.stdout.write(str);
};

var colour = function(colour, str) {
    var ansi = {
        green: '\x1B[32m',
        red: '\x1B[31m',
        yellow: '\x1B[33m',
        none: '\x1B[0m'
    };
    process.stdout.write( ansi[colour] + str + ansi.none);
};

let MarkdownWriter  = function() {
    this.outputObject = {};
    this.beginSuite = function(result, stack) {
        let obj = this.outputObject;
        for( let i = 0 ; i < stack.length; i++) {
            if ( obj.hasOwnProperty(stack[i]) !== true ) {
                obj[stack[i]] = {'specs': []};
            }
            obj = obj[stack[i]];
        }
    };
    this.endSuite = function(result) {
        // Do nothing
    };
    this.beginSpec = function(result) {
        // Do nothing
    };
    this.endSpec = function(result, stack) {
        let obj = this.outputObject;
        for( let i = 0 ; i < stack.length; i++) {
            if ( obj.hasOwnProperty(stack[i]) !== true ) {
                obj[stack[i]] = {'specs': []};
            }
            obj = obj[stack[i]];
        }
        obj['specs'].push(result.description);

    };
    this.finalise = function() {
        let output = '';
        try {
            output = this.recurseTree(this.outputObject, '#').join('\n');
        } catch(e) {
            console.error(e);
        }
        return output;
    };
    this.recurseTree = function(obj, prefix) {
        return Object.keys(obj).flatMap( 
            (key) => {
                if ( key === 'specs' ){
                    return obj.specs.map( (spec) => { return '* '+spec; } );
                } else {
                    let heading =  prefix;
                    let index = key.indexOf(':');
                    if ( index >= 0 ) {
                        heading += ' *'+key.slice(0,index)+'*:'+ key.slice(index+1);
                    } else {
                        heading += ' '+key;
                    }
                    let out = [heading];
                    out.push(...this.recurseTree(obj[key],prefix+'#'));
                    return out;
                }
            });
    };
};

var myReporter = {
    startDate: null,
    specStart: null,
    specResults: [],
    results: {},
    stack: [],
    details: false,
    markdown: true,
    outputMarkDown: new MarkdownWriter(),

    jasmineStarted: function(suiteInfo) {
        this.startDate =Date.now();
    },
    suiteStarted: function(result) {
        this.stack.push(result.description);
        if ( this.markdown ) {
            this.outputMarkDown.beginSuite(result, this.stack);
        }
    },
    specStarted: function(result) {
        this.specStart =Date.now();
        if ( this.details ) {
            print('Starting: '+result.description);
        }
    },
    specDone: function(result) {
        var spec = {
            description: result.description,
            duration: (Date.now()-this.specStart),
            status: result.status,
            suite: this.stack.slice(0),
            failedExpectations: result.failedExpectations.splice(0)
        };

        if ( this.markdown ) {
            this.outputMarkDown.endSpec(result, this.stack);
        }

        if(result.status == 'pending') {
            colour('yellow','*');
        }
        else if(result.status == 'passed') {
            colour('green','.');
        }
        else if(result.status == 'failed') {
            colour('red','F');
        }
        else {
            colour('none', '?');
        }
        if ( this.details ) {
            print('\n');
        }

        this.specResults.push(spec);
    },
    suiteDone: function(result) {
        if ( this.stack.length > 0 ) {
            this.stack.pop();
        }
    },
    jasmineDone: function() {
        process.stdout.write('\n');

        this.specResults.forEach( function(spec, index) {
            if( spec.status == 'failed' ) {
                console.log( spec.suite.join(' ')+'\n-> '+spec.description);
                for(var i = 0; i < spec.failedExpectations.length; i++) {
                    colour('red',spec.failedExpectations[i].message);
                    print('\n');
                    console.log(spec.failedExpectations[i].stack);
                    console.log();
                }
            } else if (spec.status == 'pending' ) {
                colour( 'yellow', spec.suite.join(' ')+'\n-> '+spec.description);
                print('\n');
            }
        });

        var N = 5;
        var stats = {
            passed: 0,
            failed: 0,
            pending: 0,
            total: 0,
            totalTime: 0,
            topN: []
        };
        stats = this.specResults.reduce( function(previous, spec) {
            previous[spec.status]++;
            previous['total']++;
            previous['totalTime']+=spec.duration;

            if ( previous.topN.length <N ) {
                previous.topN.push(spec);
            }else if ( previous.topN[N-1].duration<spec.duration) {
                previous.topN.splice(N-1,1,spec);
            }
            previous.topN.sort(function(a, b) {
                return b.duration - a.duration;
            });
            return previous;
        }, stats);

        console.log(N+' Slowest tests:');
        for( var i =0 ; i< stats.topN.length; i++)
        {
            var spec = stats.topN[i];
            console.log((i+1)+': '+spec.suite.join(' '));
            console.log('   '+spec.description);
            console.log('   '+spec.duration+'ms');
        }
        console.log();
        console.log('Finished:');
        colour('red',''+stats.failed);
        print(' failed, ');
        colour('yellow',''+stats.pending);
        print(' pending and ');
        colour('green',''+stats.passed);
        print(' passed of '+(stats.total)+' in '+(Math.round(stats.totalTime/10)/100)+' seconds\n');
        var duration= (Date.now()-this.startDate);
        print('Total running time of '+(Math.round(duration/10)/100)+' seconds\n');

        if ( this.markdown ) {
            fs.writeFileSync('TestOutput.md',this.outputMarkDown.finalise());
        }
    }
};

module.exports.runTests = function(testDir, specFiles, callback) {
    var relativePath = path.relative(process.cwd(), testDir);

    var Jasmine = require('jasmine');
    var jasmine = new Jasmine();
    var jasmineConfig = {
        'spec_dir': relativePath,
        'spec_files': specFiles,
        'random': false,
        'helpers': []
    };

    jasmine.loadConfig(jasmineConfig);
    jasmine.onComplete((passed) => {
        if(passed) {
            console.log('All specs have passed');
        }
        else {
            console.log('At least one spec has failed');
        }
        if ( callback) {
            callback();
        }
    });

    jasmine.addReporter(myReporter);

    jasmine.execute();
};

module.exports.findSpecFiles = function(testDir) {
    return Util.recurseDirectory(testDir, (file) => {
        return path.extname(file) === '.js' && 
            path.basename(file).indexOf('test_') === 0 && 
            file !== __filename;
    });
};


