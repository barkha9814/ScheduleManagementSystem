const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongo_host = process.env.MONGOHOST;
        const mongo_port = process.env.MONGOPORT;
        const database_name = process.env.DATABASENAME;

        let mongoString =
            "mongodb://" + mongo_host + ":" + mongo_port + "/" + database_name;
        await mongoose.connect(mongoString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${mongoString}`);
    } catch (err) {
        console.error(err, "Error");
    }
};

module.exports = connectDB;
