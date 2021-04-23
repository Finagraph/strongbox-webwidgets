/*
 * IMPORTANT: This sample illustrates making calls to the Strongbox service to 
 * generate secure access tokens.  The following constants are defined below: clientId
 * and clientSecret. You will need to provide the values that have been assigned for your
 * organization.    DO NOT EXPOSE THOSE CREDENTIALS AS IS DONE IN THIS DEMONSTRATION APP.
 * THOSE CREDENTIALS SECURE YOUR ACCESS TO STRONGBOX AND ANYONE WHO POSSESSES THEM CAN
 * ACCESS STRONGBOX ON YOUR BEHALF.   THE CODE SHOWN BELOW FOR CREATING SECURITY TOKENS 
 * SHOULD BE EXECUTED ON A SERVER OWNED BY THE PARTNER WHERE SECURE ACCESS TO CREDENTIALS
 * CAN BE PROVIDED SUCH AS THROUGH MICROSOFT AZURE KEYVAULT OR SIMILAR SERVICES.
 * 
 * IMPORTANT: A couple values need to be replaced in this file.  Search for 'TODO'.
 * 
 * This sample code demonstrates how to use the Strongbox FinConnect react component
 * that guides a user through the process of connecting Strongbox to their accounting
 * system such that it can gather their financial information from the accounting 
 * system and provide analysis of that data to a financial institution partnered with
 * Finagraph.
 * 
 * The process is straight-forward and divided in to two parts. The first step is to 
 * generate an access token.  This token is generated for an organization that has partnered
 * with Finagraph and has received a carefully guarded clientId and clientSecret that
 * identifies the partner to Strongbox.
 * 
 * In the code below 'componentDidMount' is devoted exclusively to this first step. Once you
 * add your partner credentials, it uses those to generate an access token and once generated 
 * stores it in state for the App component.  That code has a number of 'console.log' messages 
 * sprinkled throughout so you can follow the progress in the browser developer tools.
 * 
 * The second step is to simply include the React component in your code.  The render method 
 * is devoted to showing what a simple credit application with the Strongbox React component 
 * might look like.  When the user presses the button to connect their financial records they
 * are allowed to choose from the supported accounting packages and connect Strongbox
 * to their financial records.
 * 
 * The majority of the code in render is devoted to showing a sample application.  
 * The 'StrongboxFinConnect' component is imported from the component module and completely contained
 * within <StrongboxFinConnect... in render.
 * 
 * In this sample application the react component is not displayed until a delegated access
 * token has been created and is simply not present. An actual consumer is of course free to 
 * do this as well or show something that indicates it's loading, etc.
 * 
 * ----------------- Branding and Customization ------------------------
 * 
 * These are fully detailed in the ReadMe for the Strongbox React component but warrant a quick
 * mention here.  These are both optional.
 * 
 * You can override most of the colors and appearance of UI elements in the component.  This is
 * accomplished by passing the optional 'theme' property to the component.  It's an object that has
 * a number of members related to the appearance of the component, for example, colors (palette).  
 * An example would be:
 * 
 * theme={{
 *      palette: {
 *          windowBackground: '#d0d0d0',
 *          controlBackground: '#000000',
 *      }
 * }}     
 * 
 * As you might guess, this would result in the main window background being gray and the background
 * of user input controls like buttons being black.
 * 
 * The consumer of the component has some control over most of the colors, font parameters and some 
 * elements of appearance such as the radius of elements like buttons.
 * 
 * For experimenting with appearance, for example color, you can try this sample theme. You can just 
 * be able to cut and paste this as a prop following the strongboxUri prop on <StrongboxFinConnect... 
 * below and see what the effect is:
 * 
                    theme={{
                        palette: {
                            windowBackground: '#d0d0d0',
                            borrowerInteractionBackground: '#d0d0d0',
                            controlBackground: '#000000',
                            controlForeground: '#fff',
                            modalBackground: '#d0d0d0',
                            modalText: '#fff',
                            modalTitle: '#fff',
                            progressBarForeground: '#fff',
                        },
                        font: {
                            family: 'courier',
                            controlSize: '16px',
                            size: '16px',
                            size_h1: '24px',
                            modalFamily: 'courier',
                            modalTitleSize: '24px',
                        },
                        container: {
                            paddingLeft: '100px',
                        },
                        controls: {
                            borderRadius: '10px',
                        }
                    }}

 * All of the fields shown above are optional.  If no value is provided the default value will be
 * provided so fox example the following would be completely valid and only effect the font  family
 * 
 * theme = {{
 *      font: {
 *          family: 'mistral',
 *      }
 * }}
 * 
 * You also have control over some of the content that appears on the various steps in the component.
 * If you notice within the included component below, it has children. In this sample, that is specifically
 *
 * {(props) => {
 *      return undefined;
 * }}
 *
 * 'props' has a member called step that describes what step is being rendered.  If any value other than
 * undefined is returned, that content will replace the default content.
 *
 * For experimenting with content you can try the sample below.  In the sample code where 
 * it returns undefined under <StrongboxFinConnect, you can replace that code with the following snippet.
 * to observe the effect.
 * 
                    {(props) => {
                        if (props.step === BorrowerSteps.choosePackage) {
                            return (
                                <div style={{ marginTop: '15px' }}>
                                    <p>Submitting your documents to us electronically will</p>
                                    <p>really make it faster and easier to process your application</p>
                                </div>
                            );
                        } else if (props.step === BorrowerSteps.progress) {
                            return (
                                <div>
                                    <p>Setting up a secure connection to our servers</p>
                                    <p>We'll be getting back to you shortly</p>
                                </div>
                            )
                        } else if (props.step === BorrowerSteps.congratulations) {
                            return (
                                <p>You're all done.  Thank you for considering us.</p>
                            )
                        } else {
                            return undefined;
                        }
                    }}
 */

