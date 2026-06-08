package models

import "time"

type UserCore struct {
	ID             uint64    `json:"id" db:"id"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time `json:"updated_at" db:"updated_at"`
	UserUUID       string    `json:"user_uuid" db:"user_uuid"`
	Email          string    `json:"email" db:"email"`
	EmailConfirmed bool      `json:"email_confirmed" db:"email_confirmed"`
	FirstName      *string   `json:"first_name" db:"first_name"`
	LastName       *string   `json:"last_name" db:"last_name"`
	Password       string    `json:"password" db:"password"`
}

type UserSubscription struct {
	ID          uint64     `json:"id" db:"id"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
	UserUUID    string     `json:"user_uuid" db:"user_uuid"`
	PlanName    string     `json:"plan_name" db:"plan_name"`
	TokensLimit int        `json:"tokens_limit" db:"tokens_limit"`
	ValidFrom   time.Time  `json:"valid_from" db:"valid_from"`
	ValidTo     *time.Time `json:"valid_to,omitempty" db:"valid_to"`
	IsActive    bool       `json:"is_active" db:"is_active"`

	AutoRenewEnabled        bool       `json:"auto_renew_enabled" db:"auto_renew_enabled"`
	YookassaPaymentMethodID *string    `json:"yookassa_payment_method_id,omitempty" db:"yookassa_payment_method_id"`
	PaymentMethodType       *string    `json:"payment_method_type,omitempty" db:"payment_method_type"`
	PaymentMethodTitle      *string    `json:"payment_method_title,omitempty" db:"payment_method_title"`
	PaymentMethodSavedAt    *time.Time `json:"payment_method_saved_at,omitempty" db:"payment_method_saved_at"`
}

type UserTransaction struct {
	ID              uint64    `json:"id" db:"id"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time `json:"updated_at" db:"updated_at"`
	UserUUID        string    `json:"user_uuid" db:"user_uuid"`
	SubscriptionID  int64     `json:"subscription_id" db:"subscription_id"`
	TransactionType string    `json:"transaction_type" db:"transaction_type"`
	Amount          float64   `json:"amount" db:"amount"`
	Currency        string    `json:"currency" db:"currency"`
	Description     *string   `json:"description,omitempty" db:"description"`
}

type UserUsage struct {
	ID         uint64    `json:"id" db:"id"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" db:"updated_at"`
	UserUUID   string    `json:"user_uuid" db:"user_uuid"`
	ModelName  string    `json:"model_name" db:"model_name"`
	TokensUsed int       `json:"tokens_used" db:"tokens_used"`
}

type UserPermissions struct {
	CanChangeEmail   bool `json:"can_change_email" db:"can_change_email"`
	CanDeleteAccount bool `json:"can_delete_account" db:"can_delete_account"`
}

type UserLoginState struct {
	/* User cores */
	ID             uint64    `json:"id" db:"id"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	Email          string    `json:"email" db:"email"`
	EmailConfirmed bool      `json:"email_confirmed" db:"email_confirmed"`
	FirstName      *string   `json:"first_name" db:"first_name"`
	LastName       *string   `json:"last_name" db:"last_name"`

	/* User subscriptions */
	PlanName    string     `json:"plan_name" db:"plan_name"`
	ValidTo     *time.Time `json:"valid_to,omitempty" db:"valid_to"`
	TokensUsed  int        `json:"tokens_used" db:"tokens_used"`
	TokensLimit int        `json:"tokens_limit" db:"tokens_limit"`
	Amount      float64    `json:"amount" db:"amount"`
	Currency    string     `json:"currency" db:"currency"`

	/* User permissions */
	CanChangeEmail   bool `json:"can_change_email" db:"can_change_email"`
	CanDeleteAccount bool `json:"can_delete_account" db:"can_delete_account"`
}
