console.log("Mongo Auth");
console.log("Mongo Auth");
console.log("Mongo Auth");
console.log("Mongo Auth");
console.log("Mongo Auth");
console.log("Mongo Auth");
console.log("Mongo Auth");
console.log("Mongo Auth");
console.log(process.env.MONGO_USER);
console.log(process.env.MONGO_PWD);
console.log(process.env.MONGO_NAME);
console.log(process.env.MONGO_INITDB_DATABASE);

db.createUser(
    {
        user: process.env.MONGO_USER,
        pwd: process.env.MONGO_PWD,
        roles: [
            {
                role: 'readWrite',
                db: process.env.MONGO_NAME
            }
        ]
    }
);
console.log("Create user");