#! /bin/bash 
. ./tools/config.sh

tag=$(git rev-parse --short HEAD)
are_changes=$(git status --porcelain)
current_branch=$(git status --branch --short | \
                 grep -E "## \w+" | \
                 grep -E "\w+" -o1)
are_changes_token=""


if [[ "$current_branch" != "$CORE_BRANCH" ]]; then
	echo "you are not on core branch (which is '$CORE_BRANCH')"
  exit 1
fi

if [[ "$are_changes" != ""  ]]; then
	are_changes_token="+"
  echo "there are uncommitted changes"
  exit 1
fi

version=$(cat ./package.json | \
          grep -E '"version": "([0-9]+.[0-9]+.[0-9]+)"' | \
          grep -Ei "[0-9]+.[0-9]+.[0-9]+" -o1) 

chatmd_version="${version}_${tag}${are_changes_token}"

## SET PROCESS FILE
echo "CHATMD_VERSION=${chatmd_version}" > .process
echo "CHATMD_API_VERSION=0.1" >> .process
## END

./tools/download.sh $RELEASE_LOG
echo "## $chatmd_version" >> $RELEASE_LOG
vim $RELEASE_LOG
./tools/upload.sh $RELEASE_LOG

./tools/upload.sh ./.process
# todo - upload all production files


# ends up with add process file to git and version tag
git add ./.process $RELEASE_LOG
git commit -m"update process file - new release: $chatmd_version"
git tag $chatmd_version
git push origin $current_branch

. ./.process

