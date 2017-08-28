const errorMessage = component => `
    You specified a function as the child of the ${component} component. 
    This requires you to set up an authClient as well.
    See the documentation: https://marmelab.com/admin-on-rest/Authorization.html
`;

export default errorMessage;
