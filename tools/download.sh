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

sftp -P$SERVER_PORT $SERVER_USER@$SERVER_HOSTNAME:$SERVER_PROJECT_PATH <<< $"get -R $1 $destiny"