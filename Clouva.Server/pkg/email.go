package pkg

import (
	"fmt"
	"os"
	"strconv"

	"clouva.ai.server/infra/locale"
	"clouva.ai.server/infra/logger"

	"gopkg.in/gomail.v2"
)

/* Отправка email письма на почту */
func SendEmail(to, title, content string, tr locale.Translator) error {
	go_env := os.Getenv("GO_ENV") == "DEV"

	mail := gomail.NewMessage()
	mail.SetHeader("From", os.Getenv("SMTP_EMAIL"))
	mail.SetHeader("To", to)
	mail.SetHeader("Subject", title)
	mail.SetBody("text/html", content)

	port, _ := strconv.Atoi(os.Getenv("SMTP_PORT"))

	d := gomail.NewDialer(os.Getenv("SMTP_ADDR"), port, os.Getenv("SMTP_EMAIL"), os.Getenv("SMTP_PASSWORD"))

	if go_env {
		d.SSL = false
	} else {
		d.SSL = true
	}

	if err := d.DialAndSend(mail); err != nil {
		return fmt.Errorf("%s: %v", tr.TErr("error.email-send-failed"), err)
	}

	logger.Info("SendEmail email={%s}: Email has been sent!", to)
	return nil
}
