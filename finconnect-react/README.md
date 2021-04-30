# Overview

This package contains a [React Component](https://github.com/Finagraph/strongbox-webwidgets/tree/master/finconnect-react) (Widget) that makes it simple for a consuming application to use Finagraph Strongbox for connecting to a customer's accounting system and securely importing information from multiple systems into a normalized model.  You can then benefit from the strong analysis and SDK provided by Strongbox for interacting with this data.

This document assumes and in fact requires some familiarity with the Finagraph Strongbox SDK (SDK).  To fully use the Widget, you will need to register as an SDK customer and be in possession of a Client ID and Secret that allow the Widget to interact with the SDK on your behalf.

More information about the SDK can be found in [Strongbox Developer Portal](https://developer.strongbox.link/guides.html#getting-started)

# Getting started

This document assumes that you have the [Strongbox Sample Application](https://github.com/Finagraph/strongbox-webwidgets/tree/master/finconnect-react-demo) that demonstrates using the Strongbox React Widget.  In addition to simply illustrating how to use the Widget, the Sample Application is fully documented in comments and clearly demonstrates how to use the SDK  to generate security tokens required to use the Widget.

This is by far the easiest way to get started using the Widget.  If you don't already have the Sample Application, you can download it [here](https://github.com/Finagraph/strongbox-webwidgets/tree/master/finconnect-react-demo).

Therefore, this document focuses primarily on a few details specific to using the Widget. These are:

- Using general options that control what financial data is imported.
- Customizing the accounting packages that are available to the end user.
- Theming or changing the appearance of the Widget such as which colors are used.
- Content Customization or changing the content of descriptions to be more specific to your company.

As with the basic use of the Widget, the easiest way to understand theming and content customization is to use the Sample Application.  The Sample Application includes a comment containing a sample theme and customized content that you can experiment with to see how the Widget is affected.

# Using the Widget

Install the Widget into your project:

First you will need to modify .npmrc with the following line:

`@finagraph:registry=https://booyami.pkgs.visualstudio.com/d686db0f-7565-40b7-b98e-8e7dd2124506/_packaging/FinagraphPublic%40Local/npm/registry/`

Then execute the following:

`npm install @finagraph/strongbox-react`

<aside>
We are in the process of moving the Strongbox Widget to the public NPM registry. That will be completed shortly at which time it will no longer be necessary to modify .npmrc or prefix the package name with '@finagraph/'
</aside>

Import it into your application:

`import Strongbox from '@finagraph/strongbox-react';`

Finally add it to your application's render function:
```
    <Strongbox
        accessToken={<access token>}
        disabled={<boolean>}
        language={'<language code'>}
        orgId={'<Provide an ID that uniquely identifies the end user to you>'}
        orgName={'<Provide a name that you will recognize>'}
        onJobCreated={<function that receives a financialRecordId that identifies the job for importing financials and generating a spreadsheet>}
        partnerName={<Consumer's (i.e. your) organization name.) For example, 'XYZ Bank'>}
        showConnectionDialog={<boolean>}
        financialImportOptions={see below}
    >
        {(props) => {
            return undefined;
        }}
    </Strongbox>
```
| Property | Required | Description |
|--|--|--|
| accessToken | true | As mentioned earlier, details of obtaining the `accessToken` property are beyond the scope of this document and better understood by using the Strongbox Sample Application.
| disabled | false | Disable the Widget when it is in button mode, i.e. prior to the user clicking "Link With My AccountingPackage" to open the controls that allow them to load their financial data.
| language | false |an ISO 639-1 language code. Any value is accepted, however, the only supported languages at present are Spanish and English. Each language has only one variant supported so 'es-ar' and 'es-bo' for instance, result in the same content being shown. <br/> Values recognized: <ul><li> Spanish: 'es'</li><li>English: 'en'</li></ul><br/>If the language code is not supported or not provided, English is used.
| orgId | true | This should be an ID that has meaning to your system.  If you wish to use Strongbox API's that allow you to, for example, access the Excel spreadsheet produced for a customer, you would identify the customer by this ID.  It is the key for your customer.
| orgName | false |  If you plan to use the Finagraph Strongbox Lender Portal, this will be the name that shows up in the list of businesses that have linked financial information.  This is likely to be of much higher use to you than the ID which will be used if the name is not provided.
| onJobCreated | false | A function with the following signature: <br/><br/>```onJobCreated(financialRecordId: string): void;```<br/><br/>The Widget does not actually wait for a job to complete.  It can take a very long time and there is generally no reason for the user to wait for it to complete.  If you as the consumer of this functionality want to poll the status of the job to understand when it completes, you can use this id to do that.  For example, perhaps you want to copy the generated Excel spreadsheet out of Strongbox storage and place it into your own storage when the job is completed.  You can use this id to call an SDK API that will let you know if the spreadsheet is ready.
| partnerName | true | This is different than orgName, this is the name of your organization and will show up in the terms of use.   So for example, if you are writing an app for 'XYZ Bank' and consuming this Widget you would pass in 'XYZ Bank' for this property.
| showConnectionDialog | false | Controls the first thing that happens when the user presses a button to connect to an accounting package.  By default, after pressing the button the user will be taken to a browser popup that allows them to enter their credentials for the accounting package.  If this value is true, the user will first be taken to a 'feel good' dialog that describes what's going on and gives them an accounting package specific button to launch into the browser popup.
| financialImportOptions | false | Controls certain parameters related to the importing of financial data.  If this value is not provided, default values are used.  Specifically, financial data imported will be for 2 fiscal years ending at the most recent full month and if a financial workbook is generated, customers and vendors will be anonymized.<br/><br/>It is defined [here](#financialimportoptions) and exported as type `FinancialImportOptions` for typescript users.

###  FinancialImportOptions

```
type FinancialImportOptions = {       
	mostRecentMonth?: {
		month: number;
		year: number;
	};
	anonymizeCustomersAndVendors: boolean;
	financialStatementsPeriod?: {
		reportingPeriod: "Months" | "FiscalQuarters" | "FiscalYears";
		numberOfPeriods: number;
	},
	transactionsPeriod?: {
		reportingPeriod: "Months" | "FiscalQuarters" | "FiscalYears";
		numberOfPeriods: number;
	},
	payablesPeriod?: {
		reportingPeriod: "Months" | "FiscalQuarters" | "FiscalYears";
		numberOfPeriods: number;
	},
	receivablesPeriod?: {
		reportingPeriod: "Months" | "FiscalQuarters" | "FiscalYears";
		numberOfPeriods: number;
	}
```
| Property | Required  | Description |
|--|--|--|
| mostRecentMonth | false  | Controls the last full month for which accounting data will be gathered. The date it represents should be no greater than the most recent full month, e.g. if it's April 17 2021, this date should be no greater than March 2021. If it is not provided, the latest full month is used, March in the preceding example.<br/><ul><li>month is required if mostRecentMonth is provided and represents the 0 based month, i.e. January = 0 and December = 11.</li><li>year is required if mostRecentMonth is provided and is simply the full year, e.g. 2021.</li></ul>
| anonymizeCustomersAndVendors| false | If a financial workbook is generated as a result of this import, should the customer and vendor names contained in the workbook be anonymized.
| financialStatementsPeriod<br/>transactionsPeriod<br/>payablesPeriod<br>receivablesPeriod | false | These values control how much data to import for their respective types (financial statements, transactions, payables and receivables.)  These values are reasonably self-explanatory but are more fully discussed in the [SDK documentation](https://developer.strongbox.link/guides.html#tocs_accountingimportoptions).<br/><br/>If any of these values are not provided, the corresponding financial data type will *NOT* be imported.

# Customizing available accounting packages

By default, the `Strongbox` Widget will show all the accounting packages it is capable of showing when the user chooses to connect with their accounting system. Further, for some packages that have multiple 'types' a small descriptor is shown under the package icon that describes specifically which package it applies to.  An example would be QuickBooks where the user may have either QuickBooks Online or QuickBooks Desktop.

The packages displayed and the descriptor that shows under the icons are configured through the `accountingPackages` property.

If no value is provided, all available accounting packages are shown using their default descriptors.

Use the `accountingPackages` property to configure which accounting packages are shown to the user and what descriptors are used.   `accountingPackages` is an array of JSON objects. For Typescript users, the elements are of type `AccountingPackageToShow`. The full definition is as follows:

    type AccountingPackageToShow = {
        package: SupportedAccountingPackages;
        descriptor?: string;
    }
| Property | Required  | Description
|--|--|--|
| package | true | Name of the accounting package.  This is a case-insensitive string with one of the following values:<ul><li>QuickBooksOnline</li><li>QuickBooksDesktop</li></ul>
| descriptor | false | The text to show below the icon for the package. If this value is not provided the default value is used.  Please note that undefined and empty string ("") are not equivalent.  If the package has a default descriptor and this value is undefined, the default descriptor is used. If the package has a default descriptor and this value is an empty string, the descriptor will be blank.

# Using the 'theme' property

The `Strongbox` Widget has an optional property called theme. This is how you pass settings that will change the appearance of the Widget.

The `theme` property is a JSON object.  The type for theme is exported from the module as `Theme`. The full definition is as follows:

    type Theme = {
        palette?: ThemePalette;
        font?: ThemeFont;
        container?: ThemeContainer;
        controls?: ThemeControls;
    }

| Property | Required  | Description |
|--|--|--|
| [palette](#themepalette) | false | Used for changing the colors associated with various aspects of the Widget. 
| [font](#themefont) | false | Controls various aspects of the fonts used within the Widget. For example, these settings allow for controlling aspects of the font used in the accounting package connection dialogs as opposed to the font used for describing what is happening during a particular step.
| [container](#themecontainer) | false | Controls aspects such as padding of the container that opens up when the user presses the button to link to a financial package. 
| [controls](#themecontrols) | false | Controls the appearance of user input elements like buttons. This is limited at the moment providing only the ability to adjust the radius.

## ThemePalette

Controls what colors are used for various aspects of the Widget.

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
| Property | Required  | Description |
|--|--|--|
| windowBackground | false | The background color of the window that is exposed when the user clicks the button to link to an accounting package. There are actually two background colors.  This is the region surrounding the area where all the user interaction takes place, so essentially it is margin and any padding.
| borrowerInteractionBackground | false | the background color of the window containing the actual borrower interaction elements exposed within `windowBackground`.
| controlBackground, controlForeground | false | Used for the colors of input and information elements on the Widget other than simple text.  Buttons and progress bars for example.  For progress bars, `controlForeground` is not used.  Use `progressBarForeground` instead.
| progressBarForeground | false | The foreground color of progress bars.
| modalBackground, modalText, modalTitle | false | The colors used for the modal dialog that comes up when the user chooses to link to an accounting package.

## ThemeFont

defines the appearance of fonts in the Widget.

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
    
| Property | Required  | Description |
|--|--|--|
| family  | false | Family of the font used throughout the Widget. This can be a value that you would use for font-family in CSS.
| size, weight | false  | The size and font weight of common text such as that used to describe what's happening in a given step. These can be values you would use for font-size and font-weight in CSS.
| controlSize, controlWeight | false | The size and weight of fonts used within user input and information controls such as buttons. These can be values you would use for font-size and font-weight in CSS.
| size_h1 | false | The size used for titles on the steps of the Widget.  So for example the title 'Securely Submit Financial Data' on the step where a user chooses an accounting package.  This can be a value you would use for font-size in CSS.
| modalFamily | false  | The font family used in the modal dialog that comes up when the user chooses to link an accounting package. This can be a value that you would use for font-family in CSS.
| modalTitleSize, modalTitleWeight | false | The size and weight of text used on the titles of the modal dialog that comes up when the user chooses to link an accounting package. These can be values you would use for font-size and font-weight in CSS.
| modalRegularSize, modalRegularWeight | false | The size and weight of text used in paragraphs on the modal dialog that comes up when the user chooses to link an accounting package. These can be values you would use for font-size and font-weight in CSS.
| modalSecuritySize, modalSecurityWeight | false | the size and weight of text used in the text explaining to the borrower that their transaction is secure on the modal dialog that comes up when the user chooses to link an accounting package. These can be values you would use for font-size and font-weight in CSS.

## ThemeContainer

Defines aspects of the appearance of the region that contains the Widget when it opens up after the user has pressed the button to link an accounting package.

    type ThemeContainer = {
        paddingLeft?: string;
        paddingTop?: string;
        paddingBottom?: string;
        paddingRight?: string;
        height?: string;
        width?: string;
    }

| Property | Required  | Description |
|--|--|--|
| paddingLeft, paddingTop, paddingBottom, paddingRight | false | Control the padding surrounding the area containing all of the text and user input used in the Widget.  These can be values used for padding in CSS.
| height, width | false | Used for the dimensions of the container containing the text and user input used in the Widget. These can be values used for width and height in CSS. The default values are 'auto'.

## ThemeControls

Defines aspects of the user input elements displayed to the user in the Widget such as buttons and progress bars.

    type ThemeControls = {
        borderRadius?: string;
    }
    
| Property | Required  | Description |
|--|--|--|
| borderRadius | false  | The radius used on the borders of the elements.  This can be values used for border-radius in CSS.

# Content Customization

You can customize most of the content that appears during the various steps of the Widget. This would allow you to change the messsaging to be more specific to your organization for instance. 

A sample of using the Widget earlier in this document is:

    <Strongbox
        orgId={'<Provide an ID that uniquely identifies the end user to you>'}
        orgName={'<Provide a name that you will recognize>'}
        accessToken={<access token>}
    >
        {(props) => {
            return undefined;
        }}
    </Strongbox>

Content customization is accomplished by replacing the child block and returning something other than undefined. When undefined is returned default content is used. So for example if you replace it with:

    {(props) => {
            return (<p>I like pie.</p>);
    }}

The result would be that you would see "I like pie" on every step. It isn't likely that it would be tremendously useful to have the same content displayed on every step so there is a mechanism for handling this.  The type definitions for props are as follows:

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
 
