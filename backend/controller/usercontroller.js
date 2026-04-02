const { sql, connectDB } = require("../config/db");

const getUsers = async (req, res) => {
    try {
        const result = await sql.query("SELECT * FROM Users");
        res.json(result.recordset); 
    } 
    catch (err) {
        console.error(err); 
        res.status(500).send(err.message);
    } };

const getExperience = async (req, res) => {
    const { userID } = req.body; 

    const pool = await connectDB();

    const result = await pool
        .request()
        .input("UserID", sql.Int, userID)
        .execute("sp_GetExperience");

    if (result.recordset.length > 0) {
        res.json({ found: true, records: result.recordset });
    } 
    else {
        res.json({ found: false, records: [] });
    }
};

const verifyUser = async (req, res) => {
    const { email, password } = req.body;
    
    const pool = await connectDB();
    const result = await pool
        .request()
        .input("Email", sql.VarChar, email)
        .input("Password", sql.VarChar, password)
        .execute("sp_LoginUser");

    if (result.recordset.length > 0) {
        res.json({ found: true, 
                userID: result.recordset[0].UserID, 
                fullName: result.recordset[0].FullName });
    }
    else {
        res.json({ found: false });
    }
};

const AddExperience = async (req,res) => {
    const { userID , jobTitle , companyName , yearsWorked , currentJob } = req.body;

    const pool = await connectDB();
    await pool
        .request()
        .input("UserID", sql.Int, userID)
        .input("JobTitle", sql.VarChar, jobTitle)
        .input("CompanyName", sql.VarChar, companyName)
        .input("YearsWorked", sql.Int, yearsWorked)
        .input("IsCurrentJob", sql.Bit, currentJob)
        .execute("sp_AddExperience");

    res.json ({ added: true});
};

const deleteExperience = async (req,res) => {
    const { userID , jobTitle } = req.body;

    const pool = await connectDB();
    const result = await pool 
        .request()
        .input("UserID", sql.Int, userID)
        .input("JobTitle", sql.VarChar, jobTitle)
        .execute("sp_DeleteExperience");

    if (result.rowsAffected[0] > 0) {
        res.json({ removed: true });
    } else {
        res.json({ removed: false });
    }
}

const  updateExperience= async(req,res) => {
    const { userID , jobTitle , originalJobTitle , companyName , yearsWorked , currentJob} = req.body;

    const pool = await connectDB();
    const result = await pool 
        .request()
        .input("UserID", sql.Int, userID)
        .input("JobTitle", sql.VarChar, originalJobTitle)
        .input("NewJobTitle", sql.VarChar, jobTitle)
        .input("NewCompanyName", sql.VarChar, companyName)
        .input("NewYearsWorked", sql.Int, yearsWorked)
        .input("NewIsCurrentJob", sql.Bit, currentJob)
        .execute("sp_UpdateExperience");

    if (result.rowsAffected[0] > 0) {
        res.json({ updated: true });
    } else {
        res.json({ updated: false });
    }

};

module.exports = { getUsers , getExperience , verifyUser , AddExperience , deleteExperience, updateExperience};