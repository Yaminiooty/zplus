import React, { useState } from 'react';
import { transformConfiguration } from '../helper';
import { useSelector } from 'react-redux';

const Accordion = ({ pipelineData }) => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const metasploitModulesOptions = useSelector((state) => state.toolsConfig.metasploitModulesOptions);

  const toggleAccordion = (index) => {
    if (openAccordion === index) {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(index);
    }
  };

  const labelMapping = {
    Nmap: {
      target: 'Target(s)',
      scan_type: 'Scan type',
      port: 'Port range',
      scan_timing: 'Scan timing',
      output_format: 'Output formats',
      aggressive_scan: 'Aggressive scan',
      script_scan: 'Script scan',
      traceroute: 'Traceroute',
      show_port_state_reason: 'Show port state reasons',
      scan_all_ports: 'Scan all ports',
      version_detection_intensity: 'Version detection intensity',
      max_round_trip_timeout: 'Max Round-trip timeout',
      max_retries: 'Max retries',
      fragment_packets: 'Fragment packets',
      service_version_probe: 'Service version probe',
      default_nse_scripts: 'Default NSE scripts',
    },
    OpenVAS: {
      target: 'Target IP/Hostname',
      tcp: 'Scan port range (TCP)',
      udp: 'Scan port range (UDP)',
      scanner_type: 'Scanner type',
      scan_config: 'Scan config',
      no_of_concurrent_nvt_per_host: 'Number of concurrent NVTs per host',
      no_of_concurrent_scanned_host: 'Number of concurrent scanned host',
      report_format: 'Report format',
      additional_comments: 'Additional comments',
    },
    OWASPZAP: {
      target: 'Target URL',
      scan_type: 'Scan type',
      spider_type: 'Spider type',
      max_children: 'Max Children',
      recurse: 'Recurse',
      sub_tree_only: 'Sub tree only',
      attack_mode: 'Attack mode',
      authentication: 'Enable authentication',
      login_url: 'Login URL',
      username_parameter: 'Username parameter',
      password_parameter: 'Password parameter',
      username: 'Username',
      password: 'Password',
      logged_in_indicator: 'Logged in indicator',
      policy_template: 'Policy template',
      report_format: 'Report format',
      additional_comments: 'Additional comments',
    },
    OWASPDependencyCheck: {
      project_file: 'Project file (zip)',
      output_format: 'Output format',
      scan_dependencies: 'Perform dependency scanning',
      scan_dev_dependencies: 'Include development dependencies',
      suppress_update_check: 'Suppress update check',
      suppress_cve_reports: 'Suppress CVE reports',
      suppress_cve_reports_file: 'Suppress CVE reports file',
      additional_comments: 'Additional comments',
    },
    SQLMap: {
      target: 'Target URL',
      testing_mode: 'Testing mode',
      testing_level: 'Testing level',
      verbosity_level: 'Verbosity level',
      test_forms: 'Test forms',
      check_for_additional_urls: 'Check for additional URLs',
      cookies: 'Cookies',
      headers: 'Headers',
      data: 'Data',
      user_agent: 'User agent',
      number_of_threads: 'Number of threads',
      exclude_system_databases: 'Exclude system databases',
      current_session_user: 'Current session user',
      current_database: 'Current database',
      enumerate_users: 'Enumerate DBMS users',
      enumerate_passwords: 'Enumerate DBMS users password hashes',
      enumerate_privileges: 'Enumerate DBMS users privilages',
      enumerate_roles: 'Enumerate DBMS users roles',
      enumerate_databases: 'Enumerate DBMS databases',
      enumerate_tables: 'Enumerate DBMS database tables',
      enumerate_columns: 'Enumerate DBMS database table columns',
      enumerate_schemas: 'Enumerate DBMS schema',
      report_format: 'Report format',
      additional_comments: 'Additional comments',
    },
    Metasploit: {
      module_type: 'Module type',
      module_fullname: 'Module name',
      use_default_values: 'Use default values',
      advanced_options: 'Show advanced options',
      additional_comments: 'Additional comments',

      ...metasploitModulesOptions?.reduce((acc, field) => {
        acc[field.name] = field.name;
        return acc;
      }, {}),
    },
    JMeterLoadTesting: {
      test_plan_file: 'Test Plan file (jmx)',
      number_of_threads_udf: 'User Defined Variable for Number of threads',
      number_of_threads: 'Number of threads',
      ramp_up_period_udf: 'User Defined Variable for Ramp-Up period (seconds)',
      ramp_up_period: 'Ramp-Up period (seconds)',
      loop_count_udf: 'User Defined Variable for Loop count (test iterations)',
      loop_count: 'Loop count (test iterations)',
      test_duration_udf: 'User Defined Variable for Test durations (seconds)',
      test_duration: 'Test durations (seconds)',
      report_format: 'Report format',
      additional_comments: 'Additional comments',
    },
  };

  return (
    <div className='accordion accordion-flush'>
      {pipelineData.map((item, index) => (
        <div
          className='accordion-item'
          key={item.tool_name}>
          <h2 className='accordion-header'>
            <button
              className={`accordion-button ${openAccordion === index ? '' : 'collapsed'}`}
              type='button'
              onClick={() => toggleAccordion(index)}
              style={{ backgroundColor: '#f0f0f0' }}>
              {item.tool_name} Tool
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${openAccordion === index ? 'show' : ''}`}>
            <div className='accordion-body'>
              <div className='row'>
                <div className='col-md-12 col-lg-12 col-sm-12 col-12'>
                  <table className='table table-bordered'>
                    <tbody>
                      {Object.keys(labelMapping[item.tool_name])?.map((fieldName) => {
                        const transformedConfig = transformConfiguration(item.configuration, item.tool_name);
                        const fieldValue = transformedConfig ? transformedConfig[fieldName] : '';
                        let renderedValue;
                        if (typeof fieldValue === 'boolean') {
                          renderedValue = fieldValue ? 'Yes' : 'No';
                        } else {
                          renderedValue = fieldValue;
                        }

                        //Only render rows for filled fields
                        if (
                          fieldValue !== undefined &&
                          fieldValue !== null &&
                          fieldValue !== '' &&
                          renderedValue !== 'No'
                        ) {
                          return (
                            <tr key={fieldName}>
                              <th width='30%'>{labelMapping[item.tool_name][fieldName]}</th>
                              <td>{renderedValue}</td>
                            </tr>
                          );
                        }
                        return null;
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
