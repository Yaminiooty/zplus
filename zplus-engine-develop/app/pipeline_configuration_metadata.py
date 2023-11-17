
class PipelineConfigurationMetaData():
    
    def __init__(self,document_id,configuration_id,pipeline_id,email,tool_name,status) -> None:
        self.document_id=document_id
        self.configuration_id=configuration_id
        self.pipeline_id=pipeline_id
        self.email=email
        self.tool_name=tool_name
        self.status=status
