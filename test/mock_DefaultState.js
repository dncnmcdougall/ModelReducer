module.exports = function() {
    return {
        'ParentProperty': 1,
        'NumberProperty': 2,
        'MockChild': {
            'ChildProperty': 3,
            'NumberProperty': 4,
            'MockNestedChild': {
                'NestedChildProperty': 5
            },
            'MockNestedChildren': {
                0: {
                    'id': 0,
                    'NestedCollectionProperty': 6
                }
            }
        },
        'MockCollectionChildren': {
            0: {
                'id': 0,
                'CollectionChildProperty': 7,
                'NumberProperty': 8,
                'MockNestedChild': {
                    'NestedChildProperty': 9
                },
                'MockNestedChildren': {
                    0: {
                        'id': 0,
                        'NestedCollectionProperty': 10
                    }
                }
            }
        }
    };
};

