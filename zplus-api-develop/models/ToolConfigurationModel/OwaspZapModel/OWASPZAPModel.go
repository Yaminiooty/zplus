package model_tool_configuration_zap

import "go.mongodb.org/mongo-driver/bson/primitive"

type OWASPZAPConfigurationModel struct {
	Id                       primitive.ObjectID            `bson:"_id" json:"_id"`
	Target                   string                        `bson:"target" json:"target"`
	Scan_Type                string                        `bson:"scan_type" json:"scan_type"`
	Spider_Type              string                        `bson:"spider_type" json:"spider_type"`
	TraditionalSPiderOptions TraditionalSpiderOptionsModel `bson:"traditional_spider_options" json:"traditional_spider_options"`
	Attack_Mode              string                        `bson:"attack_mode" json:"attack_mode"`
	Authentication           bool                          `bson:"authentication" json:"authentication"`
	LoginUrl                 string                        `bson:"login_url" json:"login_url"`
	UsernameParamater        string                        `bson:"username_parameter" json:"username_parameter"`
	PasswordParamater        string                        `bson:"password_parameter" json:"password_parameter"`
	Username                 string                        `bson:"username" json:"username"`
	Password                 string                        `bson:"password" json:"password"`
	LoggedInIndicator        string                        `bson:"logged_in_indicator" json:"logged_in_indicator"`
	Policy_Template          string                        `bson:"policy_template" json:"policy_template"`
	Report_Format            string                        `bson:"report_format" json:"report_format"`
	Additional_Comments      string                        `bson:"additional_comments" json:"additional_comments"`
}
