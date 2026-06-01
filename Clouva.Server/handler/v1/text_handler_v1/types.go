package text_handler_v1

type TextRewritePayload struct {
	Text string `json:"text" validate:"required"`
}
