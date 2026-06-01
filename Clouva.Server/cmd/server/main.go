package main

import (
	"database/sql"
	"os"

	"clouva.ai.server/infra/constants"
	"clouva.ai.server/infra/locale"
	"clouva.ai.server/infra/logger"
	"clouva.ai.server/infra/store/postgres"
	"clouva.ai.server/infra/store/postgres/store"
	"clouva.ai.server/infra/store/redis"
	"clouva.ai.server/pkg/ai"
	"github.com/joho/godotenv"
	"github.com/pkoukk/tiktoken-go"
	"github.com/robfig/cron/v3"
)

type httpServer struct {
	db      *sql.DB
	cron    *cron.Cron
	aiQueue *ai.AIQueue
	store   store.Storage
	aiEnc   *tiktoken.Tiktoken
}

func main() {
	/* .env - .env.production */
	if err := godotenv.Load(); err != nil {
		panic(err)
	}

	/* Inital logger */
	logger.InitLogger()

	/* Localization en/es/ru */
	locale.InitI18n()

	/* Initial connect db */
	db, err := postgres.New(os.Getenv("DB_ADDR"), 150, 25, "7m")
	if err != nil {
		logger.Error("Failed connect to database: %s", err.Error())
		return
	}
	defer db.Close()

	/* Store for postgres */
	store := store.NewStorage(db)

	/* AI Services initial */
	/* AI Models */
	qwen := ai.NewOllamaClient(os.Getenv("OLLAMA_QWEN_HOST"), os.Getenv("OLLAMA_QWEN_MODEL"), 2)
	phi := ai.NewOllamaClient(os.Getenv("OLLAMA_PHI_HOST"), os.Getenv("OLLAMA_PHI_MODEL"), 4)
	/* AI Queue from models */
	aiQueue := ai.NewAIQueue(constants.AI_MAX_QUEUE_LEN, constants.AI_MAX_NUM_PARALLEL, []*ai.OllamaClient{qwen, phi})

	/* AI Enc Tokens */
	enc, err := tiktoken.GetEncoding("cl100k_base")
	if err != nil {
		logger.AI("TextRewriteHandler_V1: failed to tokenized text: %s", err.Error())
		return
	}

	/* Initial connect redis */
	if err := redis.NewRedisDb(); err != nil {
		logger.Error("Failed connect to redis: %s", err.Error())
		return
	}

	server := &httpServer{
		db:      db,
		store:   store,
		aiQueue: aiQueue,
		aiEnc:   enc,
	}
	server.cron = cron.New()
	server.cron.Start()

	/* Started HTTPx server */
	if err := server.httpStart(); err != nil {
		logger.Error("Failed start TCP server: %s", err.Error())
	}
}
