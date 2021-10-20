module.exports = function(version) {
    if ( version == undefined) {
        return {
            'ParentProperty': 1,
            'NumberProperty': 2,
            'MockChild': {
                'ChildProperty': 3,
                'NumberProperty': 4,
                'MockNestedChild': {
                    'NestedChildProperty': 5
                },
                'MockNestedChild[]': {
                    0: {
                        'id': 0,
                        'NestedChildProperty': 6
                    }
                }
            },
            'MockCollectionChild[]': {
                0: {
                    'id': 0,
                    'CollectionChildProperty': 7,
                    'NumberProperty': 8,
                    'MockNestedChild': {
                        'NestedChildProperty': 9
                    },
                    'MockNestedChild[]': {
                        0: {
                            'id': 0,
                            'NestedChildProperty': 10
                        }
                    }
                }
            }
        };
    }
    if ( version == 0 ) {
        return {
            'version': 0,
            'ParentProperty': 1,
            'NumberProperty': 2,
            'MockChild': {
                'version': 0,
                'ChildProperty': 3,
                'NumberProperty': 4,
                'MockNestedChild': {
                    'version': 0,
                    'NestedChildProperty': 5
                },
                'MockNestedChild[]': {
                    0: {
                        'version': 0,
                        'id': 0,
                        'NestedChildProperty': 6
                    }
                }
            },
            'MockCollectionChild[]': {
                0: {
                    'version': 0,
                    'id': 0,
                    'CollectionChildProperty': 7,
                    'NumberProperty': 8,
                    'MockNestedChild': {
                        'version': 0,
                        'NestedChildProperty': 9
                    },
                    'MockNestedChild[]': {
                        0: {
                            'version': 0,
                            'id': 0,
                            'NestedChildProperty': 10
                        }
                    }
                }
            }
        };
    }
    if ( version == 1 ) {
        return {
            'version': 1,
            'ParentPropertyV1': 1,
            'NumberPropertyV1': 2,
            'MockOtherChild': {
                'version': 0,
                'ChildProperty': 3,
                'NumberProperty': 4,
                'MockNestedChild': {
                    'version': 0,
                    'NestedChildProperty': 5
                },
                'MockNestedChild[]': {
                    0: {
                        'version': 0,
                        'id': 0,
                        'NestedChildProperty': 6
                    }
                }
            },
            'OtherCollectionChild[]': {
                0: {
                    'version': 1,
                    'id': 0,
                    'CollectionChildPropertyV1': 7,
                    'NumberPropertyV1': 8,
                    'MockNestedChild': {
                        'version': 0,
                        'NestedChildProperty': 9
                    },
                    'MockNestedChild[]': {
                        0: {
                            'version': 0,
                            'id': 0,
                            'NestedChildProperty': 10
                        }
                    }
                }
            }
        };
    }
};

