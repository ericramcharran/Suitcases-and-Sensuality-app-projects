#!/bin/bash

echo "Creating mutual match between Marcus and Sarah on production..."

curl -X POST https://theexecutivesociety.co/api/admin/create-mutual-match \
  -H "Content-Type: application/json" \
  -d '{"userId":"38ad30cf-f254-4ebb-ab47-c2260e2a2faa","targetUserId":"fd98f1e3-5ae3-4ef8-9c47-963530b78b06"}'

echo ""
echo "Done! Refresh your Messages page."
