

function verifyRequiredFieldData(requiredFields, data) {
    const verifiedData = {};
    let invalidData = [];
    for (i=0; i<requiredFields.length; i++) {
        const fieldName = `${requiredFields[i]['name']}`;
        switch(requiredFields[i]['type']) {
            case 'string':
                if (
                    typeof(data.payload[fieldName]) === requiredFields[i]['type']
                    && data.payload[fieldName].trim().length >= requiredFields[i]['minLen']
                    && data.payload[fieldName].trim().length <= requiredFields[i]['maxLen']
                ){
                    verifiedData[fieldName] = data.payload[fieldName].trim();
                } else {
                    invalidData.push({
                        'name': fieldName,
                        'value': `${data.payload[requiredFields[i]['name']]}`,
                    });
                }
                break;
            case 'boolean':
                if(
                    typeof(data.payload[fieldName]) === requiredFields[i]['type']
                ){
                    verifiedData[fieldName] = data.payload[fieldName] === true;
                } else {
                    invalidData.push({
                        'name': fieldName,
                        'value': `${data.payload[fieldName]}`,
                    });
                }
                break;
            case 'booleanOfTrue':
                /* for cases where non-true boolean is invalid */
                const dataTypeBoolean = 'boolean';
                if(
                    typeof(data.payload[fieldName]) === dataTypeBoolean
                ){
                    verifiedData[fieldName] = data.payload[fieldName] === true;
                    if (!verifiedData[fieldName]){
                        invalidData.push({
                            'name': fieldName,
                            'value': `${data.payload[fieldName]}`,
                        });
                    }
                } else {
                    invalidData.push({
                        'name': fieldName,
                        'value': `${data.payload[fieldName]}`,
                    });
                }
                break;
            case 'number':
                if(
                    typeof(data.payload[fieldName]) === requiredFields[i]['type']
                ){
                    verifiedData[fieldName] = data.payload[fieldName];
                } else {
                    invalidData.push({
                        'name': fieldName,
                        'value': `${data.payload[requiredFields[i]['name']]}`,
                    });
                }
                break;
            case 'string[]':
                const stringArray = isStringArray(data.payload[fieldName]);
                if(stringArray){
                    verifiedData[fieldName] = data.payload[fieldName];
                } else {
                    invalidData.push({
                        'name': fieldName,
                        'value': `${data.payload[requiredFields[i]['name']]}`,
                    });
                }
                break;
            case 'protocol':
                const dataTypeProtocol = 'string';
                if (
                    typeof(data.payload[fieldName]) === dataTypeProtocol
                    && data.payload[fieldName].trim().length >= requiredFields[i]['minLen']
                    && data.payload[fieldName].trim().length <= requiredFields[i]['maxLen']
                    && ['http', 'https'].indexOf(data.payload[fieldName]) >= 0
                ){
                    verifiedData[fieldName] = data.payload[fieldName].trim();
                } else {
                    invalidData.push({
                        'name': fieldName,
                        'value': `${data.payload[requiredFields[i]['name']]}`,
                    });
                }
                break;
            case 'httpMethod':
                const dataTypeHttpMethod = 'string';
                if (
                    typeof(data.payload[fieldName]) === dataTypeHttpMethod
                    && data.payload[fieldName].trim().length >= requiredFields[i]['minLen']
                    && data.payload[fieldName].trim().length <= requiredFields[i]['maxLen']
                    && requiredFields[i]['methods'].indexOf(data.payload[fieldName].toLowerCase()) >= 0
                ){
                    verifiedData[fieldName] = data.payload[fieldName].trim();
                } else {
                    invalidData.push({
                        'name': fieldName,
                        'value': `${data.payload[requiredFields[i]['name']]}`,
                    });
                }
                break;
            default:
                console.log(
                    `ERROR : verifyRequiredFieldData an unhandled type was sent in ${requiredFields[i]['type']}`
                );
                break;
        }
    }
    if (invalidData.length > 0) {
        return {
            'missingOrInvalidFields': invalidData,
            ...verifiedData,
        };
    } else {
        return verifiedData;
    }
}

module.exports = {
    verifyRequiredFieldData,
}