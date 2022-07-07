const input = require('./data/inputs.json');
const AttackValidator = require('./attack/attack-validator');
const VirusTotalFileSizeService = require('./services/virus-total-file-size-service');
const Attack = require('./attack/attack');
const MongoService = require("./services/mongo-service");

require('dotenv').config();

class Main {

    static async run() {

        // validate a single Attack input
        if (!AttackValidator.validateAttack(input)) {
            console.log("ERROR: Bad input. Exiting...");
            return;
        }

        // enrich the Attack object with "size"
        const attack = new Attack(input);
        console.log(`Attack object: ${JSON.stringify(attack)}`);
        const fileSizes = await VirusTotalFileSizeService.getFileSizes(attack.getAttackFiles());
        fileSizes.forEach(fileSize => {
            attack.setFileSize(fileSize.md5, fileSize.size);
        })
        console.log(`Enriched Attack object: ${JSON.stringify(attack.getAttackData())}`);

        // insert into DB
        await MongoService.insertAttack(attack);

        // End program
        console.log('Complete!');
    }
}

Main.run();