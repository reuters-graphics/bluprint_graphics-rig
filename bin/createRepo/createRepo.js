const getPackageProp = require('../../config/utils/getPackageProp');
const setPackageProp = require('../../config/utils/setPackageProp');
const prompts = require('prompts');
const chalk = require('chalk');
const slugify = require('@sindresorhus/slugify');
const handleBadToken = require('./handleBadToken');

const renameProject = async() => {
  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: chalk`The project name {yellow ${getPackageProp('name')}} has already been used to create a GitHub repo. What else can we call this project?`,
  });

  setPackageProp('name', slugify(name));
};

const createRepo = async(octokit, org) => {
  const prefix = `graphics_${new Date().getFullYear()}`;
  const name = `${prefix}-${getPackageProp('name')}`;

  try {
    const response = await octokit.repos.createInOrg({
      org,
      name,
      private: true,
    });
    return response.data;
  } catch ({ status }) {
    if (status === 401) return handleBadToken();
    if (status === 422) {
      await renameProject();
      return createRepo(octokit, org);
    }
  }
};

module.exports = async(octokit, org) => createRepo(octokit, org);
