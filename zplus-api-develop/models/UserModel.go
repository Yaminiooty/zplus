package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type UserModel struct {
	Id                        primitive.ObjectID `bson:"_id"`
	Name                      string             `bson:"name"`
	Email                     string             `bson:"email"`
	Password                  string             `bson:"password"`
	Phone                     string             `bson:"phone"`
	TermsAcceptanceStatus     bool               `bson:"termsAcceptanceStatus"`
	AccountVerificationStatus bool               `bson:"accountVerificationStatus"`
	AccountVerificationCode   int                `bson:"accountVerificationCode"`
}
