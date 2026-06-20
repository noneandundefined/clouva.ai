package text_handler_v1

import (
	"net/http"

	"clouva.ai.server/middleware"
	"clouva.ai.server/pkg/httpx"

	"github.com/gorilla/mux"
)

/* Clouva.ai HTTPx V1 */
/* RegisterRoutes: авторизация всех путей */

func (h *Handler) RegisterRoutes(router *mux.Router) {
	textRouter := router.PathPrefix("/text").Subrouter()
	textRouter.Use(middleware.IsAuthenticatedMiddleware(h.BaseHandler))

	/* Access: ALL */
	textRouter.Handle("/rewrite", httpx.ErrorHandler(h.TextRewriteHttpHandler_V1)).Methods(http.MethodPost)
}
