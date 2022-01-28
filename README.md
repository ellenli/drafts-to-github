# drafts-to-github

What I use to sync notes from Drafts.app as `.md` files on GitHub. From [Alexander Solovyov](https://solovyov.net/blog/2020/blog-workflow/).

## Installation
1. Clone/copy `action.js` and edit config variables
2. Add in Drafts.app > `Actions` menu > `Manage Actions` > `Basic` > `+` > `Add Action`
3. `Add Steps` > `Step Type` > Select `Script` (it's at the bottom of the list under `Advanced`) > `+`
4. Click the script, `Import`, select `action.js`
5. Optional but recommended: add a keyboard shortcut; mine is <kbd>control</kbd> <kbd>S</kbd>, `Save`
6. Get [a personal access token](https://github.com/settings/tokens) with `repo` scopes
7. Run action from `Actions` menu, enter token at initial run

## To do
- [x] Export to whatever directory (thanks Alexander)
- [ ] Use Drafts.app tags to automate publishing workflows
    - [ ] Export to different repos/paths
    - [ ] Add yaml/metadata e.g. `layout`, `tags`, etc
    - [ ] Update `post-list`, `archive`, etc
