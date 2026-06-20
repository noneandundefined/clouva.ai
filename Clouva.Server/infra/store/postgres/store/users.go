package store

import (
	"context"
	"database/sql"
	"errors"
	"os"
	"strings"
	"time"

	"clouva.ai.server/infra/logger"
	"clouva.ai.server/infra/store/postgres/models"
	"clouva.ai.server/pkg/httpx/httperr"
	"clouva.ai.server/pkg/pgqx"
)

type UserStore struct {
	db *sql.DB
}

func (s *UserStore) Create_UserCore(ctx context.Context, tx *sql.Tx, user *models.UserCore) error {
	query := `
		INSERT INTO user_cores (user_uuid, email, first_name, last_name, password)
		VALUES ($1, $2, $3, $4, $5)
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if _, err := tx.ExecContext(ctx, query, user.UserUUID, user.Email, user.FirstName, user.LastName, user.Password); err != nil {
		if strings.Contains(err.Error(), `user_cores_email_key`) {
			return httperr.Err_DuplicateEmail
		}

		logger.Error("Create_UserCore req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return err
	}

	return nil
}

func (s *UserStore) Create_UserSubscription(ctx context.Context, tx *sql.Tx, userUuid string) error {
	query := `
		INSERT INTO user_subscriptions (user_uuid)
		VALUES ($1)
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if _, err := tx.ExecContext(ctx, query, userUuid); err != nil {
		logger.Error("Create_UserSubscription req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return err
	}

	return nil
}

func (s *UserStore) Create_UserTransaction(ctx context.Context, tx *sql.Tx, user *models.UserTransaction) error {
	query := `
		INSERT INTO user_transactions (user_uuid, subscription_id, amount, currency)
		VALUES ($1, $2, $3, $4)
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if _, err := tx.ExecContext(ctx, query, user.UserUUID, user.SubscriptionID, user.Amount, user.Currency); err != nil {
		logger.Error("Create_UserTransaction req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return err
	}

	return nil
}

func (s *UserStore) Create_UserUsage(ctx context.Context, tx *sql.Tx, user *models.UserUsage) error {
	query := `
		INSERT INTO user_usages (user_uuid, model_name)
		VALUES ($1, $2)
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if _, err := tx.ExecContext(ctx, query, user.UserUUID, os.Getenv("OLLAMA_QWEN_MODEL")); err != nil {
		logger.Error("Create_UserUsage req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return err
	}

	return nil
}

func (s *UserStore) Get_UserCoreByEmail(ctx context.Context, email string) (*models.UserCore, error) {
	query := `
		SELECT * FROM user_cores WHERE email = $1 LIMIT 1
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	user, err := pgqx.QueryRowContext[models.UserCore](ctx, s.db, query, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		logger.Error("Get_UserCoreByEmail req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return nil, err
	}

	return user, nil
}

func (s *UserStore) Get_UserCoreByUserUuid(ctx context.Context, userUuid string) (*models.UserCore, error) {
	query := `
		SELECT * FROM user_cores WHERE user_uuid = $1 LIMIT 1
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	user, err := pgqx.QueryRowContext[models.UserCore](ctx, s.db, query, userUuid)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		logger.Error("Get_UserCoreByEmail req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return nil, err
	}

	return user, nil
}

func (s *UserStore) Get_UserSubscriptionsByUserUuid(ctx context.Context, userUuid string) (*models.UserSubscription, error) {
	query := `
		SELECT
			user_subscriptions.*,
			subscriptions.tokens_used AS tokens_limit
		FROM user_subscriptions
		LEFT JOIN subscriptions ON LOWER(subscriptions.plan_name) = LOWER(user_subscriptions.plan_name)
		WHERE user_uuid = $1
		LIMIT 1
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	user, err := pgqx.QueryRowContext[models.UserSubscription](ctx, s.db, query, userUuid)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		logger.Error("Get_UserSubscriptionsByUserUuid req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return nil, err
	}

	return user, nil
}

func (s *UserStore) Get_UserUsagesByUserUuid(ctx context.Context, userUuid string) (*models.UserUsage, error) {
	query := `
		SELECT * FROM user_usages
		WHERE user_uuid = $1
		LIMIT 1
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	user, err := pgqx.QueryRowContext[models.UserUsage](ctx, s.db, query, userUuid)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		logger.Error("Get_UserUsagesByUserUuid req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return nil, err
	}

	return user, nil
}

func (s *UserStore) Get_UserLoginStateByUserUuid(ctx context.Context, userUuid string) (*models.UserLoginState, error) {
	query := `
		SELECT
			user_cores.id,
			user_cores.created_at,
			user_cores.email,
			user_cores.email_confirmed,
			user_cores.first_name,
			user_cores.last_name,
			user_subscriptions.plan_name,
			user_subscriptions.valid_to,
			COALESCE(subscriptions.can_change_email, FALSE) AS can_change_email,
			COALESCE(subscriptions.can_delete_account, FALSE) AS can_delete_account,
			COALESCE(user_usages.tokens_used, 0) AS tokens_used,
			COALESCE(subscriptions.tokens_used, 0) AS tokens_limit,
			COALESCE(subscriptions.amount, 0) AS amount,
			COALESCE(subscriptions.currency, 'RUB') AS currency
		FROM user_cores
		LEFT JOIN user_subscriptions ON user_subscriptions.user_uuid = user_cores.user_uuid
		LEFT JOIN subscriptions ON LOWER(subscriptions.plan_name) = LOWER(user_subscriptions.plan_name)
		LEFT JOIN user_usages ON user_usages.user_uuid = user_cores.user_uuid
		WHERE user_cores.user_uuid = $1 AND user_subscriptions.is_active = TRUE
		LIMIT 1
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	user, err := pgqx.QueryRowContext[models.UserLoginState](ctx, s.db, query, userUuid)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		logger.Error("Get_UserLoginStateByUserUuid req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return nil, err
	}

	return user, nil
}

func (s *UserStore) Get_UserPermissionsByUserUuid(ctx context.Context, userUuid string) (*models.UserPermissions, error) {
	query := `
		SELECT
			COALESCE(subscriptions.can_change_email, FALSE) AS can_change_email,
			COALESCE(subscriptions.can_delete_account, FALSE) AS can_delete_account
		FROM user_subscriptions
		LEFT JOIN subscriptions ON LOWER(subscriptions.plan_name) = LOWER(user_subscriptions.plan_name)
		WHERE user_subscriptions.user_uuid = $1 AND user_subscriptions.is_active = TRUE
		LIMIT 1
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	permissions, err := pgqx.QueryRowContext[models.UserPermissions](ctx, s.db, query, userUuid)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return &models.UserPermissions{}, nil
		}

		logger.Error("Get_UserPermissionsByUserUuid req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return nil, err
	}

	return permissions, nil
}

func (s *UserStore) Update_UserSubscriptionResetExpired(ctx context.Context) error {
	query := `
		UPDATE user_subscriptions
		SET
			plan_name = 'Free',
			tokens_limit = subscriptions.tokens_used,
			is_active = false,
			updated_at = NOW()
		FROM subscriptions
		WHERE subscriptions.plan_name = 'Free'
			AND user_subscriptions.is_active = true
			AND user_subscriptions.valid_to IS NOT NULL
			AND user_subscriptions.valid_to <= NOW()
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if _, err := s.db.ExecContext(ctx, query); err != nil {
		logger.Error("Update_UserSubscriptionResetExpired req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return err
	}

	return nil
}

func (s *UserStore) Update_UserUsageResetTokens(ctx context.Context) error {
	query := `
		UPDATE user_usages
		SET tokens_used = GREATEST(tokens_used - 240, 0), updated_at = NOW()
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if _, err := s.db.ExecContext(ctx, query); err != nil {
		logger.Error("Update_UserUsageResetTokens req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return err
	}

	return nil
}

func (s *UserStore) Update_UserEmailConfirmedByUid(ctx context.Context, userUuid string, confirmed bool) error {
	query := `
		UPDATE user_cores SET email_confirmed = $1 WHERE user_uuid = $2
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if _, err := s.db.ExecContext(ctx, query, confirmed, userUuid); err != nil {
		logger.Error("Update_UserEmailConfirmedByUid req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return err
	}

	return nil
}

func (s *UserStore) Update_UserProfile(ctx context.Context, userUuid string, firstName, lastName *string) error {
	query := `
		UPDATE user_cores SET first_name = $1, last_name = $2 WHERE user_uuid = $3
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	_, err := s.db.ExecContext(ctx, query, firstName, lastName, userUuid)
	if err != nil {
		logger.Error("Update_UserProfile req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return err
	}

	return nil
}

func (s *UserStore) Update_UserEmail(ctx context.Context, userUuid, email string) error {
	query := `
		UPDATE user_cores
		SET email = $1, email_confirmed = TRUE
		WHERE user_uuid = $2
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if _, err := s.db.ExecContext(ctx, query, email, userUuid); err != nil {
		if strings.Contains(err.Error(), `user_cores_email_key`) {
			return httperr.Err_DuplicateEmail
		}

		logger.Error("Update_UserEmail req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return err
	}

	return nil
}

func (s *UserStore) Delete_UserByUuid(ctx context.Context, userUuid string) error {
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	return WithTx(s.db, ctx, func(tx *sql.Tx) error {
		queries := []struct {
			query string
			args  []any
		}{
			{`DELETE FROM payment_history WHERE user_uuid = $1`, []any{userUuid}},
			{`DELETE FROM user_transactions WHERE user_uuid = $1`, []any{userUuid}},
			{`DELETE FROM user_usages WHERE user_uuid = $1`, []any{userUuid}},
			{`DELETE FROM user_subscriptions WHERE user_uuid = $1`, []any{userUuid}},
			{`DELETE FROM user_cores WHERE user_uuid = $1`, []any{userUuid}},
		}

		for _, q := range queries {
			if _, err := tx.ExecContext(ctx, q.query, q.args...); err != nil {
				logger.Error("Delete_UserByUuid req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
				return err
			}
		}

		return nil
	})
}

func (s *UserStore) Update_UserUsageByUserUuid(ctx context.Context, userUuid string, tokens int) error {
	query := `
		UPDATE user_usages
		SET
			tokens_used = user_usages.tokens_used + $1
		WHERE user_uuid = $2
	`

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if _, err := s.db.ExecContext(ctx, query, tokens, userUuid); err != nil {
		logger.Error("Update_UserUsageByUserUuid req={%s}: Failed to exec sql: %s", ctx.Value("XREQID").(string), err.Error())
		return err
	}

	return nil
}
