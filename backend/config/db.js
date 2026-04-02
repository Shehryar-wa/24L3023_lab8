const sql = require("mssql");

const config = {
    user: "sa",
    password: "123456",
    server: "localhost",
    database: "RozgarDB",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const connectDB = async() => {
    try{
        const pool = await sql.connect(config);

        console.log("Database Jur gai oyeeee!!!");

        return pool;
    }
    catch(err) {
        console.log("DB nhi guri!!!", err);
    }
}

module.exports = {sql , connectDB};