-- +goose Up
-- +goose StatementBegin
ALTER TABLE user_subscriptions
    ADD COLUMN IF NOT EXISTS auto_renew_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS yookassa_payment_method_id TEXT,
    ADD COLUMN IF NOT EXISTS payment_method_type TEXT,
    ADD COLUMN IF NOT EXISTS payment_method_title TEXT,
    ADD COLUMN IF NOT EXISTS payment_method_saved_at TIMESTAMPTZ;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE user_subscriptions
    DROP COLUMN IF EXISTS payment_method_saved_at,
    DROP COLUMN IF EXISTS payment_method_title,
    DROP COLUMN IF EXISTS payment_method_type,
    DROP COLUMN IF EXISTS yookassa_payment_method_id,
    DROP COLUMN IF EXISTS auto_renew_enabled;
-- +goose StatementEnd
