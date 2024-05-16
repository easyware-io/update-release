# easyware-io/update-release@v1

![CI](https://github.com/easyware-io/update-release/actions/workflows/build.yml/badge.svg)

An Action to update releases via the GitHub Release API

## Usage

### Basic usage

```yaml
- name: update release
  uses: easyware-io/update-release@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    release_id: 1
```

### Inputs

#### `token`

GitHub token

#### `release_id`

ID of the release (not release name!).`

#### `release_name`

Optional. New name for the release

#### `tag_name`

Optional. New tag name for the release.

#### `body`

Optional. Text describing the contents of the release. Not needed if using `body_path`.

#### `body_path`

Optional. A file with contents describing the release. Not needed if using `body`.

#### `draft`

Optional. `true` to update to draft (unpublished) release, `false` to publish the release.

#### `prerelease`

Optional. `true` to identify the release as a prerelease. `false` to identify the release as a full release.

#### `owner`

Optional. Owner of the repository. Defaults to current owner.

#### `repo`

Optional. Name of the repository. Defaults to current repo.

#### `error-if-not-found`

Optional. Action fails if release is not found. Defaults to false.

### Outputs

#### `id`

ID of the release

#### `name`

Name of the release

#### `tag_name`

Tag name of the release

#### `body`

Body of the release

#### `draft`

Whether the release is a draft

#### `prerelease`

Whether the release is a prerelease

#### `created_at`

Creation date of the release

#### `published_at`

Publication date of the release

#### `url`

URL of the release

#### `html_url`

HTML URL of the release

#### `assets_url`

URL of the release assets

#### `upload_url`

URL for uploading assets to the release

#### `tarball_url`

URL of the release tarball

#### `zipball_url`

URL of the release zipball

#### `node_id`

Node ID of the release

#### `author_login`

Login of the release author

#### `author_id`

ID of the release author

#### `author_node_id`

Node ID of the release author

#### `author_avatar_url`

Avatar URL of the release author

#### `author_html_url`

HTML URL of the release author

#### `author_followers_url`

URL of the followers of the release author

#### `author_following_url`

URL of the users followed by the release author

#### `author_gists_url`

URL of the gists created by the release author

#### `author_starred_url`

URL of the repositories starred by the release author

#### `author_subscriptions_url`

URL of the subscriptions of the release author

#### `author_organizations_url`

URL of the organizations the release author belongs to

#### `author_repos_url`

URL of the repositories owned by the release author

#### `author_events_url`

URL of the events performed by the release author

#### `author_received_events_url`

URL of the events received by the release author

#### `author_type`

Type of the release author

#### `author_site_admin`

Whether the release author is a site admin
