package dto_tool_configuration

type MetasploitHelperResponseDTO struct {
	JSONRPC string `json:"jsonrpc"`
	Id      int    `json:"id"`
	Result  any    `json:"result"`
}
