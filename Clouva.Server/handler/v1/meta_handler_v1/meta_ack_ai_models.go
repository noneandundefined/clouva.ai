package meta_handler_v1

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"clouva.ai.server/pkg/httpx"
)

func ping(url string) bool {
	client := http.Client{Timeout: 5 * time.Second}

	resp, err := client.Get(url)
	if err != nil {
		return false
	}
	defer resp.Body.Close()

	return resp.StatusCode == http.StatusOK
}

func (h *Handler) GetMetaAckAiModelsHandler_V1(w http.ResponseWriter, r *http.Request) error {
	qwenOK := ping(fmt.Sprintf("%s/api/tags", os.Getenv("OLLAMA_QWEN_HOST")))
	phiOK := ping(fmt.Sprintf("%s/api/tags", os.Getenv("OLLAMA_PHI_HOST")))

	status := 0

	if qwenOK || phiOK {
		status = 1
	}

	if qwenOK && phiOK {
		status = 2
	}

	httpx.HttpResponseWithETag(w, r, http.StatusOK, map[string]int{"status": status})
	return nil
}
