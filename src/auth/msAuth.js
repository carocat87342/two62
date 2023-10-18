import * as Msal from "msal";
// if using cdn version, 'Msal' will be available in the global scope
export const msalConfig = {
    auth: {
        clientId: process.env.MSAL_CLIENT_ID
    },
};
const msalInstance = new Msal.UserAgentApplication(msalConfig);
msalInstance.handleRedirectCallback((error, response) => {
    // handle redirect response or error
});
var loginRequest = {
    scopes: ["user.read", "calendars.readwrite"],
};

const getToken = async () => {
    if (!msalInstance.getAccount()) {
        return "";
    }
    var tokenRequest = {
        scopes: ["user.read", "mail.send"],
    };
    console.log("XXXXXX");
    try {
        msalInstance
            .acquireTokenSilent(tokenRequest)
            .then(response => {
                alert();
                // get access token from response
                // response.accessToken
            })
            .catch(err => {
                // could also check if err instance of InteractionRequiredAuthError if you can import the class.
                console.log(err.name);
                if (err.name === "InteractionRequiredAuthError") {
                    return msalInstance
                        .acquireTokenPopup(tokenRequest)
                        .then(response => {
                            console.log(response);
                        })
                        .catch(err => {
                            // handle error
                            console.log("final error", err);
                            msSignIn();
                        });
                }
            });
    } catch (silentError) {
        console.log(silentError);
        if (silentError instanceof msal.InteractionRequiredAuthError) {
            console.log(silentError);
            const interactiveResult = await msalInstance.acquireTokenPopup(tokenRequest);
            return interactiveResult.accessToken;
        } else {
            console.log(silentError);
            throw silentError;
            return "";
        }
    }
};
// // Initialize the Graph client
export const loginWithMsal = async () => {
    return new Promise((resolve, reject) => {
        msalInstance.loginPopup(loginRequest).then(res => {
            console.log(res)
            getAccessToken().then((accessToken) => {
                resolve(res)
            })
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
}
const getAccessToken = () => {
    return new Promise((resolve, reject) => {
        if (msalInstance.getAccount()) {
            msalInstance.acquireTokenSilent(loginRequest)
                .then(response => {
                    sessionStorage.setItem("msal.accessToken", response.accessToken)
                    resolve(response.accessToken)
                })
                .catch(err => {
                    // could also check if err instance of InteractionRequiredAuthError if you can import the class.
                    if (err.name === "InteractionRequiredAuthError") {
                        return msalInstance.acquireTokenPopup(loginRequest)
                            .then(response => {
                                // get access token from response
                                // response.accessToken
                                sessionStorage.setItem("msal.accessToken", response.accessToken)
                                resolve(response.accessToken)
                            })
                            .catch(err => {
                                reject(err)
                            });
                    }
                });
        } else {
            reject(err)
        }
    })

}
export const addOutlookCalendarEvent = async event => {
    const token = sessionStorage.getItem('msal.accessToken')
    if (!token) {
        getAccessToken();
    }
    const authProvider = {
        getAccessToken: () => {
            return token;
        },
    };
    const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });
    try {
        return graphClient.api("/me/events").post(event);
    } catch (error) {
        console.error(error);
    }

    // if (msalInstance.getAccount()) {
    //     msalInstance
    //         .acquireTokenSilent(loginRequest)
    //         .then(response => {
    //             console.log("token Successed", response);
    //             const token = response.accessToken;
    //             const authProvider = {
    //                 getAccessToken: () => {
    //                     return token;
    //                 },
    //             };
    //             const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });
    //             try {
    //                 return graphClient.api("/me/events").post(event);
    //             } catch (error) {
    //                 console.error(error);
    //             }
    //         })
    //         .catch(err => {
    //             // could also check if err instance of InteractionRequiredAuthError if you can import the class.
    //             if (err.name === "InteractionRequiredAuthError") {
    //                 return msalInstance
    //                     .acquireTokenPopup(loginRequest)
    //                     .then(response => {
    //                         // get access token from response
    //                         // response.accessToken
    //                         const token = response.accessToken;
    //                         console.log(token);
    //                         const authProvider = {
    //                             getAccessToken: () => {
    //                                 // Call getToken in auth.js
    //                                 return token;
    //                             },
    //                         };
    //                         const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });
    //                         try {
    //                             graphClient.api("/me/events").post(event);
    //                             getEvents();
    //                         } catch (error) {
    //                             console.error(error);
    //                         }
    //                     })
    //                     .catch(err => {
    //                         // handle error
    //                     });
    //             }
    //         });
    // } else {
    //     // user is not logged in, you will need to log them in to acquire a token
    // }
};
