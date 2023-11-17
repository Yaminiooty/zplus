package dto_tool_configuration

type OpenVASConfigurationDTO struct {
	Target                    []string  `json:"target" binding:"required"`
	PortRange                 PortRange `json:"port_range" binding:"required"`
	ScannerType               string    `json:"scanner_type" binding:"required,oneof='OpenVAS Default' 'CVE'"`
	ScanConfig                string    `json:"scan_config" binding:"required,oneof='Base' 'Discovery' 'empty' 'Full and fast' 'Host Discovery' 'Log4Shell' 'System Discovery'"`
	ReportFormat              string    `json:"report_format" binding:"required,oneof='XML' 'PDF' 'TEXT'"`
	NoOfConcurrentNVTsPerHost int       `json:"no_of_concurrent_nvt_per_host" binding:"required"`
	NoOfConcurrentScannedHost int       `json:"no_of_concurrent_scanned_host" binding:"required"`
	AdditionalComments        string    `json:"additional_comments"`
}

type PortRange struct {
	TCP []string `json:"tcp" binding:"required"`
	UDP []string `json:"udp" binding:"required"`
}
