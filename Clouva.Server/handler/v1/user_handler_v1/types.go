package user_handler_v1

type UserSessionResponse struct {
	SessionId string `json:"session_id"`
	Platform  string `json:"platform"`
	DeviceId  string `json:"device_id,omitempty"`
	CreatedAt string `json:"created_at"`
	Current   bool   `json:"current"`
}

type UserSessionDisconnectPayload struct {
	SessionId string `json:"session_id" validate:"required,min=5"`
}

type UserProfileUpdatePayload struct {
	FirstName *string `json:"first_name" validate:"omitempty,min=3,max=45"`
	LastName  *string `json:"last_name" validate:"omitempty,min=3,max=45"`
}

type UserEmailChangePayload struct {
	Email string `json:"email" validate:"required,email"`
}
