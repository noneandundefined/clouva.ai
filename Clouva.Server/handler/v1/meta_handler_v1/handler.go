package meta_handler_v1

import (
	"clouva.ai.server/handler"
)

type Handler struct {
	*handler.BaseHandler
}

func NewHandler(base *handler.BaseHandler) *Handler {
	return &Handler{BaseHandler: base}
}
