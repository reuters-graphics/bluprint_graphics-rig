const githubUsername = require('github-username');
const chalk = require('chalk');
const getProfileProp = require('../../config/utils/getProfileProp');
const { Octokit } = require('@octokit/rest');
const simpleGit = require('simple-git/promise');
const createRepo = require('./createRepo');
const updateRepo = require('./updateRepo');
const getToken = require('./getToken');
const logger = require('../../config/utils/logger')('Create repo');

const git = simpleGit();

const run = async() => {
  logger.info('Creating a repository for this project in GitHub...');

  const org = 'tr';
  const username = await githubUsername(getProfileProp('github.email'));
  const token = await getToken(username);

  const octokit = new Octokit({ auth: token });

  const repo = await createRepo(octokit, org);

  if (!repo) return logger.info('Error creating repo for this project. Create it manually.');

  await git.addRemote('origin', repo.url);
  await updateRepo(octokit, org, repo.name);

  logger.info(chalk`Created your repo at {yellow ${repo.url}}`);
};

run();
