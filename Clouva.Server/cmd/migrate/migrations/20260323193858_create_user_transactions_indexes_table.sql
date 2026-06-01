-- +goose Up
-- +goose StatementBegin
CREATE INDEX IF NOT EXISTS idx_user_transactions_user_uuid ON user_transactions(user_uuid);
CREATE INDEX IF NOT EXISTS idx_user_transactions_transaction_type ON user_transactions(transaction_type);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_user_transactions_user_uuid;
DROP INDEX IF EXISTS idx_user_transactions_transaction_type;
-- +goose StatementEnd
