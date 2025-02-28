#! /bin/bash

. ./tools/config.sh

if [[ "$1" ==  " " ]]; then
  echo "No file/dir to upload"
  exit 1
fi 

sftp -P$SERVER_PORT $SERVER_USER@$SERVER_HOSTNAME:$SERVER_PROJECT_PATH <<< $"put -R $1"

