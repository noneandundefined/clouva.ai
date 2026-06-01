package main

import (
	"clouva.ai.server/handler"

	"clouva.ai.server/handler/v1/auth_handler_v1"
	"clouva.ai.server/handler/v1/device_handler_v1"
	"clouva.ai.server/handler/v1/payment_handler_v1"
	"clouva.ai.server/handler/v1/sub_handler_v1"
	"clouva.ai.server/handler/v1/text_handler_v1"
	"clouva.ai.server/handler/v1/user_handler_v1"

	"net/http"

	"clouva.ai.server/middleware"

	"github.com/gorilla/mux"
)

func (s *httpServer) routes() http.Handler {
	router := mux.NewRouter()

	/* Middleware for logging API request */
	router.Use(middleware.NewLogger().LoggerMiddleware)
	/* Middleware for X-Request-Id */
	router.Use(middleware.XRequestIdMiddleware())
	/* Middleware for i18n language */
	router.Use(middleware.LanguageMiddleware())
	/* Middleware for get exception errors */
	router.Use(middleware.RecoveryMiddleware())
	/* Middleware for security API */
	router.Use(middleware.SecurityMiddleware())
	/* Middleware rate limiter */
	router.Use(middleware.RateLimiterMiddleware(6, 10))

	subrouter := router.PathPrefix("/api/v1").Subrouter()

	baseHandler := &handler.BaseHandler{
		Db:      s.db,
		Store:   s.store,
		AIQueue: s.aiQueue,
		AIEnc:   s.aiEnc,
	}

	/* Authenticate rotues */
	auth_handler_v1.NewHandler(baseHandler).RegisterRoutes(subrouter)
	/* Device rotues */
	device_handler_v1.NewHandler(baseHandler).RegisterRoutes(subrouter)
	/* User rotues */
	user_handler_v1.NewHandler(baseHandler).RegisterRoutes(subrouter)
	/* Text AI rotues */
	text_handler_v1.NewHandler(baseHandler).RegisterRoutes(subrouter)
	/* Subscriptions rotues */
	sub_handler_v1.NewHandler(baseHandler).RegisterRoutes(subrouter)
	/* Payment rotues */
	payment_handler_v1.NewHandler(baseHandler).RegisterRoutes(subrouter)

	/* Doc routes */
	s.docs(subrouter)

	return s.cors(router)
}
