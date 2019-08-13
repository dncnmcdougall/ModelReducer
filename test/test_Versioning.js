/*eslint-env jasmine */

var ModelReducer = process.env.NODE_ENV =='production' ? require('../dist/model-reducer.js') : require('../src/index.js');
var VersioningCreator = ModelReducer.VersioningCreator;

var wrapFunction = function( func, ...args) {
    return function() {
        func(...args);
    };
};

describe('ModelVersioning: A class used in validating to allow different versions of an object.', function() {

    var state;
    var versioningCreator;

    beforeEach(function() {
        versioningCreator = new VersioningCreator();
        state = {
            'Prop1': 1,
            'Prop2': 2
        };
    });

    it('should add a version to the model if none exists, but otherwise leave the model as is.', function() {
        var versioning = versioningCreator.finalise();

        var result = versioning.update(state);
        expect(result.error).toBeNull();
        var newState = result.value;

        expect( state.version ).toBeUndefined();
        expect( newState.version ).toBe(0);

        delete newState.version;

        expect(newState).toEqual( state);
    });

    it('should set the version to the last version number', function() {
        versioningCreator.addVersion(1);
        versioningCreator.addVersion(2);
        var versioning = versioningCreator.finalise();

        var result = versioning.update(state);
        expect(result.error).toBeNull();
        var newState = result.value;

        expect( state.version ).toBeUndefined();
        expect( newState.version ).toBe(2);

        delete newState.version;

        expect(newState).toEqual( state);
    });

    it('lastVersionNumber: gets the largest version in this versioning.', function() {
        expect( versioningCreator.lastVersionNumber() ).toEqual( 0 );
        versioningCreator.addVersion(1);
        expect( versioningCreator.lastVersionNumber() ).toEqual( 1 );
        versioningCreator.addVersion(2);
        expect( versioningCreator.lastVersionNumber() ).toEqual( 2 );
        versioningCreator.finalise();
    });

    it('should throw if used after finalisation.', function() {
        versioningCreator.finalise();

        expect(wrapFunction(versioningCreator.addVersion,1)).toThrow();
    });

    it('should should throw if a version is not an integer', function() {
        expect(wrapFunction(versioningCreator.addVersion,'1.1')).toThrow();
        versioningCreator.finalise();
    });

    it('should handle updates from different base versions', function() {
        var version1 = versioningCreator.addVersion(1);
        version1.add('Add1', 0);
        version1.add('Add1R', 5);
        version1.add('Add1D', 0);
        version1.rename('Prop1R', 'Rename1');
        version1.remove('Prop1D');

        var version2 = versioningCreator.addVersion(2);
        version2.add('Add2', 0);
        version2.rename('Prop2R', 'Rename2');
        version2.rename('Add1R', 'Rename12');
        version2.remove('Prop2D');
        version2.remove('Add1D');
        var versioning = versioningCreator.finalise();

        var state = {
            'Prop1': 1,
            'Prop2': 2,
            'Prop1R': 3,
            'Prop2R': 4,
            'Prop1D': 0,
            'Prop2D': 0
        };

        var state1 = {
            'Prop1': 1,
            'Prop2': 2,
            'Rename1': 3,
            'Prop2R': 4,
            'Prop2D': 0,
            'Add1': 0,
            'Add1R': 5,
            'Add1D': 0,
            'version': 1
        };

        var state2 = {
            'Prop1': 1,
            'Prop2': 2,
            'Rename1': 3,
            'Rename2': 4,
            'Add1': 0,
            'Rename12': 5,
            'Add2': 0,
            'version': 2
        };

        var result = versioning.update(state);
        expect(result.error).toBeNull();
        var newState = result.value;

        expect( newState ).toEqual( state2 );

        result = versioning.update(state1);
        expect(result.error).toBeNull();
        newState = {};
        newState = result.value;

        expect( newState ).toEqual( state2 );

    });

    describe('add: specifies a property to add for a version', function() {

        it('should add the properties named', function() {
            var version1 = versioningCreator.addVersion(1);
            version1.add('V1Prop', 0);
            var version2 = versioningCreator.addVersion(2);
            version2.add('V2Prop', 0);
            var versioning = versioningCreator.finalise();

            var result = versioning.update(state);
            expect(result.error).toBeNull();
            var newState = result.value;

            expect( state.V1Prop ).toBeUndefined();
            expect( newState.V1Prop ).toBe(0);

            expect( state.V2Prop ).toBeUndefined();
            expect( newState.V2Prop ).toBe(0);
        });
        it('should add the property with the given value', function() {
            var version1 = versioningCreator.addVersion(1);
            version1.add('V1Prop', 1);
            var version2 = versioningCreator.addVersion(2);
            version2.add('V2Prop', 2);
            var versioning = versioningCreator.finalise();

            var result = versioning.update(state);
            expect(result.error).toBeNull();
            var newState = result.value;

            expect( state.V1Prop ).toBeUndefined();
            expect( newState.V1Prop ).toBe(1);

            expect( state.V2Prop ).toBeUndefined();
            expect( newState.V2Prop ).toBe(2);
        });
        it('should fail to add the property if it already exists.', function() {
            var version1 = versioningCreator.addVersion(1);
            version1.add('Prop1');
            var versioning = versioningCreator.finalise();

            var result = versioning.update(state);
            expect(result.value).toBeNull();
            expect(result.error).toEqual(
                'Could not add "Prop1" because it already exists, in version 1.');

        });
    });

    describe('rename: specifies a rename for a version', function(){
        it('should rename the properties', function() {
            var version1 = versioningCreator.addVersion(1);
            version1.rename('Prop1', 'PropV1');
            var version2 = versioningCreator.addVersion(2);
            version2.rename('Prop2', 'PropV2');
            var versioning = versioningCreator.finalise();

            var result = versioning.update(state);
            expect(result.error).toBeNull();
            var newState = result.value;

            expect( state.Prop1 ).toBe(1);
            expect( state.PropV1 ).toBeUndefined();
            expect( newState.Prop1 ).toBeUndefined();
            expect( newState.PropV1 ).toBe(1);

            expect( state.Prop2 ).toBe(2);
            expect( state.PropV2 ).toBeUndefined();
            expect( newState.Prop2 ).toBeUndefined();
            expect( newState.PropV2 ).toBe(2);
        });

        it('should chain renames', function() {
            var version1 = versioningCreator.addVersion(1);
            version1.rename('Prop1', 'PropV1');
            var version2 = versioningCreator.addVersion(2);
            version2.rename('PropV1', 'PropV2');
            var versioning = versioningCreator.finalise();

            var result = versioning.update(state);
            expect(result.error).toBeNull();
            var newState = result.value;

            expect( state.Prop1 ).toBe(1);
            expect( state.PropV1 ).toBeUndefined();
            expect( state.PropV2 ).toBeUndefined();

            expect( newState.Prop1 ).toBeUndefined();
            expect( newState.PropV1 ).toBeUndefined();
            expect( newState.PropV2 ).toBe(1);
        });

        it('should fail rename if the property does not exists', function() {
            var version1 = versioningCreator.addVersion(1);
            version1.rename('NonExistentProp', 'PropV1');
            var versioning = versioningCreator.finalise();

            var result = versioning.update(state);
            expect(result.value).toBeNull();
            expect(result.error).toEqual(
                'Expected to find property "NonExistentProp" to rename to "PropV1" in version 1, but did not.');

        });

        it('should fail rename if the property does not exists', function() {
            var version1 = versioningCreator.addVersion(1);
            version1.rename('Prop1', 'PropV1');
            var version2 = versioningCreator.addVersion(2);
            version2.rename('NonExistentProp', 'PropV2');
            var versioning = versioningCreator.finalise();

            var result = versioning.update(state);
            expect(result.value).toBeNull();
            expect(result.error).toEqual(
                'Expected to find property "NonExistentProp" to rename to "PropV2" in version 2, but did not.');

        });

        it('should fail rename if the new name already exists.', function() {
            var version1 = versioningCreator.addVersion(1);
            version1.rename('Prop1', 'Prop2');
            var versioning = versioningCreator.finalise();

            var result = versioning.update(state);
            expect(result.value).toBeNull();
            expect(result.error).toEqual(
                'Could not rename "Prop1" to "Prop2" because it already exists, in version 1.');

        });
    });

    describe('remove: specifies a property to remove at a version', function() {
        it('should rename the properties', function() {
            var version1 = versioningCreator.addVersion(1);
            version1.remove('Prop1');
            var version2 = versioningCreator.addVersion(2);
            version2.remove('Prop2');
            var versioning = versioningCreator.finalise();

            var result = versioning.update(state);
            expect(result.error).toBeNull();
            var newState = result.value;

            expect( state.Prop1 ).toBe(1);
            expect( newState.Prop1 ).toBeUndefined();

            expect( state.Prop2 ).toBe(2);
            expect( newState.Prop2 ).toBeUndefined();
        });

        it('should be able to remove properties added ', function() {
            var version1 = versioningCreator.addVersion(1);
            version1.add('PropV1',0);
            var version2 = versioningCreator.addVersion(2);
            version2.remove('PropV1');
            var versioning = versioningCreator.finalise();

            var result = versioning.update(state);
            expect(result.error).toBeNull();
            var newState = result.value;

            expect( state.PropV1 ).toBeUndefined();
            expect( newState.PropV1 ).toBeUndefined();
        });

        it('should fail renames if the property does not exists', function() {
            var version1 = versioningCreator.addVersion(1);
            version1.remove('NonExistentProp');
            var versioning = versioningCreator.finalise();

            var result = versioning.update(state);
            expect(result.value).toBeNull();
            expect(result.error).toEqual(
                'Expected to find property "NonExistentProp" to remove in version 1, but did not.');

        });

        it('should fail renames if the property does not exists', function() {
            versioningCreator.addVersion(1);
            var version2 = versioningCreator.addVersion(2);
            version2.remove('NonExistentProp');
            var versioning = versioningCreator.finalise();

            var result = versioning.update(state);
            expect(result.value).toBeNull();
            expect(result.error).toEqual(
                'Expected to find property "NonExistentProp" to remove in version 2, but did not.');

        });
    });
});

