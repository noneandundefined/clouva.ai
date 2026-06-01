package handler

import (
	"database/sql"

	"clouva.ai.server/infra/store/postgres/store"
	"clouva.ai.server/pkg/ai"
	"github.com/pkoukk/tiktoken-go"
)

type BaseHandler struct {
	Db      *sql.DB
	Store   store.Storage
	AIQueue *ai.AIQueue
	AIEnc   *tiktoken.Tiktoken
}
