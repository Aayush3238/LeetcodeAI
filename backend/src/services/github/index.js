const GITHUB_API_URL = "https://api.github.com";

const HEADERS = (token) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "User-Agent": "LeetCoach-AI",
});

async function githubFetch(endpoint, token) {
  const res = await fetch(`${GITHUB_API_URL}${endpoint}`, {
    headers: HEADERS(token),
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

class GitHubService {
  async getProfile(token) {
    return githubFetch("/user", token);
  }

  async getRepos(token, page = 1, perPage = 30) {
    return githubFetch(`/user/repos?sort=updated&per_page=${perPage}&page=${page}`, token);
  }

  async getRepoLanguages(token, owner, repo) {
    return githubFetch(`/repos/${owner}/${repo}/languages`, token);
  }

  async getRepoStats(token, owner, repo) {
    const [repoData, languages, commits, prs] = await Promise.all([
      githubFetch(`/repos/${owner}/${repo}`, token),
      this.getRepoLanguages(token, owner, repo).catch(() => ({})),
      githubFetch(`/repos/${owner}/${repo}/commits?per_page=1`, token).then((d) => d.length).catch(() => 0),
      githubFetch(`/repos/${owner}/${repo}/pulls?state=all&per_page=1`, token).then((d) => d.length).catch(() => 0),
    ]);

    return {
      name: repoData.name,
      fullName: repoData.full_name,
      description: repoData.description,
      url: repoData.html_url,
      language: repoData.language,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      issues: repoData.open_issues_count,
      topics: repoData.topics || [],
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
      languages,
    };
  }

  async getContributionStats(token) {
    const profile = await this.getProfile(token);
    const repos = await this.getRepos(token, 1, 100);

    const languageStats = {};
    let totalStars = 0;
    let totalForks = 0;

    for (const repo of repos) {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;

      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
      }
    }

    const languages = Object.entries(languageStats)
      .map(([name, count]) => ({ name, count, percentage: Math.round((count / repos.length) * 100) }))
      .sort((a, b) => b.count - a.count);

    return {
      username: profile.login,
      name: profile.name,
      avatar: profile.avatar_url,
      publicRepos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      totalStars,
      totalForks,
      languages,
      topRepos: repos.slice(0, 5).map((r) => ({
        name: r.name,
        fullName: r.full_name,
        description: r.description,
        url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        updatedAt: r.updated_at,
      })),
    };
  }
}

module.exports = new GitHubService();
