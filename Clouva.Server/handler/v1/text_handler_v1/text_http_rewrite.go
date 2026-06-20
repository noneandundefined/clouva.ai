package text_handler_v1

import (
	"bytes"
	"context"
	"io"
	"net/http"
	"strings"
	"time"

	"clouva.ai.server/infra/constants"
	"clouva.ai.server/middleware"
	"clouva.ai.server/pkg/ai"
	"clouva.ai.server/pkg/httpx"
	"clouva.ai.server/pkg/httpx/httperr"
	"clouva.ai.server/types"
)

func isWav(data []byte) bool {
	return len(data) >= 12 &&
		bytes.Equal(data[0:4], []byte("RIFF")) &&
		bytes.Equal(data[8:12], []byte("WAVE"))
}

func (h *Handler) TextRewriteHttpHandler_V1(w http.ResponseWriter, r *http.Request) error {
	ctx := r.Context()
	tr := middleware.TranslatorFromContext(ctx)
	authToken := ctx.Value("identity").(*types.AuthToken)

	file, _, err := r.FormFile("file")
	if err != nil {
		return httperr.BadRequest(tr.TErr("error.fields-not-filled"))
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		return httperr.BadRequest(tr.TErr("error.fields-not-filled"))
	}

	if isWav(data) {
		return httperr.BadRequest(tr.TErr("error.audio-not-supported"))
	}

	inputText := strings.TrimSpace(string(data))
	if inputText == "" {
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

	userPrompt := constants.BuildRewritePrompt(inputText)
	estimatedTokens := len(h.AIEnc.Encode(constants.AI_SYSTEM_PROMPT, nil, nil)) + len(h.AIEnc.Encode(userPrompt, nil, nil))

	if userUsages.TokensUsed+estimatedTokens >= userSubs.TokensLimit {
		return httperr.Forbidden(tr.TErr("error.limit-token-request"))
	}

	textResult, err := h.AIQueue.Ask(constants.AI_SYSTEM_PROMPT, userPrompt, ai.IsPremiumPlan(userSubs.PlanName))
	if err != nil {
		return httperr.Conflict(tr.TErr("error.ai-error"))
	}

	usedTokens := estimatedTokens + len(h.AIEnc.Encode(textResult, nil, nil))

	go func(userUuid string, tokens int) {
		usageCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		_ = h.Store.Users.Update_UserUsageByUserUuid(usageCtx, userUuid, tokens)
	}(authToken.User.UserUUID, usedTokens)

	httpx.HttpResponseWithETag(w, r, http.StatusOK, textResult)
	return nil
}
