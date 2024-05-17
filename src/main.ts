import * as core from '@actions/core';
import * as github from '@actions/github';
import fs from 'fs';

export default async function run(): Promise<void> {
  try {
    core.debug('Getting owner and repo from context');
    const currentOwner = github.context.repo.owner;
    const currentRepo = github.context.repo.repo;

    core.debug('Getting inputs from the user');
    const token = core.getInput('token', { required: true });
    const release_id = parseInt(core.getInput('release_id', { required: true }));
    const tag_name = core.getInput('tag_name');
    const name = core.getInput('release_name');
    const body = core.getInput('body');
    const body_path = core.getInput('body_path');
    const draftRaw = core.getInput('draft');
    const prereleaseRaw = core.getInput('prerelease');
    const owner = core.getInput('owner') || currentOwner;
    const repo = core.getInput('repo') || currentRepo;
    const errorIfNotFound = core.getInput('error-if-not-found') === 'true';

    core.debug('Checking body');
    let bodyFileContent = null;
    if (body_path !== '' && !!body_path) {
      try {
        bodyFileContent = fs.readFileSync(body_path, { encoding: 'utf8' });
      }
    }

    core.debug(`Creating Octokit instance with token: ${token}`);
    const octokit = github.getOctokit(token);

    const currentRelease = await octokit.rest.repos.getRelease({
      owner,
      repo,
      release_id,
    });

    core.debug('Validate draft flag');
    let draft = false;
    if (draftRaw == null) {
      draft = currentRelease.data.draft;
    } else {
      draft = draftRaw === 'true';
    }

    core.debug('Validate prerelease flag');
    let prerelease = true;
    if (prereleaseRaw == null) {
      prerelease = currentRelease.data.prerelease;
    } else {
      prerelease = prereleaseRaw === 'true';
    }

    if (currentRelease == null) {
      if (errorIfNotFound) {
        core.error(`No release found.`);
        core.setFailed(`No release found.`);
      } else {
        core.info(`No release found.`);
      }
      return;
    }

    core.debug(`Updating release with id ${release_id} in ${owner}/${repo}`);
    const response = await octokit.rest.repos.updateRelease({
      owner,
      repo,
      release_id,
      tag_name: tag_name || currentRelease.data.tag_name,
      name: name || currentRelease.data.name || tag_name || currentRelease.data.tag_name,
      body: bodyFileContent || body || currentRelease.data.body || '',
      draft,
      prerelease,
    });

    core.debug(`Setting outputs`);
    core.setOutput('id', response.data.id);
    core.setOutput('name', response.data.name);
    core.setOutput('tag_name', response.data.tag_name);
    core.setOutput('body', response.data.body);
    core.setOutput('draft', response.data.draft);
    core.setOutput('prerelease', response.data.prerelease);
    core.setOutput('created_at', response.data.created_at);
    core.setOutput('published_at', response.data.published_at);
    core.setOutput('url', response.data.url);
    core.setOutput('html_url', response.data.html_url);
    core.setOutput('assets_url', response.data.assets_url);
    core.setOutput('upload_url', response.data.upload_url);
    core.setOutput('tarball_url', response.data.tarball_url);
    core.setOutput('zipball_url', response.data.zipball_url);
    core.setOutput('node_id', response.data.node_id);
    core.setOutput('author_login', response.data.author.login);
    core.setOutput('author_id', response.data.author.id);
    core.setOutput('author_node_id', response.data.author.node_id);
    core.setOutput('author_avatar_url', response.data.author.avatar_url);
    core.setOutput('author_html_url', response.data.author.html_url);
    core.setOutput('author_followers_url', response.data.author.followers_url);
    core.setOutput('author_following_url', response.data.author.following_url);
    core.setOutput('author_gists_url', response.data.author.gists_url);
    core.setOutput('author_starred_url', response.data.author.starred_url);
    core.setOutput('author_subscriptions_url', response.data.author.subscriptions_url);
    core.setOutput('author_organizations_url', response.data.author.organizations_url);
    core.setOutput('author_repos_url', response.data.author.repos_url);
    core.setOutput('author_events_url', response.data.author.events_url);
    core.setOutput('author_received_events_url', response.data.author.received_events_url);
    core.setOutput('author_type', response.data.author.type);
    core.setOutput('author_site_admin', response.data.author.site_admin);
  } catch (error) {
    core.setFailed(`Failed to create release, error: ${error}`);
  }
}

run();
