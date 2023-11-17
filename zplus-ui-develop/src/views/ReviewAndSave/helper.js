export function transformConfiguration(configuration, toolName) {
  let transformedConfig = { ...configuration };

  switch (toolName) {
    case 'OWASPZAP':
      transformedConfig = {
        ...configuration,
        max_children: configuration.traditional_spider_options?.max_children || '',
        recurse: configuration.traditional_spider_options?.recurse || '',
        sub_tree_only: configuration.traditional_spider_options?.sub_tree_only || '',
      };
      break;

    case 'OWASPDependencyCheck':
      transformedConfig = {
        ...configuration,
        project_file: configuration.project_file?.filename || '',
        suppress_cve_reports_file: configuration.suppress_cve_reports_file?.filename || '',
      };
      break;

    case 'OpenVAS':
      transformedConfig = {
        ...configuration,
        tcp: configuration.port_range?.tcp || '',
        udp: configuration.port_range?.udp || '',
      };
      break;

    case 'Metasploit':
      transformedConfig = {
        ...configuration,
        ...configuration.module_data,
      };
      break;

    case 'JMeterLoadTesting':
      transformedConfig = {
        ...configuration,
        test_plan_file: configuration.test_plan_file?.filename || '',
      };
      break;

    default:
      break;
  }

  return transformedConfig;
}
