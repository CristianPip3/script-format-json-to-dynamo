#!/bin/bash
for i in {0..18}; do
    file_json="data-clean-"${i}".json"
    echo "file://${file_json}"
    aws dynamodb batch-write-item --request-items file://${file_json}
done