package meta_handler_v1

import (
	"net/http"

	"clouva.ai.server/middleware"
	"clouva.ai.server/pkg/httpx"
	"github.com/gorilla/mux"
)

/* Clouva.ai HTTPx V1 */
/* RegisterRoutes: авторизация всех путей */

func (h *Handler) RegisterRoutes(router *mux.Router) {
	metaRouter := router.PathPrefix("/meta").Subrouter()

	/* Access: ALL */
	metaRouter.Handle("/ack-ai-models", middleware.PowDDos()(
		httpx.ErrorHandler(h.GetMetaAckAiModelsHandler_V1),
	)).Methods(http.MethodGet)
}
