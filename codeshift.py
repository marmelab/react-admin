import os
import re
import subprocess


def process_md_files(folder_path):
    """
    Parses .md files to extract `jsx` or `tsx` code blocks, processes them using the
    MUI codemod, and replaces the original code blocks with the updated code.

    Args:
        folder_path (str): Path to the folder containing .md files.
    """
    # Check if the folder exists
    if not os.path.exists(folder_path):
        print(f"Folder '{folder_path}' does not exist.")
        return

    for filename in os.listdir(folder_path):
        if filename.endswith('.md'):
            file_path = os.path.join(folder_path, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    content = file.read()

                # Regex pattern to match ```jsx or ```tsx code blocks
                code_block_pattern = r"```(jsx|tsx)\n(.*?)\n```"
                matches = re.findall(code_block_pattern, content, re.DOTALL)

                # If no matches, skip the file
                if not matches:
                    continue

                updated_content = content

                for lang, code_block in matches:
                    temp_file_name = f"temp.{lang}"

                    # Write the code block to a temporary file
                    with open(temp_file_name, 'w', encoding='utf-8') as temp_file:
                        temp_file.write(code_block.strip())

                    # Run the MUI codemod
                    try:
                        subprocess.run(
                            ["npx", "@mui/codemod@latest", "v6.0.0/system-props", temp_file_name],
                            check=True
                        )
                    except subprocess.CalledProcessError as e:
                        print(f"Error running codemod on {temp_file_name}: {e}")
                        continue

                    # Read the transformed code
                    with open(temp_file_name, 'r', encoding='utf-8') as temp_file:
                        transformed_code = temp_file.read()

                    # Replace the original code block with the transformed code
                    original_block = f"```{lang}\n{code_block}\n```"
                    new_block = f"```{lang}\n{transformed_code.strip()}\n```"
                    updated_content = updated_content.replace(original_block, new_block)

                    # Clean up the temporary file
                    os.remove(temp_file_name)

                # Save the updated content back to the .md file
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(updated_content)

                print(f"Processed and updated: {filename}")

            except Exception as e:
                print(f"Error processing file {filename}: {e}")


# Replace 'your_folder_path' with the actual path to the folder containing .md files
folder_path = 'docs'
process_md_files(folder_path)