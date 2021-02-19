const GITHUB_API_URL = "https://api.github.com/graphql";
const GITHUB_TOKEN = "4d25420927934f6bf6345d86627d8645e52038fb";

const GITHUB_QUERY = `query {
  stats: repository(owner:"marmelab" name:"react-admin"){
    stargazers{totalCount}
  }
}`;

const getGithubStats = () => {
  const headers = new Headers();
  headers.append("Authorization", `bearer ${GITHUB_TOKEN}`);
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const request = new Request(GITHUB_API_URL, {
    headers,
    method: "POST",
    body: JSON.stringify({ query: GITHUB_QUERY }),
  });

  return fetch(request).then((response) => response.json());
};

getGithubStats().then(({ data }) => {
  document.getElementById("github-stars-content").innerText =
    data.stats.stargazers.totalCount;
});
