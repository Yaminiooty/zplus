// Helper function to apply default values to an object
export const applyDefaultValues = (object, defaults) => {
  return Object.fromEntries(
    Object.entries(defaults).map(([key, defaultValue]) => [key, object?.[key] ?? defaultValue])
  );
};

// Function to navigate to the next tool or create a pipeline
export const navigateToNextToolOrPipeline = (navigate, pathname, selectedTools) => {
  const currentTool = decodeURIComponent(pathname.split('/')[2]);
  const currentIndex = selectedTools.findIndex((tool) => tool === currentTool);

  if (currentIndex !== -1) {
    if (currentIndex < selectedTools.length - 1) {
      const nextTool = selectedTools[currentIndex + 1];
      navigate(`/configure-tools/${nextTool}`);
    } else {
      navigate('/review-and-save', { replace: true });
    }
  }
};

//Function to format the form values to match openVAS DTO
export function formatDataForOpenVAS(values) {
  const formattedData = {
    target: values.target.split(','),
    port_range: {
      tcp: values.tcp.split(','),
      udp: values.udp.split(','),
    },
    scanner_type: values.scanner_type,
    scan_config: values.scan_config,
    no_of_concurrent_nvt_per_host: parseInt(values.no_of_concurrent_nvt_per_host, 10),
    no_of_concurrent_scanned_host: parseInt(values.no_of_concurrent_scanned_host, 10),
    report_format: values.report_format,
    additional_comments: values.additional_comments,
  };

  return formattedData;
}

//Function to format the form values to match owaspZAP DTO
export function formatDataForOWASPZap(values) {
  const formattedData = {
    target: values.target,
    scan_type: values.scan_type,
    spider_type: values.spider_type,
    traditional_spider_options: {
      max_children: values.max_children,
      recurse: values.recurse,
      sub_tree_only: values.sub_tree_only,
    },
    attack_mode: values.attack_mode,
    authentication: values.authentication,
    login_url: values.login_url,
    username_parameter: values.username_parameter,
    password_parameter: values.password_parameter,
    username: values.username,
    password: values.password,
    logged_in_indicator: values.logged_in_indicator,
    policy_template: values.policy_template,
    report_format: values.report_format,
    additional_comments: values.additional_comments,
  };

  return formattedData;
}

export function formatDataForMetasploit(values) {
  const allowedFields = [
    'module_type',
    'module_fullname',
    'use_default_values',
    'advanced_options',
    'additional_comments',
  ];

  const formattedData = {
    module_type: values.module_type,
    module_fullname: values.module_fullname,
    module_data: {},
    use_default_values: values.use_default_values,
    advanced_options: values.advanced_options,
    additional_comments: values.additional_comments,
  };

  for (const key in values) {
    if (!allowedFields.includes(key)) {
      formattedData.module_data[key] = values[key];
    }
  }

  return formattedData;
}
