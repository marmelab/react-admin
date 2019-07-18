import decodeJwt from "jwt-decode";
import {
  AUTH_CHECK,
  AUTH_ERROR,
  AUTH_GET_PERMISSIONS,
  AUTH_LOGIN,
  AUTH_LOGOUT
} from "react-admin";
require('es6-promise').polyfill();
require('isomorphic-fetch');

// authUrl = "http://localhost:3002/rpc/login";
export default authUrl => async (type, params) => {
  // logout
  if (type === AUTH_LOGOUT) {
    localStorage.removeItem("token");
    return Promise.resolve();
  }
  // auth error
  if (type === AUTH_ERROR) {
    const status = params.status;
    if (status !== 200) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  }
  // login
  if (type === AUTH_LOGIN) {
    const { username, password } = params;
    const request = new Request(authUrl, {
      method: "POST",
      body: JSON.stringify({  username, password }),
      headers: new Headers({ "Content-Type": "application/json" })
    });
    const response = await fetch(request);
    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.statusText);
	}
	// json()
	const responseJson = await response.json();
	// token
	const token = responseJson[0].token;
	// decode JWT
	const decodedToken = decodeJwt(token);
	// set local storage
    localStorage.setItem("token", token);
	localStorage.setItem("role", decodedToken.role);
	
	// reponse json()
    return responseJson;
  }
  // called when the user navigates to a new location
  if (type === AUTH_CHECK) {
    return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
  }
  // get permissions
  if (type === AUTH_GET_PERMISSIONS) {
    //     const role = localStorage.getItem('role');
    //     return role ? Promise.resolve(role) : Promise.reject();
    return Promise.resolve();
  }

  return Promise.reject("Unknown method");
};
