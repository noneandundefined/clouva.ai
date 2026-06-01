package sub_handler_v1

import (
	"net/http"

	"clouva.ai.server/middleware"
	"clouva.ai.server/pkg/httpx"
	"github.com/gorilla/mux"
)

/* Clouva.ai HTTPx V1 */
/* RegisterRoutes: авторизация всех путей */

func (h *Handler) RegisterRoutes(router *mux.Router) {
	subRouter := router.PathPrefix("/subs").Subrouter()

	/* Access: ALL */
	subRouter.Handle("", middleware.PowDDos()(
		httpx.ErrorHandler(h.GetSubsHandler_V1),
	)).Methods(http.MethodGet)
}
