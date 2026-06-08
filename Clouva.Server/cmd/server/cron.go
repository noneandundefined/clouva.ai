package main

import (
	"context"
)

func (s *httpServer) startPaymentClearPending() {
	s.cron.AddFunc("@every 5m", func() {
		_ = s.store.Payments.Delete_PaymentWithStatusPending(context.Background())
	})
}
