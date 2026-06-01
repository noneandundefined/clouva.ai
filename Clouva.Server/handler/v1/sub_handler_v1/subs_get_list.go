package sub_handler_v1

import (
	"net/http"

	"clouva.ai.server/pkg/httpx"
	"clouva.ai.server/pkg/httpx/httperr"
)

func (h *Handler) GetSubsHandler_V1(w http.ResponseWriter, r *http.Request) error {
	ctx := r.Context()

	subs, err := h.Store.Subscriptions.Get_Subscriptions(ctx)
	if err != nil {
		return httperr.Db(ctx, err)
	}

	httpx.HttpResponseWithETag(w, r, http.StatusOK, subs)
	return nil
}
