-- +goose Up
-- +goose StatementBegin
CREATE INDEX IF NOT EXISTS idx_user_cores_email ON user_cores(email);
CREATE INDEX IF NOT EXISTS idx_user_cores_user_uuid ON user_cores(user_uuid);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_user_cores_email;
DROP INDEX IF EXISTS idx_user_cores_user_uuid;
-- +goose StatementEnd
