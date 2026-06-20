package ai

import (
	"bytes"
	"context"
	"fmt"
	"net/http"
	"strings"
	"sync/atomic"

	"clouva.ai.server/config"
	"clouva.ai.server/infra/constants"
)

type OllamaClient struct {
	Host  string
	Model string

	Busy  int32
	Limit int32

	httpClient *http.Client
}

func NewOllamaClient(host, model string, limit int32) *OllamaClient {
	return &OllamaClient{
		Host:  host,
		Model: model,
		Limit: limit,
		httpClient: &http.Client{
			Timeout: constants.AI_PROCCESS_TIMEOUT,
		},
	}
}

/* Acquire slot */
func (client *OllamaClient) TryAcquire() bool {
	if atomic.LoadInt32(&client.Busy) >= client.Limit {
		return false
	}

	atomic.AddInt32(&client.Busy, 1)
	return true
}

/* Free slot before response */
func (client *OllamaClient) Release() {
	atomic.AddInt32(&client.Busy, -1)
}

/* Base global func for ask AI service */
func (client *OllamaClient) Ask(system, prompt string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), constants.AI_PROCCESS_TIMEOUT)
	defer cancel()

	return client.Generate(ctx, system, prompt)
}

func (client *OllamaClient) Generate(ctx context.Context, system, prompt string) (string, error) {
	body := ChatRequest{
		Model: client.Model,
		Messages: []ChatMessage{
			{Role: "system", Content: system},
			{Role: "user", Content: prompt},
		},
		Stream: false,
		Options: map[string]any{
			"temperature": 0.05,
			"top_p":       0.2,
			"num_predict": 512,
		},
	}

	data, err := config.JSON.Marshal(body)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, client.Host+"/api/chat", bytes.NewBuffer(data))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var result ChatResponse
	if err := config.JSON.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	response := strings.TrimSpace(result.Message.Content)
	if response == "" {
		return "", fmt.Errorf("empty response from AI")
	}

	return response, nil
}
