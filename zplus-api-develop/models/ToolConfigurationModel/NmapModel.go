package model_tool_configuration

import "go.mongodb.org/mongo-driver/bson/primitive"

type NmapConfigurationModel struct {
	Id                          primitive.ObjectID `bson:"_id"`
	Target                      string             `bson:"target" binding:"required"`
	Scan_Type                   string             `bson:"scan_type"`
	Port                        string             `bson:"port"`
	Scan_Timing                 string             `bson:"scan_timing"`
	Output_Format               string             `bson:"output_format"`
	Aggressive_Scan             bool               `bson:"aggressive_scan"`
	Script_Scan                 string             `bson:"script_scan"`
	Traceroute                  bool               `bson:"traceroute"`
	Show_Port_State_Reason      bool               `bson:"show_port_state_reason"`
	Scan_All_Ports              bool               `bson:"scan_all_ports"`
	Version_Detection_Intensity string             `bson:"version_detection_intensity"`
	Max_Round_Trip_Timeout      string             `bson:"max_round_trip_timeout"`
	Max_Retries                 string             `bson:"max_retries"`
	Fragment_Packets            bool               `bson:"fragment_packets"`
	Service_Version_Probe       bool               `bson:"service_version_probe"`
	Default_NSE_Scripts         bool               `bson:"default_nse_scripts"`
}
