// finalBasePath will be a string (with no starting or ending forward slashes)
const formatBasePath = basePath => {
    // ensure basePath exists and is a string
    if (typeof basePath !== 'string') return ''
    // ensure basePath is not empty
    if (!basePath.length) return ''
    // ensure basePath does not start with a '/'
    if (basePath.length == 1 && basePath.charAt(0) == '/') return ''
    if (basePath.length > 1 && basePath.charAt(0) == '/') basePath = basePath.substring(1, basePath.length)
    // ensure basePath does contain a trailing '/'
    if (basePath.length > 1 && basePath.slice(-1) == '/') basePath = basePath.substring(0, basePath.length - 1)
    return basePath
}
export default formatBasePath
