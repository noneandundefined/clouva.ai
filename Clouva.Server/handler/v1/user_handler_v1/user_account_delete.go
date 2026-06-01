package user_handler_v1

import (
	"net/http"

	"clouva.ai.server/infra/logger"
	"clouva.ai.server/infra/store/redis"
	"clouva.ai.server/middleware"
	"clouva.ai.server/pkg/httpx"
	"clouva.ai.server/pkg/httpx/httperr"
	"clouva.ai.server/types"
)

func (h *Handler) UserAccountDeleteHandler_V1(w http.ResponseWriter, r *http.Request) error {
	ctx := r.Context()
	tr := middleware.TranslatorFromContext(ctx)
	authToken := ctx.Value("identity").(*types.AuthToken)

	if !authToken.CanDeleteAccount {
		return httperr.Forbidden(tr.TErr("error.premium-required"))
	}

	if err := redis.RedisDeviceSessionsDeleteAll(authToken.User.UserUUID); err != nil {
		logger.Error("UserAccountDeleteHandler_V1 req={%s}: %s", ctx.Value("XREQID").(string), err.Error())
		return httperr.Db(ctx, err)
	}

	if err := h.Store.Users.Delete_UserByUuid(ctx, authToken.User.UserUUID); err != nil {
		return httperr.Db(ctx, err)
	}

	httpx.HttpResponseWithETag(w, r, http.StatusOK, tr.T("success.account-deleted"))
	return nil
}
