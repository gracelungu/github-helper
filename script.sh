#!/bin/bash

# Define the root path
root_path="src/pages"

# Initialize variables to keep track of the current file path and content
current_file_path=""
current_content=""

# Read the input file line by line
while IFS= read -r line; do
  # Check if the line starts with "//"
  if [[ $line == "//"* ]]; then
    # If there is content, write it to the specified file path
    if [[ -n $current_content ]]; then
      # Ensure the directory exists before writing the file
      mkdir -p "$(dirname "$root_path/$current_file_path")"
      echo "$current_content" > "$root_path/$current_file_path"
    fi
    # Extract the file path from the comment
    current_file_path="${line#// }"
    # Reset the content
    current_content=""
  else
    # Append the line to the current content
    current_content+=$'\n'"$line"
  fi
done < "content.txt"

# Write the remaining content to the specified file path
if [[ -n $current_content ]]; then
  # Ensure the directory exists before writing the file
  mkdir -p "$(dirname "$root_path/$current_file_path")"
  echo "$current_content" > "$root_path/$current_file_path"
fi
