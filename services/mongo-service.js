const { MongoClient } = require('mongodb');
require('dotenv').config();

class MongoService {

    constructor() {
        const connectUri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
        this.mongoClient = new MongoClient(connectUri);
    }

    async insertAttack(attack) {
        try {
            await this.mongoClient.connect();
            const db = this.mongoClient.db(process.env.MONGO_DB);
            const attackCollection = db.collection(process.env.MONGO_ATTACK_COLLECTION);
            const status = await attackCollection.insertOne(attack);
            console.log(status);
        } catch (e) {
            console.log(`MongoService error - insertAttack(): ${e}`);
        } finally {
            await this.mongoClient.close();
        }
    }
}

module.exports = new MongoService();