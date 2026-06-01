package text_handler_v1

import (
	"context"
	"net/http"
	"strings"
	"time"

	"clouva.ai.server/infra/constants"
	"clouva.ai.server/middleware"
	"clouva.ai.server/pkg/ai"
	"clouva.ai.server/pkg/httpx"
	"clouva.ai.server/pkg/httpx/httperr"
	"clouva.ai.server/types"
	"github.com/go-playground/validator"
)

func (h *Handler) TextRewriteHttpHandler_V1(w http.ResponseWriter, r *http.Request) error {
	ctx := r.Context()
	tr := middleware.TranslatorFromContext(ctx)
	authToken := ctx.Value("identity").(*types.AuthToken)

	var payload *TextRewritePayload

	if err := httpx.HttpParse(r, &payload); err != nil {
		return httperr.BadRequest(err.Error())
	}

	if err := httpx.Validate.Struct(payload); err != nil {
		if _, ok := err.(validator.ValidationErrors); ok {
			return httperr.BadRequest(httpx.ValidateMsg(tr, err))
		}

		return httperr.BadRequest(tr.TErr("error.fields-not-filled"))
	}

	userSubs, err := h.Store.Users.Get_UserSubscriptionsByUserUuid(ctx, authToken.User.UserUUID)
	if err != nil {
		return httperr.Db(ctx, err)
	}

	userUsages, err := h.Store.Users.Get_UserUsagesByUserUuid(ctx, authToken.User.UserUUID)
	if err != nil {
		return httperr.Db(ctx, err)
	}

	if userSubs == nil || userUsages == nil {
		return httperr.Forbidden(tr.TErr("error.limit-token-request"))
	}

	inputText := strings.TrimSpace(payload.Text)
	if inputText == "" {
		return httperr.BadRequest(tr.TErr("error.fields-not-filled"))
	}

	promptTokens := len(h.AIEnc.Encode(inputText, nil, nil))

	if userUsages.TokensUsed >= userSubs.TokensLimit {
		return httperr.Forbidden(tr.TErr("error.limit-token-request"))
	}

	textResult, err := h.AIQueue.Ask(constants.AI_SYSTEM_PROMPT, inputText, ai.IsPremiumPlan(userSubs.PlanName))
	if err != nil {
		return httperr.Conflict(tr.TErr("error.ai-error"))
	}

	go func(userUuid string, tokens int) {
		usageCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		_ = h.Store.Users.Update_UserUsageByUserUuid(usageCtx, userUuid, tokens)
	}(authToken.User.UserUUID, promptTokens)

	httpx.HttpResponseWithETag(w, r, http.StatusOK, textResult)
	return nil
}
