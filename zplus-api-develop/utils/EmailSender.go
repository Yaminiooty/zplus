package utils

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"net/smtp"
	"os"
	"path/filepath"
	"strings"
)

var (
	host       = ""
	username   = ""
	password   = ""
	portNumber = ""
)

type Sender struct {
	auth smtp.Auth
}

type Message struct {
	To          []string
	CC          []string
	BCC         []string
	Subject     string
	Body        string
	Attachments map[string][]byte
}

func New() *Sender {
	host = os.Getenv("EMAIL_SMTP_HOST")
	username = os.Getenv("EMAIL_FROM")
	password = os.Getenv("EMAIL_FROM_PASSWORD")
	portNumber = os.Getenv("EMAIL_SMTP_PORT")

	auth := smtp.PlainAuth("", username, password, host)
	return &Sender{auth}
}

func (s *Sender) Send(m *Message, contentType string) error {
	return smtp.SendMail(fmt.Sprintf("%s:%s", host, portNumber), s.auth, username, m.To, m.ToBytes(contentType))
}

func NewMessage(s, b string) *Message {
	return &Message{Subject: s, Body: b, Attachments: make(map[string][]byte)}
}

func (m *Message) AttachFile(src string) error {
	b, err := ioutil.ReadFile(src)
	if err != nil {
		return err
	}

	_, fileName := filepath.Split(src)
	m.Attachments[fileName] = b
	return nil
}

func (m *Message) ToBytes(contentType string) []byte {
	buf := bytes.NewBuffer(nil)
	withAttachments := len(m.Attachments) > 0
	buf.WriteString(fmt.Sprintf("Subject: %s\n", m.Subject))
	buf.WriteString(fmt.Sprintf("To: %s\n", strings.Join(m.To, ",")))
	if len(m.CC) > 0 {
		buf.WriteString(fmt.Sprintf("Cc: %s\n", strings.Join(m.CC, ",")))
	}

	if len(m.BCC) > 0 {
		buf.WriteString(fmt.Sprintf("Bcc: %s\n", strings.Join(m.BCC, ",")))
	}

	buf.WriteString("MIME-Version: 1.0\n")
	writer := multipart.NewWriter(buf)
	boundary := writer.Boundary()
	if withAttachments {
		buf.WriteString(fmt.Sprintf("Content-Type: multipart/mixed; boundary=%s\n", boundary))
		buf.WriteString(fmt.Sprintf("--%s\n", boundary))
	} else {
		if contentType != "" {
			buf.WriteString("Content-Type: " + contentType + "; charset=utf-8\n")
		} else {
			buf.WriteString("Content-Type: text/plain; charset=utf-8\n")
		}
	}

	buf.WriteString(m.Body)
	if withAttachments {
		for k, v := range m.Attachments {
			buf.WriteString(fmt.Sprintf("\n\n--%s\n", boundary))
			buf.WriteString(fmt.Sprintf("Content-Type: %s\n", http.DetectContentType(v)))
			buf.WriteString("Content-Transfer-Encoding: base64\n")
			buf.WriteString(fmt.Sprintf("Content-Disposition: attachment; filename=%s\n", k))

			b := make([]byte, base64.StdEncoding.EncodedLen(len(v)))
			base64.StdEncoding.Encode(b, v)
			buf.Write(b)
			buf.WriteString(fmt.Sprintf("\n--%s", boundary))
		}

		buf.WriteString("--")
	}

	return buf.Bytes()
}

func SendEmailWithToolReport(sendToEmailId string, fullFilePath string) error {
	subject := "Z+ Tool execution report"
	body := "Please find the attached result file."
	sender := New()
	m := NewMessage(subject, body)
	m.To = []string{sendToEmailId}
	m.CC = []string{}
	m.BCC = []string{}
	m.AttachFile(fullFilePath + ".html")
	m.AttachFile(fullFilePath + ".pdf")
	output := sender.Send(m, "")
	return output
}

func SendEmail(userName string, sendToEmailId string, resetPasswordToken string) error {
	subject := "Reset Password: Z+ Account"
	body := `Hello %s,
Please use following link to reset your account password.
%s
Note: The above link will expire in next 5 minutes.
Thanks,
Z+ Team`

	resetPasswordLink := os.Getenv("FRONTEND_SERVER_URL") + "/reset-password" + "?token=" + resetPasswordToken
	body = fmt.Sprintf(body, userName, resetPasswordLink)
	sender := New()
	m := NewMessage(subject, body)
	m.To = []string{sendToEmailId}
	m.CC = []string{}
	m.BCC = []string{}
	output := sender.Send(m, "")
	return output
}

func SendEmailWithAccountVerificationCode(userName string, sendToEmailId string, verificationCode int) error {
	smtpHost := os.Getenv("EMAIL_SMTP_HOST")
	smtpPort := os.Getenv("EMAIL_SMTP_PORT")
	smtpUsername := os.Getenv("EMAIL_FROM")
	smtpPassword := os.Getenv("EMAIL_FROM_PASSWORD")

	// Sender and recipient email addresses
	from := os.Getenv("EMAIL_FROM")
	to := sendToEmailId

	// Read HTML content from file
	htmlContent, err := ioutil.ReadFile(os.Getenv("EMAIL_TEMPLATE_PATH"))
	if err != nil {
		return err
	}
	formattedHTML := fmt.Sprintf(string(htmlContent), userName, verificationCode)

	// Compose the email content
	subject := "Account Verification Mail"
	message := "Subject: " + subject + "\r\n" +
		"To: " + to + "\r\n" +
		"From: " + from + "\r\n" +
		"Content-Type: text/html; charset=\"UTF-8\"\r\n" +
		"\r\n" +
		formattedHTML

	// Set up authentication information
	auth := smtp.PlainAuth("", smtpUsername, smtpPassword, smtpHost)

	serverAddr := smtpHost + ":" + smtpPort
	// Connect to the SMTP server
	err = smtp.SendMail(serverAddr, auth, from, []string{to}, []byte(message))
	if err != nil {
		return err
	}
	return nil

}
