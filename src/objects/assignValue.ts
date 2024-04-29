/**
 * Assign a value to the string based property.
 * @param obj Object that contains the property to assign.
 * @param name Name of property. Can contain dot notation and array notation (or a combination of them).
 * @param value Value to assign once the function have walked to the correct property.
 * @param valueAssigner 
 */
export function assignValue(obj: unknown, name: string, value: unknown, valueAssigner?: (obj: unknown, value: unknown, arrayIndex?: number) => void): void {
    if (value === undefined || value == null){
        throw new Error("Value is not specified for " + name);
    }
    if (obj === null || obj === undefined){
        throw new Error("Object is not specified for " + name);
    }

    let parent = obj;
    let current = obj;
    let lastKey = '';
    let assigned = false;

    const nameParts = name.split('.');
    nameParts.forEach((key, partIndex) => {

        // Not an rray item
        if (key.charAt(key.length - 1) != ']') {
            lastKey = key;
            if (!Object.prototype.hasOwnProperty.call(current, key)) {
                current[key] = {};
            }

            parent = current;
            console.log('assigning current ' + key, current[key]);
            current = current[key];
            return;
        }

        const startBracketPos = key.indexOf('[');
        let arrayIndex = -1;

        // Got an index specified.
        if (startBracketPos < key.length - 2) {
            const indexStr = key.substring(startBracketPos + 1, key.length - 1);
            arrayIndex = +indexStr;
        }

        // Remove []
        key = key.substring(0, startBracketPos);

        // Create array if items havent been appended before.
        if (!Object.prototype.hasOwnProperty.call(current, key)){
            current[key] = [];
        }

        if (arrayIndex == -1) {
            arrayIndex = current[key].length;
        }

        if (!current[key][arrayIndex]) {

            // final part, assign it directly.
            if (partIndex == nameParts.length - 1) {
                if (valueAssigner) {
                    valueAssigner(current[key], parseValue(value), arrayIndex);
                } else {
                    current[key][arrayIndex] = parseValue(value);
                }

                assigned = true;
            } else {
                current[key][arrayIndex] = {};
            }

        }

        lastKey = key;
        console.log('assigning current ' + key, current[key]);
        parent = current[key]; // the array
        current = current[key][arrayIndex]; // array element

    
    });


    if (!assigned) {
        // we stopped at an object like "value" or "someObject[].item"
        if (valueAssigner) {
            valueAssigner(parent[lastKey], parseValue(value));
        } else {

            //console.log('obj length', Object.keys(parent[lastKey]));

            if (Object.keys(parent[lastKey]).length === 0) {
                parent[lastKey] = parseValue(value);

            } else if (Array.isArray(parent[lastKey])) {
                parent[lastKey].push(parseValue(value));
            } else {
                const old = parent[lastKey];
                parent[lastKey] = [old];
                parent[lastKey].push(parseValue(value));
            }

        }

    }

}

function parseValue(value: unknown): unknown {
    console.log('parsing value', value, typeof value);
    if (!value){
        throw new Error("not specified");
    }

    if (!isNaN(<number>value)) {
        return +value;
    } else if (typeof value === "string" && value.toLowerCase() == 'true') {
        return true;
    } else if (typeof value === "string" && value.toLowerCase() == 'false') {
        return false;
    }

    return value;
}