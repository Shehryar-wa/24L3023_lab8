USE RozgarDB;
GO

CREATE PROCEDURE sp_UpdateExperience
    @UserID INT,
    @JobTitle VARCHAR(100),
    @NewJobTitle VARCHAR(100),
    @NewCompanyName VARCHAR(100),
    @NewYearsWorked INT,
    @NewIsCurrentJob BIT
AS
BEGIN
    UPDATE Experience
    SET JobTitle = @NewJobTitle,
        CompanyName = @NewCompanyName,
        YearsWorked = @NewYearsWorked,
        IsCurrentJob = @NewIsCurrentJob
    WHERE UserID = @UserID 
      AND JobTitle = @JobTitle;
END

GO 

CREATE PROCEDURE sp_AddExperience
    @UserID INT,
    @JobTitle VARCHAR(100),
    @CompanyName VARCHAR(100),
    @YearsWorked INT,
    @IsCurrentJob BIT
AS
BEGIN
    INSERT INTO Experience (UserID, JobTitle, CompanyName, YearsWorked, IsCurrentJob)
    VALUES (@UserID, @JobTitle, @CompanyName, @YearsWorked, @IsCurrentJob);  -- ✅ added
END

GO
CREATE PROCEDURE sp_DeleteExperience
    @UserID INT,
    @JobTitle VARCHAR(100)
AS
BEGIN
    DELETE FROM Experience
    WHERE UserID = @UserID 
      AND JobTitle = @JobTitle;
END


GO 
CREATE PROCEDURE sp_GetExperience
    @UserID INT
AS
BEGIN
    SELECT ExpID, JobTitle, CompanyName, YearsWorked, IsCurrentJob
    FROM Experience
    WHERE UserID = @UserID;
END


GO
CREATE PROCEDURE sp_LoginUser
    @Email VARCHAR(100),
    @Password VARCHAR(100)
AS
BEGIN
    SELECT UserID, FullName
    FROM Users
    WHERE Email = @Email 
      AND PasswordHash = @Password;
END