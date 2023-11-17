package logger

import (
	log "github.com/sirupsen/logrus"
)

func Info(file string, function string, msg string, uuid string) {
	log.WithFields(log.Fields{
		"UUID":     uuid,
		"File":     file,
		"Function": function,
	}).Info(msg)
}
func Error(file string, function string, msg string, uuid string) {
	log.WithFields(log.Fields{
		"UUID":     uuid,
		"File":     file,
		"Function": function,
	}).Error(msg)
}
func Debug(file string, function string, msg string, uuid string) {
	log.WithFields(log.Fields{
		"UUID":     uuid,
		"File":     file,
		"Function": function,
	}).Debug(msg)
}
func Warning(file string, function string, msg string, uuid string) {
	log.WithFields(log.Fields{
		"UUID":     uuid,
		"File":     file,
		"Function": function,
	}).Warning(msg)
}
