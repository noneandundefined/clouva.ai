package ai

type GenerateRequest struct {
	Model   string         `json:"model"`
	System  string         `json:"system,omitempty"`
	Prompt  string         `json:"prompt"`
	Stream  bool           `json:"stream"`
	Options map[string]any `json:"options,omitempty"`
}

type GenerateResponse struct {
	Response string `json:"response"`
}

type Job struct {
	System   string
	Prompt   string
	Priority bool
	Result   chan string
	Error    chan error
}
