package model_tool_configuration_zap

type TraditionalSpiderOptionsModel struct {
	MaxChildren int  `bson:"max_children" json:"max_children"`
	Recurse     bool `bson:"recurse" json:"recurse"`
	SubTreeOnly bool `bson:"sub_tree_only" json:"sub_tree_only"`
}
