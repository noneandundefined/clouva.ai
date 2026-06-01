-- +goose Up
-- +goose StatementBegin
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_auto_renew
    ON user_subscriptions(auto_renew_enabled)
    WHERE auto_renew_enabled = TRUE;

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_yookassa_payment_method_id
    ON user_subscriptions(yookassa_payment_method_id)
    WHERE yookassa_payment_method_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payment_history_user_uuid ON payment_history(user_uuid);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at DESC);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_user_subscriptions_yookassa_payment_method_id;
DROP INDEX IF EXISTS idx_user_subscriptions_auto_renew;
-- +goose StatementEnd
