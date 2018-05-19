var wrapResult = require('./Util.js').wrapResult;

var throwIfFinalised = function( finalised ) {
    if ( finalised ) {
        throw new Error('The versioning was already finalised, cannot modify it further.');
    }
};

function createDefaultVersion() {
    return {
        'additions':[],
        'renames':[],
        'removals':[]
    };
}

function Version(version) {
    this.add = function(name, value) {
        version.additions.push( { 
            'name': name,
            'value': value
        });
    };
    this.rename = function(name, newName) {
        version.renames.push( { 
            'name': name,
            'newName': newName
        });
    };
    this.remove = function(name, value) {
        version.removals.push( { 
            'name': name
        });
    };
}

function VersioningCreator(){
    var finalised = false;
    var versioning = {
        'versions': {}
    };

    this.lastVersionNumber = function() {
        return Object.keys(versioning.versions).reduce( (result, value) => {
            return Math.max(result, Number.parseInt(value, 10));
        }, 0);
    };

    this.addVersion = function(versionNumber) {
        throwIfFinalised(finalised);

        var intVersionNumber = Number.parseInt( versionNumber, 10 );
        if ( versionNumber != intVersionNumber )
        {
            throw new Error('Expected the version number to be an integer');
        } else {
            versionNumber = intVersionNumber;
        }

        if ( ! versioning.versions.hasOwnProperty(versionNumber) ) {
            versioning.versions[versionNumber] = createDefaultVersion();
        }
        return new Version( versioning.versions[versionNumber] );
    };

    versioning.update = function(oldState) {
        let newState = Object.assign({}, oldState );

        if ( !newState.hasOwnProperty('version') ) {
            newState.version = 0;
        }

        let error = null;

        Object.keys(versioning.versions).sort().forEach( (versionNumber) => {
            if ( error != null || ! versioning.versions.hasOwnProperty(versionNumber) ) {
                return;
            }
            if ( versionNumber <= newState.version ) {
                return;
            }
            newState.version = Number.parseInt( versionNumber, 10 );

            let currentVersion = versioning.versions[versionNumber];

            currentVersion.removals.forEach( (removal) => {
                if ( error != null ) {
                    return;
                }
                if ( ! newState.hasOwnProperty( removal.name ) ) {
                    error = 'Expected to find property "'+removal.name+
                        '" to remove in version '+versionNumber+
                        ', but did not.';
                } else {
                    delete newState[removal.name];
                }
            });
            if ( error != null ) {
                return;
            }

            currentVersion.renames.forEach( (rename) => {
                if ( error != null ) {
                    return;
                }
                if ( ! newState.hasOwnProperty( rename.name ) ) {
                    error = 'Expected to find property "'+rename.name+
                        '" to rename to "'+rename.newName+
                        '" in version '+versionNumber+', but did not.';
                } else if ( newState.hasOwnProperty( rename.newName) ) {
                    error = 'Could not rename "'+rename.name+
                        '" to "'+rename.newName+
                        '" because it aleardy exists, in version 1.';
                } else {
                    newState[rename.newName] = newState[rename.name];
                    delete newState[rename.name];
                }
            });
            if ( error != null ) {
                return;
            }
            currentVersion.additions.forEach( (addition) => {
                if ( error != null ) {
                    return;
                }
                if ( newState.hasOwnProperty( addition.name) ) {
                    error = 'Could not add "'+addition.name+
                        '" because it aleardy exists, in version 1.';
                } else {
                    newState[addition.name] = addition.value;
                }
            });
        });

        return wrapResult( error, newState);
    };

    this.finalise= function() {
        throwIfFinalised(finalised);
        finalised = true;

        return versioning;
    };
}

module.exports = VersioningCreator;