import logo from './logo.svg';
import './App.css';

import React from 'react';

import StrongboxFinConnect from '@finagraph/finconnect-react';

/*
 * TODO Insert your API credentials below (clientId and clientSecret).
 * As sample code this is alright but your actual clientSecret needs to be
 * kept absolutely secret and not exposed in client side Javascript.  Probably
 * something that is obvious but doesn't hurt to mention it!
 * 
 * AGAIN, DO NOT PUT THESE VALUES IN CLIENT-SIDE JAVASCRIPT FOR PRODUCTION USE.
*/
const clientId = "<YOUR CLIENT ID>";
const clientSecret = "<YOUR CLIENT SECRET>";

/**
 * TODO Specify a 'partnerName' that identifies your organization to the user of the widget.
 * For example, the 'partnerName' appears in the sentence "{partnerName} uses Strongbox to link your accounting system"
*/
const partnerName = "{YOUR NAME}";

/*
 * TODO - Specify an orgId and orgName
 * To initialize the React component, you will also need to pass an identifier for the Organization
 * for which an Accounting System is being connected, as well as a friendly name for that Organization.
 * Typically, you would want to use an identifier for the Organization as stored in your own system. The maximum allowed length for the id is 128 characters, and it may only contain the following characters: 'a-z', 'A-Z', '0-9', '-', '_', '|'.
 * The name for the Organization that is provided to the Widget is the name that will appear in the Strongbox Financial Portal business list.
 */
const orgId = "<AN ID FOR THE ORGANIZATION CONNECTING AN ACCOUNTING SYSTEM>";
const orgName = "<A NAME FOR THE ORGANIZATION>";

class App extends React.Component {
    strongboxAuthUrl = "https://auth.strongbox.link";

    constructor(props) {
        super(props);

        this.state = {
            authorizationObject: undefined,
        };
    }

