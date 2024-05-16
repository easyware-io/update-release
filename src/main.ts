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
    const tag_name = core.getInput('tag_name', { required: true });
    const name = core.getInput('release_name', { required: true }).replace('refs/tags/', '');
    const body = core.getInput('body');
    const body_path = core.getInput('body_path');
    const draft = core.getInput('draft') === 'true';
    const prerelease = core.getInput('prerelease') === 'true';
    const target_commitish = core.getInput('commitish') || github.context.sha;
    const owner = core.getInput('owner') || currentOwner;
    const repo = core.getInput('repo') || currentRepo;
    const make_latest_raw = core.getInput('make_latest');
    const make_latest = make_latest_raw === 'true' || make_latest_raw === 'false' || make_latest_raw === 'legacy' ? make_latest_raw : 'false';

    core.debug('Checking body');
    let bodyFileContent = null;
    if (body_path !== '' && !!body_path) {
      try {
        bodyFileContent = fs.readFileSync(body_path, { encoding: 'utf8' });
      } catch (error) {
        core.setFailed(`Failed to read body_path, error: ${error}`);
      }
    }

    core.debug(`Creating Octokit instance with token: ${token}`);
    const octokit = github.getOctokit(token);

    core.debug(`Creating release ${tag_name} in ${owner}/${repo}`);
    const response = await octokit.rest.repos.createRelease({
      owner,
      repo,
      tag_name,
      target_commitish,
      name,
      body: bodyFileContent || body,
      draft,
      prerelease,
      make_latest,
    });

    core.info(`Release created: ${response.data.html_url}`);
    core.setOutput('data', response.data);
  } catch (error) {
    core.setOutput('data', null);
    core.setFailed(`Failed to create release, error: ${error}`);
  }
}

run();
