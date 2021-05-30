#!/bin/bash
for i in {0..170}; do
    file_json="data-clean-"${i}".json"
    echo "file://${file_json}" >> log
    aws dynamodb batch-write-item --request-items file://${file_json} &>> log
done