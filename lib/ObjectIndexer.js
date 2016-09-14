
module.exports =  function(initialObject)
{
    this.length = 0;

    this.get = (index) => {
        if( this._object )
        {
            return this._object[this._keyList[index]];
        }
        else
        {
            return undefined;
        }
    };

    this.getClone = (index) => {
        if (this._object) {
            var retValue = this._object[this._keyList[index]];
            if ( typeof retValue === 'object' ) {
                return Object.assign({}, retValue);
            } else {
                return retValue;
            }
        } else {
            return undefined;
        }
    };

    this.setSorter = (sorter) => {
        // The sort function:
        // (objectA, objectB) => number
        this._sorter = sorter;
        this._refresh();
    };

    this.clearSorter = () => {
        this._sorter = null;
        this._refresh();
    };

    this.setFilter = (filter) => {
        // The filter function:
        // (key, value) => bool
        this._filter = filter;
        this._refresh();
    };

    this.clearFilter = () => {
        this._filter = null;
        this._refresh();
    };

    this.update = (object) => {
        this._object = object;
        this._refresh();
    };

    this._object = initialObject;

    this._sorter = null;
    this._filter = null;

    this._keyList = [];

    this._refresh = () => {
        if ( this._object) {
            this._keyList = Object.keys(this._object);
            if ( this._filter ) {
                this._keyList = this._keyList.filter(
                    (key) => {
                        return this._filter(key, this._object[key]); 
                    });
            }
            if ( this._sorter ) {
                this._keyList.sort( 
                    (keyA, keyB) => {
                        return this._sorter(this._object[keyA], this._object[keyB]);
                    });
            }
            this.length = this._keyList.length;
        } else {
            this.length = 0;
        }
    };

    this._refresh();
};

