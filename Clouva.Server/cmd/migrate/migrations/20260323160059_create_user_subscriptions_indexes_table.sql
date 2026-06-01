-- +goose Up
-- +goose StatementBegin
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_uuid ON user_subscriptions(user_uuid);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_name ON user_subscriptions(plan_name);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_user_subscriptions_user_uuid;
DROP INDEX IF EXISTS idx_user_subscriptions_plan_name;
-- +goose StatementEnd
