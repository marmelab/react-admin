const GITHUB_API_URL = 'https://api.github.com/repos/marmelab/react-admin';

const getGithubStats = () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const request = new Request(GITHUB_API_URL, {
        headers,
    });

    return fetch(request).then(response => response.json());
};

getGithubStats().then(({ stargazers_count }) => {
    document.getElementById('github-stars-content').innerText = stargazers_count;
});
