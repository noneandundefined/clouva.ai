package main

import (
	"context"
)

func (s *httpServer) startPaymentClearPending() {
	s.cron.AddFunc("@every 5m", func() {
		_ = s.store.Payments.Delete_PaymentWithStatusPending(context.Background())
	})
}

func (s *httpServer) startUsersSubscriptionResetExpired() {
	s.cron.AddFunc("0 55 23 * * *", func() {
		_ = s.store.Users.Update_UserSubscriptionResetExpired(context.Background())
	})
}

func (s *httpServer) startUsersUsageResetTokens() {
	s.cron.AddFunc("0 0 * * *", func() {
		_ = s.store.Users.Update_UserUsageResetTokens(context.Background())
	})
}
