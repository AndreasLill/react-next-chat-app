CREATE PROCEDURE [dbo].[JoinRoom]
	@UserId UNIQUEIDENTIFIER,
	@RoomId UNIQUEIDENTIFIER
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		INSERT INTO [ReactNextChatApp].[dbo].[RoomJoin](RoomID, UserID, Role) VALUES (@RoomId, @UserId, 100)
		SELECT 'OK' AS 'Status'
	END TRY
	BEGIN CATCH
		SELECT ERROR_NUMBER() as 'ErrorCode', ERROR_MESSAGE() as 'ErrorMessage'
	END CATCH
END
GO
