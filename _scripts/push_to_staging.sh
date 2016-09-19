echo "Pushing to staging..."

git config --global user.email $GITHUB_USER_EMAIL
git config --global user.name $GITHUB_USER_NAME

git checkout staging
git merge develop
git push origin staging