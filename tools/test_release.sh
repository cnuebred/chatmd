#! /bin/bash 
. ./tools/config.sh

tag=$(git rev-parse --short HEAD)
are_changes=$(git status --porcelain)
current_branch=$(git status --branch --short | \
                 grep -E "## \w+" | \
                 grep -E "\w+" -o1)
are_changes_token=""

if [[ "$are_changes" != ""  ]]; then
	are_changes_token="+"
  echo "there are uncommitted changes"
fi

version=$(cat ./package.json | \
          grep -E '"version": "([0-9]+.[0-9]+.[0-9]+)"' | \
          grep -Ei "[0-9]+.[0-9]+.[0-9]+" -o1) 

chatmd_version="${version}_${tag}${are_changes_token}"

## SET PROCESS FILE
echo "CHATMD_VERSION=${chatmd_version}" > .process
## END

./tools/download.sh $TEST_RELEASE_LOG
echo "## $chatmd_version[$current_branch]" >> $TEST_RELEASE_LOG
vim $TEST_RELEASE_LOG
./tools/upload.sh $TEST_RELEASE_LOG

./tools/upload.sh ./.process
# todo - upload all production files


# ends up with add process file to git and version tag
git add ./.process $TEST_RELEASE_LOG
git commit -m"update process file - new test release: $chatmd_version on '$current_branch' branch"
git tag $chatmd_version
git push origin $current_branch

. ./.process

