export default tokenJson => {
    const token = JSON.parse(tokenJson);
    const jwt = JSON.parse(window.atob(token.id_token.split('.')[1]));
    console.log(jwt)

    return { id: 'my-profile', ...jwt }
}
