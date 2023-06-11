CREATE TABLE [dbo].[User] (
	[ID] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT(newid()),
	[Name] NVARCHAR(32) NOT NULL,
	[Password] VARCHAR(60) NOT NULL,
	[Email] VARCHAR(255) NOT NULL,
)