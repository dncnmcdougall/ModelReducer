const fs = require('fs');
const path = require('path');

var StateValidator = require(path.join(__dirname,'StateValidator.js'));

function StateSerializer()
{
    this.getFilename = function(targetDir, model)
    {
        return path.join(targetDir, model.getPropertyName()+'.json');
    };

    this.serializeState = function(targetDir, model, state)
    {
        var string = JSON.stringify(state, null, 2);
        fs.writeFileSync(this.getFilename(targetDir, model), string);
        console.log('Wrote out '+this.getFilename(targetDir, model));
    };

    this.deserializeState = function(targetDir, model)
    {
        var data = fs.readFileSync(this.getFilename(targetDir, model), {'encoding':'utf8'});
        var stateData = JSON.parse(data);

        var newState;
        if ( model.getIdField() ) {
            newState = StateValidator.validateStateCollection(model, stateData);
        } else {
            newState = StateValidator.validateState(model, stateData);
        }

        return newState;
    };
}

module.exports = new StateSerializer();
