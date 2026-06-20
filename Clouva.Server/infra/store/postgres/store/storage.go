package store

import (
	"context"
	"database/sql"
	"time"

	"clouva.ai.server/infra/store/postgres/models"
)

type Storage struct {
	Users interface { //nolint
		Create_UserCore(ctx context.Context, tx *sql.Tx, user *models.UserCore) error
		Create_UserSubscription(ctx context.Context, tx *sql.Tx, userUuid string) error
		Create_UserTransaction(ctx context.Context, tx *sql.Tx, user *models.UserTransaction) error
		Create_UserUsage(ctx context.Context, tx *sql.Tx, user *models.UserUsage) error

		Get_UserCoreByEmail(ctx context.Context, email string) (*models.UserCore, error)
		Get_UserCoreByUserUuid(ctx context.Context, userUuid string) (*models.UserCore, error)
		Get_UserSubscriptionsByUserUuid(ctx context.Context, userUuid string) (*models.UserSubscription, error)
		Get_UserUsagesByUserUuid(ctx context.Context, userUuid string) (*models.UserUsage, error)
		Get_UserLoginStateByUserUuid(ctx context.Context, userUuid string) (*models.UserLoginState, error)
		Get_UserPermissionsByUserUuid(ctx context.Context, userUuid string) (*models.UserPermissions, error)

		Update_UserSubscriptionResetExpired(ctx context.Context) error
		Update_UserUsageResetTokens(ctx context.Context) error
		Update_UserEmailConfirmedByUid(ctx context.Context, userUuid string, confirmed bool) error
		Update_UserProfile(ctx context.Context, userUuid string, firstName, lastName *string) error
		Update_UserEmail(ctx context.Context, userUuid, email string) error
		Update_UserUsageByUserUuid(ctx context.Context, userUuid string, tokens int) error

		Delete_UserByUuid(ctx context.Context, userUuid string) error
	}
	Payments interface { //nolint
		Create_PaymentHistory(ctx context.Context, payment *models.PaymentHistory) (*models.PaymentHistory, error)

		Get_PaymentHistoryListByUserUuid(ctx context.Context, userUuid string, limit int) ([]models.PaymentHistory, error)
		Get_PaymentHistoryByYookassaPaymentID(ctx context.Context, paymentID string) (*models.PaymentHistory, error)
		Get_UserSubscriptionBillingByUserUuid(ctx context.Context, userUuid string) (*models.UserSubscriptionBilling, error)
		Get_PaymentActiveCount(ctx context.Context, userUuid string) (uint32, error)

		Update_PaymentHistoryStatus(ctx context.Context, yookassaPaymentID, status string, paidAt *time.Time) error
		Update_UserSubscriptionAutoRenew(ctx context.Context, userUuid string, enabled bool) error
		Update_YookassaPaymentMethod(ctx context.Context, userUuid, paymentMethodID, paymentMethodType, paymentMethodTitle string) error
		Update_ClearYookassaPaymentMethod(ctx context.Context, userUuid string) error
		Update_ActivateUserSubscriptionPlan(ctx context.Context, userUuid, planName string, durationDays int) error

		Delete_PaymentWithStatusPending(ctx context.Context) error
	}
	Subscriptions interface { //nolint
		Get_Subscriptions(ctx context.Context) ([]models.Subscription, error)
		Get_SubscriptionByPlanName(ctx context.Context, planName string) (*models.Subscription, error)
	}
}

func NewStorage(db *sql.DB) Storage {
	return Storage{
		Users:         &UserStore{db},
		Payments:      &PaymentStore{db},
		Subscriptions: &SubscriptionStore{db},
	}
}

func WithTx(db *sql.DB, ctx context.Context, fn func(*sql.Tx) error) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	if err := fn(tx); err != nil {
		_ = tx.Rollback()
		return err
	}

	return tx.Commit()
}
