const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";


main()
    .then(() => {
        console.log("connected to DB");
    })   
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongo_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '69b409a68c50c803d4a4cc9a' }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();