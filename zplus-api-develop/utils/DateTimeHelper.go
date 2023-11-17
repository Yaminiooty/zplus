package utils

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetCurrentDateTime() primitive.DateTime {
	return primitive.NewDateTimeFromTime(time.Now())
}
