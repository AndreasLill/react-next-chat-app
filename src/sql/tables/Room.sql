CREATE TABLE [dbo].[Room] (
    [ID] UNIQUEIDENTIFIER PRIMARY KEY NOT NULL,
	[CreatedDate] DATETIME DEFAULT(CURRENT_TIMESTAMP) NOT NULL,
    [Name] NVARCHAR(64) NOT NULL
)