package ai

import "strings"

/* Checks if the subscription is premium */
func IsPremiumPlan(planName string) bool {
	return strings.EqualFold(strings.TrimSpace(planName), "Premium")
}
