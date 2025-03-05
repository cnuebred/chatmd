#! /bin/bash

. ./tools/config.sh

if [[ $1 == "" ]]; then
  echo "No file/dir to download"
  exit 1
fi 


destiny="./"
if [[ $2 == "" ]]; then
  destiny=$2
fi 

OUTPUT=$(echo $"get -R $1 $destiny" |\
        sftp -P$SERVER_PORT $SERVER_USER@$SERVER_HOSTNAME:$SERVER_PROJECT_PATH 2>&1) | \
        grep "not found"


if [[ $? -eq 1 ]]; then
    return 0
else 
    return 1
fi
