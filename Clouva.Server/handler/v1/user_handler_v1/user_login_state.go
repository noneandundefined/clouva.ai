package user_handler_v1

import (
	"net/http"

	"clouva.ai.server/pkg/httpx"
	"clouva.ai.server/pkg/httpx/httperr"
	"clouva.ai.server/types"
)

func (h *Handler) UserLoginStateHandler_V1(w http.ResponseWriter, r *http.Request) error {
	ctx := r.Context()
	authToken := ctx.Value("identity").(*types.AuthToken)

	user, err := h.Store.Users.Get_UserLoginStateByUserUuid(ctx, authToken.User.UserUUID)
	if err != nil {
		return httperr.Db(ctx, err)
	}

	if user != nil {
		user.CanChangeEmail = authToken.CanChangeEmail
		user.CanDeleteAccount = authToken.CanDeleteAccount
	}

	httpx.HttpResponseWithETag(w, r, http.StatusOK, user)
	return nil
}
