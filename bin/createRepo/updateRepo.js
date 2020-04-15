module.exports = async(octokit, org, repo) => {
  await octokit.repos.replaceAllTopics({
    owner: org,
    repo,
    names: ['aiid205245'],
  });

  await octokit.teams.addOrUpdateRepoInOrg({
    org,
    team_slug: 'reuters-graphics',
    owner: org,
    repo,
    permission: 'admin',
  });
};
