#! /bin/bash -x

tag=$(git rev-parse --short HEAD)
are_changes=$(git status --porcelain)

are_changes_token=""

if [[ "$are_changes" != ""  ]]; then
	are_changes_token="+"
fi

version=$(cat ./package.json | grep -E '"version": "([0-9]+.[0-9]+.[0-9]+)"' | grep -Ei "[0-9]+.[0-9]+.[0-9]+" -o1) 

chatmd_version="${version}_${tag}${are_changes_token}"
echo "CHATMD_VERSION=${chatmd_version}" > .process

./tools/upload.sh ./.process



# ends up with add process file to git

git add ./.process
git commit -m"update process file - new release: $chatmd_version"

. ./.process

