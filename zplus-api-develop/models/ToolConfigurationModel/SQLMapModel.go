package model_tool_configuration

import "go.mongodb.org/mongo-driver/bson/primitive"

type SQLMapConfigurationModel struct {
	Id                     primitive.ObjectID `bson:"_id" json:"_id"`
	Target                 string             `bson:"target" json:"target"`
	TestingMode            string             `bson:"testing_mode"  json:"testing_mode"`
	TestingLevel           string             `bson:"testing_level"  json:"testing_level" `
	VerbosityLevel         string             `bson:"verbosity_level" json:"verbosity_level"`
	TestForms              bool               `bson:"test_forms" json:"test_forms"`
	CheckForAdditionalUrls bool               `bson:"check_for_additional_urls" json:"check_for_additional_urls"`
	Cookies                string             `bson:"cookies" json:"cookies"`
	Headers                string             `bson:"headers" json:"headers"`
	Data                   string             `bson:"data" json:"data"`
	UserAgent              string             `bson:"user_agent" json:"user_agent"`
	NumberOfThreads        string             `bson:"number_of_threads" json:"number_of_threads"`
	ExcludeSystemDatabase  bool               `bson:"exclude_system_databases" json:"exclude_system_databases"`

	CurrentSessionUser  bool `bson:"current_session_user" json:"current_session_user"`
	CurrentDatabase     bool `bson:"current_database" json:"current_database"`
	EnumerateUsers      bool `bson:"enumerate_users" json:"enumerate_users"`
	EnumeratePasswords  bool `bson:"enumerate_passwords" json:"enumerate_passwords"`
	EnumeratePrivilages bool `bson:"enumerate_privileges" json:"enumerate_privileges"`
	EnumerateRoles      bool `bson:"enumerate_roles" json:"enumerate_roles"`
	EnumerateDatabases  bool `bson:"enumerate_databases" json:"enumerate_databases"`
	EnumerateTables     bool `bson:"enumerate_tables" json:"enumerate_tables"`
	EnumerateColumns    bool `bson:"enumerate_columns" json:"enumerate_columns"`
	EnumerateSchemas    bool `bson:"enumerate_schemas" json:"enumerate_schemas"`

	ReportFormat       string `bson:"report_format" binding:"required,oneof='PDF' 'TXT'" json:"report_format" binding:"required,oneof='PDF' 'TXT'"`
	AdditionalComments string `bson:"additional_comments" json:"additional_comments"`
}
