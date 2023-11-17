export const BACKEND_ENDPOINT = {
  //User endpoints
  LOGIN: '/login',
  LOGOUT: '/logout',
  FORGOT_PASSWORD: '/reset_password',
  RESET_PASSWORD: '/update_password',
  REGISTER_USER: '/users',
  VERIFY_ACCOUNT: '/verify_account',
  GET_VERIFICATION_CODE: '/get_verification_code',
  GET_USER_DETAILS: '/user',
  UPDATE_USER_DETAILS: '/update_user_details',
  CHANGE_PASSWORD: '/change-password',
  ACCESS_TOKEN: '/access_token',

  //Tool selection endpoints
  GET_TOOLS: '/tools',
  SEND_SELECTED_TOOLS: '/select-tools',

  //Tool configuration endpoints
  SAVE_TOOL_CONFIGURATION: (toolName) => `/save_tool_configuration/${toolName}`,
  GET_METASPLOIT_MODULES: '/metasploit_helper/search',
  GET_METASPLOIT_MODULES_OPTIONS: '/metasploit_helper/options',
  GET_PIPELINE_CONFIGURATION: '/get_current_pipeline_configurations',

  //Action pipeline endpoints
  CREATE_PIPELINE: '/create-pipeline',
  RUN_PIPELINE: '/run-pipeline',
  GET_PIPELINE_STATUS: (pipelineID) => `/action-pipeline-status/${pipelineID}`,
  GET_REPORTS: '/get-available-result',
  EMAIL_REPORT: '/email-result-file',
  DOWNLOAD_REPORT: '/download-result-file',
};
