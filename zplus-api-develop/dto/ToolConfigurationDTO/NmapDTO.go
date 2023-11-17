package dto_tool_configuration

type NmapConfigurationDTO struct {
	Target                      string `json:"target" binding:"required"`
	Scan_Type                   string `json:"scan_type" binding:"required,oneof='SYN Scan' 'TCP Connect Scan' 'UDP Scan' 'Comprehensive Scan'"`
	Port                        string `json:"port" binding:"required"`
	Scan_Timing                 string `json:"scan_timing" binding:"required,oneof='Slowest' 'Slow' 'Normal' 'Fast' 'Fastest'"`
	Output_Format               string `json:"output_format" binding:"required,oneof='XML' 'Normal' 'Grepable'"`
	Aggressive_Scan             bool   `json:"aggressive_scan"`
	Script_Scan                 string `json:"script_scan" binding:"oneof='' 'None' 'Vulnerability Scripts' 'Default Scripts' 'Custom Scripts'"`
	Traceroute                  bool   `json:"traceroute"`
	Show_Port_State_Reason      bool   `json:"show_port_state_reason"`
	Scan_All_Ports              bool   `json:"scan_all_ports"`
	Version_Detection_Intensity string `json:"version_detection_intensity" binding:"oneof='' 'Low' 'Medium' 'High'"`
	Max_Round_Trip_Timeout      string `json:"max_round_trip_timeout"`
	Max_Retries                 string `json:"max_retries"`
	Fragment_Packets            bool   `json:"fragment_packets"`
	Service_Version_Probe       bool   `json:"service_version_probe"`
	Default_NSE_Scripts         bool   `json:"default_nse_scripts"`
}
