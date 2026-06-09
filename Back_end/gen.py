import os
import re
controller_dir = r'C:\Projects\ProjectShopMoHinh\figure-shop\Back_end\src\main\java\com\example\shopmohinh\controller'
dto_dir = r'C:\Projects\ProjectShopMoHinh\figure-shop\Back_end\src\main\java\com\example\shopmohinh\dto\request'
md_content = '# API Documentation\n\n'
def parse_dto(dto_name):
    # DTO might be inside request/ or just dto/
    dto_file_path = os.path.join(dto_dir, f'{dto_name}.java')
    if not os.path.exists(dto_file_path):
        dto_file_path = os.path.join(r'C:\Projects\ProjectShopMoHinh\figure-shop\Back_end\src\main\java\com\example\shopmohinh\dto', f'{dto_name}.java')
    if not os.path.exists(dto_file_path):
        return '`json\n// No explicit structure found\n`\n'
    with open(dto_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Try finding private fields
    fields = re.findall(r'private\s+([\w<>]+)\s+(\w+);', content)
    json_body = '`json\n{\n'
    for f_type, f_name in fields:
        val = '""' if f_type == 'String' else '0' if f_type in ['int', 'Long', 'Integer', 'Double', 'Float', 'BigDecimal'] else 'true/false' if f_type in ['boolean', 'Boolean'] else '[]' if 'List' in f_type or 'Set' in f_type else '{}'
        json_body += f'  "{f_name}": {val}, // type: {f_type}\n'
    json_body += '}\n`\n'
    return json_body
if not os.path.exists(controller_dir):
    print('Dir not found!')
else:
    for filename in os.listdir(controller_dir):
        if filename.endswith('.java'):
            filepath = os.path.join(controller_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            base_path = ''
            base_match = re.search(r'@RequestMapping\("?([^"]*)"?\)', content)
            if base_match:
                base_path = base_match.group(1)
            md_content += f'## {filename.replace("Controller.java", "")} API\n\n'
            # Find all mapping annotations and following parameter signatures
            mappings = re.finditer(r'@(Get|Post|Put|Delete)Mapping(?:[\s\n]*\((?:[\s\n]*value[\s\n]*=[\s\n]*)?(".*?"|\{.*?\})?.*?\))?[\s\n]+[^\n]*\b(\w+)\s*\((.*?)\)', content, re.DOTALL)
            for m in mappings:
                method = m.group(1).upper()
                path = m.group(2)
                if path:
                    path = path.replace('"', '').strip()
                else:
                    path = ''
                full_path = f"{base_path}{path}" if path.startswith('/') else f"{base_path}/{path}" if path else base_path
                full_path = full_path.replace('//', '/')
                md_content += f'### {method} {full_path}\n'
                params_str = m.group(4)
                # Path Variables
                path_vars = re.findall(r'@PathVariable(?:\s*\(".*?"\))?\s*([\w<>]+)\s+(\w+)', params_str)
                if path_vars:
                    md_content += f'- **Path Variables:** ' + ', '.join([f'{v[1]} ({v[0]})' for v in path_vars]) + '\n'
                # Request Params (Query params)
                query_vars = re.findall(r'@RequestParam(?:\s*\([^)]+\))?\s*([\w<>]+)\s+(\w+)', params_str)
                if query_vars:
                    md_content += f'- **Query Parameters:** ' + ', '.join([f'{v[1]} ({v[0]})' for v in query_vars]) + '\n'
                # Request Body
                body_match = re.search(r'@RequestBody\s+([\w<>]+)\s+(\w+)', params_str)
                if body_match:
                    dto_class = body_match.group(1)
                    if '<' in dto_class: # Strip generics
                        dto_class = dto_class.split('<')[0]
                    md_content += f'- **Request Body:** {dto_class}\n'
                    md_content += parse_dto(dto_class)
                else:
                    md_content += f'- **Request Body:** None\n'
                md_content += '\n'
with open('API_DOCUMENTATION.md', 'w', encoding='utf-8') as f:
    f.write(md_content)
