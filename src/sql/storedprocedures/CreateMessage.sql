CREATE PROCEDURE [dbo].[CreateMessage]
	@UserId UNIQUEIDENTIFIER,
	@RoomId UNIQUEIDENTIFIER,
    @Text NVARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @ID UNIQUEIDENTIFIER = newid()
    DECLARE @SentDate DATETIME = CURRENT_TIMESTAMP

	BEGIN TRY
		INSERT INTO [ReactNextChatApp].[dbo].[Message](ID, SentDate, RoomID, UserID, Text) VALUES (@ID, @SentDate, @RoomId, @UserId, @Text)
		SELECT @ID AS 'id', @SentDate AS 'sent', @RoomId AS 'room', @UserId AS 'user', @Text AS 'text' FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
	END TRY
	BEGIN CATCH
		SELECT ERROR_NUMBER() as 'error.code', ERROR_MESSAGE() as 'error.message' FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
	END CATCH
END
GO
