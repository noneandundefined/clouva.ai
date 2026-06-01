package payment_handler_v1

import (
	"clouva.ai.server/handler"
	"clouva.ai.server/infra/logger"
	"clouva.ai.server/pkg/yookassa"
)

type Handler struct {
	*handler.BaseHandler
	Yookassa *yookassa.Client
}

func NewHandler(base *handler.BaseHandler) *Handler {
	client, err := yookassa.NewFromEnv()
	if err != nil {
		logger.Error("YooKassa is not configured: %s", err.Error())
	}

	return &Handler{
		BaseHandler: base,
		Yookassa:    client,
	}
}
