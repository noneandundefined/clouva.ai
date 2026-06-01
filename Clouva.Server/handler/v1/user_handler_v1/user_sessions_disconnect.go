package user_handler_v1

import (
	"net/http"

	"clouva.ai.server/infra/logger"
	"clouva.ai.server/infra/store/redis"
	"clouva.ai.server/middleware"
	"clouva.ai.server/pkg/httpx"
	"clouva.ai.server/pkg/httpx/httperr"
	"clouva.ai.server/types"
	"github.com/go-playground/validator"
)

func (h *Handler) UserSessionsDisconnectHandler_V1(w http.ResponseWriter, r *http.Request) error {
	ctx := r.Context()
	tr := middleware.TranslatorFromContext(ctx)
	authToken := ctx.Value("identity").(*types.AuthToken)

	var payload *UserSessionDisconnectPayload

	if err := httpx.HttpParse(r, &payload); err != nil {
		return httperr.BadRequest(err.Error())
	}

	if err := httpx.Validate.Struct(payload); err != nil {
		if _, ok := err.(validator.ValidationErrors); ok {
			return httperr.BadRequest(httpx.ValidateMsg(tr, err))
		}

		return httperr.BadRequest(tr.TErr("error.fields-not-filled"))
	}

	session, err := redis.RedisSessionGet(payload.SessionId)
	if err != nil {
		logger.Error("UserSessionsDisconnectHandler_V1 req={%s}: %s", ctx.Value("XREQID").(string), err.Error())
		return httperr.Db(ctx, err)
	}

	if session == nil || session.UserUuid != authToken.User.UserUUID {
		return httperr.NotFound(tr.TErr("error.device-not-found"))
	}

	if err := redis.RedisSessionDelete(payload.SessionId); err != nil {
		logger.Error("UserSessionsDisconnectHandler_V1 req={%s}: %s", ctx.Value("XREQID").(string), err.Error())
		return httperr.Db(ctx, err)
	}

	httpx.HttpResponseWithETag(w, r, http.StatusOK, tr.T("success.device-disconnected"))
	return nil
}
