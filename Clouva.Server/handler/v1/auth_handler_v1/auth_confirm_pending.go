package auth_handler_v1

import (
	"net/http"

	"clouva.ai.server/infra/store/redis"
	"clouva.ai.server/pkg/httpx"
	"clouva.ai.server/pkg/httpx/httperr"
	"clouva.ai.server/util"
)

func (h *Handler) AuthConfirmPendingHandler_V1(w http.ResponseWriter, r *http.Request) error {
	ctx := r.Context()

	email := util.NormalizeEmail(r.URL.Query().Get("email"))
	if email == "" {
		return httperr.BadRequest("email is required")
	}

	pending, err := redis.RedisEmailConfirmPendingCheck(email)
	if err != nil {
		return httperr.Redis(ctx, err)
	}

	httpx.HttpResponseWithETag(w, r, http.StatusOK, map[string]bool{"pending": pending})
	return nil
}
