package dto_tool_configuration_zap

type TraditionalSPiderOptions struct {
	MaxChildren int  `json:"max_children"`
	Recurse     bool `json:"recurse"`
	SubTreeOnly bool `json:"sub_tree_only"`
}
