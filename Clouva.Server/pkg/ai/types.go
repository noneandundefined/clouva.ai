package ai

type ChatRequest struct {
	Model    string         `json:"model"`
	Messages []ChatMessage  `json:"messages"`
	Stream   bool           `json:"stream"`
	Options  map[string]any `json:"options,omitempty"`
}

type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatResponse struct {
	Message ChatMessage `json:"message"`
}

type Job struct {
	System   string
	Prompt   string
	Priority bool
	Result   chan string
	Error    chan error
}
