from pathlib import Path

def generate_text_report(full_file_path_with_extension, file_data):
    txt_report_path = Path(full_file_path_with_extension).expanduser()
    txt_report_path.write_text(file_data)
    return full_file_path_with_extension
