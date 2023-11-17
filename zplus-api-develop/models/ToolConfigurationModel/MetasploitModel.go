package model_tool_configuration

import "go.mongodb.org/mongo-driver/bson/primitive"

type MetasploitConfigurationModel struct {
	Id                  primitive.ObjectID `bson:"_id"`
	Module_Type         string             `bson:"module_type"`
	Module_Fullname     string             `bson:"module_fullname"`
	Module_Data         any                `bson:"module_data"`
	Use_Default_Values  bool               `bson:"use_default_values"`
	Advanced_Options    bool               `bson:"advanced_options"`
	Additional_Comments string             `bson:"additional_comments"`
}
