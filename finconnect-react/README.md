# Overview

This package contains a component that makes it simple for a consuming application to use Finagraph Strongbox for connecting with a customer's accounting system such that the providers of the consuming application can benefit from the strong analysis and SDK provided by Strongbox for interacting with this data.

This document assumes and in fact requires some familiarity with the Finagraph Strongbox SDK (SDK). To fully use the component, you will need to register as an SDK customer and be in possession of a Client ID and Secret that allow the component to interact with the SDK on your
behalf.

More information about the SDK can be found in [Strongbox Developer Portal](https://developer.strongbox.link)

# Getting started

This document assumes that you have the [Demo Application](../finconnect-react-demo) that demonstrates using the Strongbox react component.   The application is fully documented in comments and makes it very simple to understand how to use the SDK to generate security tokens required to use the component in addition to simply using the component.

Therefore, this document focuses primarily on a few details specific to using the component.
These are:

- Customizing which accounting packages are available.
- Theming or changing the appearance of the component such as which colors are used.
- Content Customization or changing the content of descriptions to be more specific to your company.

As with the basic use of the component, the easiest way to understand theming and content customization is to use the Sample Application.  The Sample Application includes a comment containing a sample theme and customized content you can try out to see how it affects the component.

# Using the component

Install the component into your project:

`npm install @finagraph/finconnect-react`

Import it into your application:

`import StrongboxFinConnect from '@finagraph/finconnect-react';`

Finally add it to your application's render function:

    <StrongboxFinConnect
        orgId={'<Provide an ID that uniquely identifies the end user to you>'}
        orgName={'<Provide a name that you will recognize>'}
        accessToken={<access token>}
        showConnectionDialog={<boolean>}
        onJobCreated={<function that receives a financialRecordId that identifies the job for importing financials and generating a spreadsheet>}
    >
        {(props) => {
            return undefined;
        }}
    </StrongboxFinConnect>

`orgId` is required.  This should be an ID that has meaning to your system.  If you wish to use Strongbox API's that allow you to, for example, access the Excel spreadsheet produced for a customer, you would identify the customer by this ID.  It is the key for your customer.

`orgName` is optional but recommended strongly.  If you plan to use the Finagraph Strongbox Lender Portal, this will be the name that shows up in the list of businesses that have linked financial information.  This is likely to be of much higher use to you than the ID which will be used if the name is not provided.

As mentioned earlier, details of obtaining the `accessToken` property are beyond the scope of this document and better understood by using the Strongbox Sample Application.

`disabled` is an optional property that will disable the component when it is in button mode, i.e. prior to the user clicking "Link With My AccountingPackage" to open the controls that allow them to load their financial data.

`showConnectionDialog` is an optional property that controls the first thing that happens when the user presses a button to connect to an accounting package.  By default, after pressing the button the user will be taken to a browser popup that allows them to enter their credentials for the accounting package.  If this value is true, the user will first be taken to a 'feel good' dialog that describes what's going on and gives them an accounting package specific button to launch into  the browser popup.

`onJobCreated` is an optional function.  The signature is as follows

`onJobCreated(financialRecordId: string): void;`

This component does not actually wait for a job to complete.  It can take a very long time and there is generally no reason for the user to wait for it to complete.  If you as the consumer of this functionality want to poll the status of the job to understand when it completes, you can use this id to do that.  For example, perhaps you want to copy the generated Excel spreadsheet out of Strongbox storage and place it into your own storage when the job is completed.  You can use this id to understand when the spreadsheet is ready.

# Customizing available accounting packages

By default, the `StrongboxFinConnect` component will show all the accounting packages it is capable of showing when the user chooses to connect with their accounting system. Further, for some packages that have multiple 'types' a small descriptor is shown under the package icon that describes specifically which package it applies to.  An example would be QuickBooks where the user may have either QuickBooks Online or QuickBooks Desktop.

The packages displayed and the descriptor that shows under the icons are configured through the `accountingPackages` property.

If no value is provided, all available accounting packages are shown using their default descriptors.

Use the `accountingPackages` property to configure which accounting packages are shown to the user and what descriptors are used. `accountingPackages` is an array of JSON objects. For Typescript users, the elements are of type `AccountingPackageToShow`. The full definition is as follows:

    type AccountingPackageToShow = {
        package: SupportedAccountingPackages;
        descriptor?: string;
    }

* `package` is the name of the package. SupportedAccountingPackages is a case-insensitive string with one of the following values:
    * QuickBooksOnline
    * Xero
* `descriptor` is the text to show below the icon for the package. If this value is not provided the default value is used.  Please note that undefined and empty string ("") are not equivalent.  If the package has a default descriptor and this value is undefined, the default descriptor is used. If the package has a default descriptor and this value is an empty string, the descriptor will be blank.


# Using the 'theme' property

The `StrongboxFinConnect` component has an optional property called theme. This is how
you pass settings that will change the appearance of the component.

The `theme` property is a JSON object.  The type for theme is exported from the module 
as `Theme`. The full definition is as follows:

    type Theme = {
        palette?: ThemePalette;
        font?: ThemeFont;
        container?: ThemeContainer;
        controls?: ThemeControls;
    }

- `palette` is used for changing the colors associated with various aspects of the component. 

- `font` is used for controlling various aspects of the fonts used within the component. For example, these settings allow for controlling aspects of the font used in the accounting package connection dialogs as opposed to the font used for describing what is happening during  a particular step.

- `container` is used for controlling aspects such as padding of the container that opens up when the user presses the button to link to a financial package. 

- `controls` is used for controlling the appearance of user input elements like buttons. This is limited at the moment providing only the ability to adjust the radius.

## ThemePalette

Controls what colors are used for various aspects of the component.

    type ThemePalette = {
        windowBackground?: string;
        borrowerInteractionBackground?: string;
        controlBackground?: string;
        controlForeground?: string;
        progressBarForeground?: string;
        modalBackground?: string;
        modalText?: string;
        modalTitle?: string;
    }

- `windowBackground` is the background color of the window that is exposed when the user clicks the button to link to an accounting package. There are actually two background colors.  This is the region surrounding the area where all the user interaction takes place, so essentially it is margin and any padding.
- `borrowerInteractionBackground` is the background color of the window containing the actual borrower interaction elements exposed within `windowBackground`.  
- `controlBackground, controlForeground` are used for the colors of input and information elements othe component other than simple text.  Buttons and progress bars for example. For progress bars, `controlForeground` is not used.  See `progressBarForeground`.
- `progressBarForeground` is used for the foreground color of progress bars.
- `modalBackground, modalText, modalTitle` control the colors used for the modal dialog that comes up when the user chooses to link to an accounting package.

## ThemeFont

defines the appearance of fonts in the component.

    type ThemeFont = {
        family?: string;
        size?: string;
        controlSize?: string;
        size_h1?: string;
        weight?: string;
        controlWeight?: string;
        weight_h1?: string;
        modalFamily?: string;
        modalTitleSize?: string;
        modalTitleWeight?: string;
        modalRegularSize?: string;
        modalRegularWeight?: string;
        modalSecuritySize?: string;
        modalSecurityWeight?: string;
    }

- `family` is the family of the font used throughout the component. This can be a value that you would use for font-family in CSS.
- `size, weight` are the size and font weight of common text such as that used to describe what's happening in a given step. These can be values you would use for font-size and font-weight in CSS.
- `controlSize, controlWeight` are the size and weight of fonts used within user input and information controls such as buttons. These can be values you would use for font-size and font-weight in CSS.
- `size_h1` is the size used for titles on the steps of the component.  So for example the title 'Securely Submit Financial Data' on the step where a user chooses an accounting package.  This can be a value you would use for font-size in CSS.
- `modalFamily` is the font family used in the modal dialog that comes up when the user chooses to link an accounting package. This can be a value that you would use for font family in CSS.
- `modalTitleSize, modalTitleWeight` are the size and weight of text used on the titles of the modal dialog that comes up when the user chooses to link an accounting package. These can be values you would use for font-size and font-weight in CSS.
- `modalRegularSize, modalRegularWeight` are the size and weight of text used in paragraphs on the modal dialog thatcomes up when the user chooses to link an accounting package. These can be values you would use for font-size and
font-weight in CSS.
- `modalSecuritySize, modalSecurityWeight` are the size and weight of text used in the text explaining to the borrower that their transaction is secure on the modal dialog that comes up when the user chooses to link an accounting package. These can be values you would use for font-size and font-weight in CSS.

## ThemeContainer

Defines aspects of the appearance of the region that contains the component when it opens up after the user has
pressed the button to link an accounting package.

    type ThemeContainer = {
        paddingLeft?: string;
        paddingTop?: string;
        paddingBottom?: string;
        paddingRight?: string;
        height?: string;
        width?: string;
    }

- `paddingLeft, paddingTop, paddingBottom, paddingRight` are values used for controlling the padding surrounding the area containing all of the text and user input used in the component.  These can be values used for padding in CSS.
- `height, width` are used for the dimensions of the container containing the text and user input used in the component. These can be values used for width and height in CSS.The default values are 'auto'.

## ThemeControls

Defines aspects of the user input elements displayed to the user in the component such as buttons and progress bars.

    type ThemeControls = {
        borderRadius?: string;
    }

-`borderRadius`The radius used on the borders of the elements.  This can be values used for border-radius in CSS.

# Content Customization

You can customize most of the content that appears during the various steps of the component. This would allow youto change the messsaging to be more specific to your organization for instance. 

A sample of using the component earlier in this document is:

    <StrongboxFinConnect
        orgId={'<Provide an ID that uniquely identifies the end user to you>'}
        orgName={'<Provide a name that you will recognize>'}
        accessToken={<access token>}
    >
        {(props) => {
            return undefined;
        }}
    </StrongboxFinConnect>

Content customization is accomplished by replacing the child block and returning something other than undefined. When `undefined` is returned default content is used. So for example if you replace it with:

    {(props) => {
            return (<p>I like pie.</p>);
    }}

The result would be that you would see "I like pie" on every step. Not it isn't likely that it would be tremendously useful to have the same content displayed on every step so there is a mechanism for handling this.  The type definitions for props are as follows:

    enum BorrowerSteps {
        choosePackage,
        configureAccounting,
        progress,
        qbdProgress,
        congratulations,
        linkQbdIntro,
        linkQbdOpenAndGrantAccess,
        linkQbdShare,
    }

    type SBLinkAccountingPackageChildProps = {
        step: BorrowerSteps;
        pctComplete?: number;
    };


As you might expect step is the current step the user is on.   pctComplete is valid when step is equal to 'progress' or 'qbdProgress'.  This helps you customize the content shown while the progress bar is moving.  A more realistic example for replacing this content would be:

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
 
