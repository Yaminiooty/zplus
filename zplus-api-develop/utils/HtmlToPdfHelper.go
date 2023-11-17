package utils

import (
	"os/exec"
)

func Convert_HTML_TO_PDF(htmlFilePath string, pdfFilePath string) (string, error) {
	cmd := exec.Command("wkhtmltopdf", htmlFilePath, pdfFilePath)
	err := cmd.Run()
	if err != nil {
		return "Failed to convert html to pdf", err
	}
	return "PDF file created successfully.", nil
}
