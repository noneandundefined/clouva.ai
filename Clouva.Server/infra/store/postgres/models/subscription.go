package models

import "time"

type Subscription struct {
	ID               uint64              `json:"id" db:"id"`
	CreatedAt        time.Time           `json:"created_at" db:"created_at"`
	PlanName         string              `json:"plan_name" db:"plan_name"`
	Amount           float64             `json:"amount" db:"amount"`
	Currency         string              `json:"currency" db:"currency"`
	DurationDays     int                 `json:"duration_days" db:"duration_days"`
	TokensUsed       int                 `json:"tokens_used" db:"tokens_used"`
	CanChangeEmail   bool                `json:"can_change_email" db:"can_change_email"`
	CanDeleteAccount bool                `json:"can_delete_account" db:"can_delete_account"`
	Description      map[string]string   `json:"description" db:"description"`
	Features         map[string][]string `json:"features" db:"features"`
}
