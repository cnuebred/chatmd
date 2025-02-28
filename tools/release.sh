#! /bin/bash

tag=$(git rev-parse --short HEAD)
are_changes=$(git status --porcelain)

are_changes_token=""

if [[ "$are_changes" != ""  ]]; then
	are_changes_token="+"
fi

version=$(cat ./package.json | grep -E '"version": "([0-9]+.[0-9]+.[0-9]+)"' | grep -Ei "[0-9]+.[0-9]+.[0-9]+" -o1) 


echo "${version}_${tag}${are_changes_token}"
# TODO
