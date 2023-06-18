CREATE PROCEDURE [dbo].[CreateUser]
	@Email VARCHAR(255),
    @Password VARCHAR(60),
    @Name NVARCHAR(32)
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        INSERT INTO [User](Email, Password, Name) VALUES(@Email, @Password, @Name)
        SELECT 'OK' AS 'Status'
    END TRY
    BEGIN CATCH
        SELECT ERROR_NUMBER() as 'ErrorCode', ERROR_MESSAGE() as 'ErrorMessage'
    END CATCH
END
GO
