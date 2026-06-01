package device_handler_v1

import (
	"net/http"

	"clouva.ai.server/infra/logger"
	"clouva.ai.server/infra/store/redis"
	"clouva.ai.server/middleware"
	"clouva.ai.server/pkg/httpx"
	"clouva.ai.server/pkg/httpx/httperr"
	"github.com/gorilla/mux"
)

func (h *Handler) DeviceStatusConfirmHandler_V1(w http.ResponseWriter, r *http.Request) error {
	ctx := r.Context()
	tr := middleware.TranslatorFromContext(ctx)

	sessionId := mux.Vars(r)["session_id"]
	if sessionId == "" {
		return httperr.NotFound(tr.TErr("session-not-found"))
	}

	deviceAuth, err := redis.RedisDeviceAuthGet(sessionId)
	if err != nil {
		logger.Error("DeviceStatusConfirmHandler_V1 req={%s}: %s", ctx.Value("XREQID").(string), err.Error())
		return httperr.Db(ctx, err)
	}

	if deviceAuth == nil {
		return httperr.NotFound(tr.TErr("session-not-found"))
	}

	httpx.HttpResponseWithETag(w, r, http.StatusOK, deviceAuth)
	return nil
}