    componentDidMount() {

        /*
         * To initialize the React Component <StrongboxFinConnect /> you will first need to obtain an access token that is safe to use from client-side code.
         * Obtaining that access token is a two step process that should be done server-side.  
         * 1) Send a POST request to /v1/token using your ClientId and ClientSecret to obtain an access token. This access token represents your full access to the Strongbox APIs.
         * 2) Send a POST request to /v1/DelegatedAccessTokens in order to exchange the access token that you aquired in step 1) for an access token that has very limited API access, designed specifically for powering this front-end component.
         * 
         * The second request includes an 'ActorId' parameter, which should be the identifier that you've assigned to the Organization for which an Accounting System is being connected.
         * 
         * Both requests are to be sent to 'https://auth.strongbox.link'
         * 
         * The following example code demonstrates the two requests that should be made, server-to-server, to aquire the access token that will be used to initialize the React Components.
         */

        const tokenHeaders = new Headers();

        tokenHeaders.append("Authorization", "Basic " + btoa(clientId + ":" + clientSecret));
        tokenHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        tokenHeaders.append("Cache-Control", "no-cache");

        const tokenRequestBody = "grant_type=client_credentials";

        const tokenFetchRequest = {
            method: "POST",
            headers: tokenHeaders,
            body: tokenRequestBody
        }

        try {
            console.log('Executing fetch call to receive access token for use with Strongbox');

            fetch(`${this.strongboxAuthUrl}/v1/token`, tokenFetchRequest)
                .then(r => {
                    if (r.ok) {
                        return r.json()
                    }
                    console.log("An error occurred requesting an access token for Strongbox.");
                    console.log(r.statusText);
                })
                .then(authResponse => {
                    console.log("Response received for requesting a Strongbox access token");
                    console.log(authResponse); // please do NOT log your access tokens. this is just example code. thanks!

                    /*
                     * At this point authResponse has an access token that can be used to 
                     * retrieve the delegated access token, which is suitable for use within the Strongbox React
                     * component.
                     */

                    const delegatedAuthHeaders = new Headers();
                    delegatedAuthHeaders.append("Authorization", "Bearer " + authResponse.access_token);
                    delegatedAuthHeaders.append("Content-Type", "application/json");
                    delegatedAuthHeaders.append("Cache-Control", "no-cache");
                    delegatedAuthHeaders.append("accept", "application/json");

                    const delegatedAuthRequestBody = {
                        "actorId": orgId,
                        "purpose": ["ConnectAccountingSystem"],
                    };

                    const delegatedAuthFetchRequest = {
                        method: "POST",
                        headers: delegatedAuthHeaders,
                        body: JSON.stringify(delegatedAuthRequestBody)
                    }
                    try {
                        console.log("Executing fetch call to generate a delegated access token");

                        fetch(`${this.strongboxAuthUrl}/v1/DelegatedAccessTokens`, delegatedAuthFetchRequest)
                            .then(r => {
                                if (r.ok) {
                                    return r.json();
                                }
                                console.log("An error occurred generating a delegated access token");
                                console.log(r.statusText);
                            })
                            .then(delegatedTokenResponse => {
                                console.log("response for delegated access token request received");
                                console.log(delegatedTokenResponse);// please do NOT log your access tokens. this is just example code. thanks!

                                /*
                                 * Sets the state variable passed to the Strongbox component that
                                 * allows it to connect with an acccounting package.  In this sample
                                 * application, this will also result in the component being visible.
                                 */

                                this.setState({
                                    authorizationObject: delegatedTokenResponse
                                });
                            });
                    } catch (delegatedAccessException) {
                        console.log('Exception requesting a delegated access token');
                        console.log(delegatedAccessException);
                    }
                });
        } catch (authException) {
            console.log("Exception requesting an access token from Strongbox");
            console.log(authException);
        }
    }

    /*
     * Right on, you've got everything you need to use the React Component (<StrongboxFinConnect />). Example below:
     * 
     * Notice the optional property 'onJobCreated.'  When the user has selected an accounting package, logged in
     * and we have begun extracting their financial information to generate an Excel spreadsheet, this function
     * is invoked, if provided.  It receives an id that you can use to poll the status of the job that has just been started.
     * For instance, if you want to download the spreadsheet from Strongbox storage as soon as it is available,  you 
     * can use this id with the Strongbox APIs to know when the job has finished and thus the spreadsheet is available.
     */

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to the Strongbox Financial Portal</h2>
                </div>
                <div className="App-body">
                    <label className="Std-label" for="fname">First name:</label>
                    <input className="Std-input" type="text" id="fname" name="fname" /><br />
                    <label className="Std-label" for="lname">Last name:</label>
                    <input className="Std-input" type="text" id="lname" name="lname" /><br />
                    <label className="Std-label" for="businessName">Business name:</label>
                    <input className="Std-input" type="text" id="businessName" name="businessName" /><br />
                    <label className="Std-label" for="businessEmail">Business email:</label>
                    <input className="Std-input" type="text" id="businessEmail" name="businessEmail" /><br />
                    <label className="Std-label" for="requestedAmt">Loan amount requested:</label>
                    <input className="Std-input" type="text" id="requestedAmt" name="requestedAmt" /><br /><br />
                    <label className="Std-label" for="whatFor">What will you be using these funds for:</label><br />
                    <input className="Std-input" type="text" id="WhatFor" name="WhatFor" /><br />
                    <p style={{ marginLeft: '10px', marginTop: '20px' }}>Required Documents:</p><br />
                    <div style={{ marginLeft: '25px ' }}>
                        <span>To review your loan application, we require the following:</span><br />
                        <ul>
                            <li>Last year's balance sheet and profit & loss statement</li>
                            <li>Last month's balance sheet</li>
                            <li>This year's (YTD) profit & loss statement</li>
                            <li>Last 3 months bank statements</li>
                        </ul>
                    </div>
                    <p style={{ marginTop: '25px', marginLeft: '10px ' }}>Your review will be faster if you link your accounting system directly with our platform.</p>
                </div>
                <StrongboxFinConnect
                    orgId={orgId}
                    orgName={orgName}
                    partnerName={partnerName}
                    accessToken={this.state.authorizationObject}
                    onJobCreated={(financialRecordId) => { console.log(`An import job has been created, id = ${financialRecordId}`); }}
                >
                    {(props) => {
                        return undefined;
                    }}
                </StrongboxFinConnect>
            </div>
        );
    }
}

export default App;
