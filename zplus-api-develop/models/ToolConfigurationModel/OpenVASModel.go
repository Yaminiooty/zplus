package model_tool_configuration

import "go.mongodb.org/mongo-driver/bson/primitive"

type OpenVASConfigurationModel struct {
	Id                        primitive.ObjectID `json:"_id" bson:"_id"`
	Target                    []string           `json:"target" bson:"target"`
	PortRange                 PortRange          `json:"port_range" bson:"port_range"`
	ScannerType               string             `json:"scanner_type" bson:"scanner_type"`
	ScanConfig                string             `json:"scan_config" bson:"scan_config"`
	NoOfConcurrentNVTsPerHost int                `json:"no_of_concurrent_nvt_per_host" bson:"no_of_concurrent_nvt_per_host"`
	NoOfConcurrentScannedHost int                `json:"no_of_concurrent_scanned_host" bson:"no_of_concurrent_scanned_host"`
	ReportFormat              string             `json:"report_format" bson:"report_format"`
	AdditionalComments        string             `json:"additional_comments" bson:"additional_comments"`
}

type PortRange struct {
	TCP []string `json:"tcp" bson:"tcp"`
	UDP []string `json:"udp" bson:"udp"`
}
