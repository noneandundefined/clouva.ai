package auth_handler_v1

import (
	"net/http"
	"regexp"
	"strings"

	"clouva.ai.server/infra/constants"
	"clouva.ai.server/infra/logger"
	"clouva.ai.server/infra/store/postgres/models"
	"clouva.ai.server/middleware"
	"clouva.ai.server/pkg/httpx"
	"clouva.ai.server/pkg/httpx/httperr"
	"clouva.ai.server/pkg/security"
	"clouva.ai.server/util"
	"github.com/go-playground/validator"
	"github.com/google/uuid"
)

/* Neosync HTTPx V1 */
/* Handler: создание пользователя */

func (h *Handler) AuthSignupHandler_V1(w http.ResponseWriter, r *http.Request) error {
	ctx := r.Context()
	tr := middleware.TranslatorFromContext(ctx)

	var payload *AuthSignupPayload

	if err := httpx.HttpParse(r, &payload); err != nil {
		return httperr.BadRequest(err.Error())
	}

	if err := httpx.Validate.Struct(payload); err != nil {
		if _, ok := err.(validator.ValidationErrors); ok {
			return httperr.BadRequest(httpx.ValidateMsg(tr, err))
		}

		return httperr.BadRequest(tr.TErr("error.fields-not-filled"))
	}

	/* Clear spaces */
	payload.FirstName = strings.TrimSpace(payload.FirstName)
	payload.LastName = strings.TrimSpace(payload.LastName)
	password := strings.TrimSpace(payload.Password)

	valid := regexp.MustCompile(`^[a-zA-Z0-9_]+$`)
	if !valid.MatchString(payload.FirstName) {
		return httperr.BadRequest(tr.TErr("error.invalid-characters-username"))
	}

	if !valid.MatchString(payload.LastName) {
		return httperr.BadRequest(tr.TErr("error.invalid-characters-username"))
	}

	if _, chPass := constants.CheckSimplePasswords[strings.ToLower(password)]; chPass {
		return httperr.BadRequest(tr.TErr("error.simple-password"))
	}

	normalizedEmail := util.NormalizeEmail(payload.Email)
	if security.PasswordEqualsEmail(password, normalizedEmail) {
		return httperr.BadRequest(tr.TErr("error.password-equals-email"))
	}

	tx, err := h.Db.BeginTx(ctx, nil)
	if err != nil {
		logger.Error("AuthSignupHandler_V1 req={%s}: Failed start tx: %s", ctx.Value("XREQID").(string), err.Error())
		return httperr.Db(ctx, httperr.Err_DbNetwork)
	}

	defer func() {
		_ = tx.Rollback()
	}()

	passwordHashed, err := security.HashPassword(payload.Password)
	if err != nil {
		logger.Error("AuthSignupHandler_V1 req={%s}: Failed hash password: %s", ctx.Value("XREQID").(string), err.Error())
		return httperr.InternalServerError(err.Error())
	}

	uuid := uuid.NewString()

	userCore := &models.UserCore{
		UserUUID:  uuid,
		Email:     normalizedEmail,
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
		Password:  passwordHashed,
	}

	if err := h.Store.Users.Create_UserCore(ctx, tx, userCore); err != nil {
		return httperr.Db(ctx, err)
	}

	if err := h.Store.Users.Create_UserSubscription(ctx, tx, uuid); err != nil {
		return httperr.Db(ctx, err)
	}

	userUsage := &models.UserUsage{
		UserUUID: uuid,
	}

	if err := h.Store.Users.Create_UserUsage(ctx, tx, userUsage); err != nil {
		return httperr.Db(ctx, err)
	}

	if err := tx.Commit(); err != nil {
		return httperr.Conflict(tr.TErr("error.failed-to-save-data"))
	}

	/* Send confirm to email */
	if err := h.sendConfirmEmail(ctx, userCore.Email, uuid, ctx.Value("XREQID").(string)); err != nil {
		return err
	}

	httpx.HttpResponseWithETag(w, r, http.StatusCreated, tr.T("confirm-link-send-to-email"))
	return nil
}
