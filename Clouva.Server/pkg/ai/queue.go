package ai

import (
	"fmt"
	"os"
	"time"

	"clouva.ai.server/infra/constants"
)

type AIQueue struct {
	premiumJobs chan Job
	freeJobs    chan Job
	clients     []*OllamaClient
}

func NewAIQueue(buffer int, workers int, clients []*OllamaClient) *AIQueue {
	queue := &AIQueue{
		premiumJobs: make(chan Job, buffer),
		freeJobs:    make(chan Job, buffer),
		clients:     clients,
	}

	for i := 0; i < workers; i++ {
		go queue.worker(i)
	}

	return queue
}

func (q *AIQueue) worker(id int) {
	for {
		job := q.dequeue()
		q.processJob(job)
	}
}

func (q *AIQueue) dequeue() Job {
	select {
	case job := <-q.premiumJobs:
		return job
	default:
	}

	select {
	case job := <-q.premiumJobs:
		return job
	case job := <-q.freeJobs:
		return job
	}
}

func (q *AIQueue) processJob(job Job) {
	var client *OllamaClient

	timeout := time.After(constants.AI_PROCCESS_TIMEOUT)
	wait := constants.AI_WAIT_FREE

	if job.Priority {
		wait = constants.AI_WAIT_PREMIUM
	}

	for {
		client = q.pickClient()
		if client != nil {
			break
		}

		select {
		case <-timeout:
			job.Error <- fmt.Errorf("timeout waiting for AI model")
			return
		case <-time.After(wait):
		}
	}

	resp, err := client.Ask(job.System, job.Prompt)
	client.Release()

	if err != nil {
		if fallback := q.pickFallbackClient(client); fallback != nil {
			resp, err = fallback.Ask(job.System, job.Prompt)

			fallback.Release()
		}
	}

	if err != nil {
		job.Error <- err
		return
	}

	job.Result <- resp
}

/* Selects AI model |2 */
func (q *AIQueue) pickClient() *OllamaClient {
	primaryModel := os.Getenv("OLLAMA_QWEN_MODEL")

	for _, client := range q.clients {
		if client.Model == primaryModel && client.TryAcquire() {
			return client
		}
	}

	for _, client := range q.clients {
		if client.Model != primaryModel && client.TryAcquire() {
			return client
		}
	}

	return nil
}

func (q *AIQueue) pickFallbackClient(exclude *OllamaClient) *OllamaClient {
	for _, client := range q.clients {
		if client == exclude {
			continue
		}

		if client.TryAcquire() {
			return client
		}
	}

	return nil
}

func (q *AIQueue) Ask(system, prompt string, priority bool) (string, error) {
	job := Job{
		System:   system,
		Prompt:   prompt,
		Priority: priority,
		Result:   make(chan string, 1),
		Error:    make(chan error, 1),
	}

	target := q.freeJobs
	if priority {
		target = q.premiumJobs
	}

	target <- job

	select {
	case res := <-job.Result:
		return res, nil
	case err := <-job.Error:
		return "", err
	}
}
