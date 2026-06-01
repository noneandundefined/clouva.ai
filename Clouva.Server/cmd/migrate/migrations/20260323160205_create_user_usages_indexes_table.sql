-- +goose Up
-- +goose StatementBegin
CREATE INDEX IF NOT EXISTS idx_user_usages_user_uuid ON user_usages(user_uuid);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_user_usages_user_uuid;
-- +goose StatementEnd
