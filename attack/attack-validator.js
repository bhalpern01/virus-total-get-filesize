class AttackValidator {
    constructor() {

        // if this were in typescript, these would be interfaces
        this.attackTopLevelRequiredFieldsAndTypes = { data: "object" };
        this.attackDataRequiredFieldsAndTypes = {
            id: "number",
            attackName: "string",
            modifiedDate: "string",
            malwareFiles: "array"
        };
        this.attackFileRequiredFieldsAndTypes = { md5: "string" }
    }

    /**
     * The main validation method.
     * 
     * @param attack - raw Attack data 
     * @returns boolean
     */
    validateAttack(attack) {
        return this.validateObjectAttributes(attack, this.attackTopLevelRequiredFieldsAndTypes) &&
            this.validateObjectAttributes(attack.data, this.attackDataRequiredFieldsAndTypes) &&
            this.validateObjectArrayAttributes(attack.data.malwareFiles, this.attackFileRequiredFieldsAndTypes);
    }

    /**
     * Check that the required fields in an object are present, and have the correct type
     * Typescript would just use "return typeof Object === <interface>"
     * 
     * @param object 
     * @param interfaceTemplate 
     * @returns boolean 
     */
    validateObjectAttributes(object, interfaceTemplate) {

        // try/catch for debugging
        try {

            // does it have the required attributes, and are they the correct types?
            return Object.keys(interfaceTemplate).every((att) => {
                return object[att] &&
                    this.validateAttributeType(object[att], interfaceTemplate[att]);
            })
        } catch (e) {

            // easy to find a configuration problem
            console.log("Validation error!");
            console.log(`Object: ${JSON.stringify(object)}`);
            console.log(`Expected Attributes: ${JSON.stringify(interfaceTemplate)}`);
            return false;
        }
    }

    /**
     * Check that every object in this array has the same required fields.
     * 
     * @param objectArray - array of the same objects
     * @param interfaceTemplate - an object with the same (required) fields, and their expected types as strings
     * @returns 
     */
    validateObjectArrayAttributes(objectArray, interfaceTemplate) {
        return objectArray.every(object => this.validateObjectAttributes(object, interfaceTemplate))
    }

    /**
     * "typeof <array>" returns "object" so this handles that special case 
     * 
     * @param attribute
     * @param expectedType string
     * @returns 
     */
    validateAttributeType(attribute, expectedType) {
        if (expectedType === "array") {
            return Array.isArray(attribute);
        } else {
            return typeof attribute === expectedType;
        }
    }
}

module.exports = new AttackValidator();