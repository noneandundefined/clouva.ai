package types

import (
	"time"

	"clouva.ai.server/infra/store/postgres/models"
)

type Session struct {
	CreatedAt time.Time `json:"created_at"`
	UserUuid  string    `json:"user_uuid"`
	Platform  string    `json:"platform"`
	DeviceId  string    `json:"device_id,omitempty"`
}

type DeviceAuthSession struct {
	CreatedAt time.Time `json:"created_at"`
	DeviceId  string    `json:"device_id,omitempty"`
	SessionId string    `json:"session_id,omitempty"`
	Confirmed bool      `json:"confirmed"`
}

type AuthToken struct {
	User             models.UserCore `json:"user"`
	SessionId        string          `json:"session_id"`
	CanChangeEmail   bool            `json:"can_change_email"`
	CanDeleteAccount bool            `json:"can_delete_account"`
}
