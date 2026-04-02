-- ==========================================
-- LAB 08 SETUP: ROZGAR PAKISTAN
-- E-Resume Builder Database
-- ==========================================

-- 1. DATABASE CREATION
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'RozgarDB')
BEGIN
    CREATE DATABASE RozgarDB;
END
GO

USE RozgarDB;
GO

-- 2. TABLE CREATION

IF OBJECT_ID('Experience', 'U') IS NOT NULL DROP TABLE Experience;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;

-- Users Table (For Login functionality)
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(100) NOT NULL, -- In real apps, passwords MUST be hashed!
    FullName VARCHAR(100) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Experience Table (For CRUD operations on the Resume UI)
CREATE TABLE Experience (
    ExpID INT PRIMARY KEY IDENTITY(100,1),
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    JobTitle VARCHAR(100) NOT NULL,
    CompanyName VARCHAR(100) NOT NULL,
    YearsWorked INT NOT NULL,
    IsCurrentJob BIT DEFAULT 0 -- 1 for Yes, 0 for No
);

-- 3. INSERT DUMMY DATA

-- Insert Sample Users
INSERT INTO Users (Email, PasswordHash, FullName) VALUES
('ali.raza@email.com', 'password123', 'Ali Raza'),
('fatima.khan@email.com', 'securepass', 'Fatima Khan');

-- Insert Sample Work Experience for Ali (UserID = 1)
INSERT INTO Experience (UserID, JobTitle, CompanyName, YearsWorked, IsCurrentJob) VALUES
(1, 'Software Engineering Intern', 'PTCL', 1, 0),
(1, 'Junior Developer', 'Systems Ltd', 2, 0),
(1, 'Senior Software Engineer', 'Netsol Technologies', 3, 1);

-- Insert Sample Work Experience for Fatima (UserID = 2)
INSERT INTO Experience (UserID, JobTitle, CompanyName, YearsWorked, IsCurrentJob) VALUES
(2, 'Marketing Executive', 'Engro Corp', 2, 0),
(2, 'Marketing Manager', 'Jazz Pakistan', 4, 1);

-- Verify Data Setup
SELECT * FROM Users;
SELECT * FROM Experience;
GO