﻿import { ClientBase, IDelegatedAccessToken } from './ClientBase';
import {
    BadRequest,
    Forbidden,
    Connection,
    NotFound,
    FinancialRecordList,
    FinancialImportParameters,
    FinancialImportStatus,
    FinancialRecordReference,
    ConnectionRequestParameters,
    ConnectionRequestDescriptor,
    ConnectionRequest,
    ConnectionsList,
    WebhookEndpointParameters,
    WebhookEndpoint, 
    WebhookEndpointList,
    InitializeOrganizationParameters,
}
from './strongbox.models';

/* tslint:disable */
/* eslint-disable */
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.9.4.0 (NJsonSchema v10.3.1.0 (Newtonsoft.Json v11.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
// ReSharper disable InconsistentNaming

export interface IFinancialRecordsClient {
    /**
     * Monitor a financial import
     * @param orgId An identifier for the organization for which financials are being imported.
     * @param id An identifier for the Financial Record representing the imported financials.
     * @return Ok
     */
    getImportStatus(orgId: string, id: string): Promise<StrongboxApiResponse<FinancialImportStatus>>;
    /**
     * Import financials on demand
     * @param orgId An identifier for the organization for which financials will be imported.
     * @param body (optional) 
     * @return Created
     */
    import(orgId: string, body?: FinancialImportParameters | undefined): Promise<StrongboxApiResponse<FinancialRecordReference>>;
}

export class FinancialRecordsClient extends ClientBase implements IFinancialRecordsClient {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(configuration: IDelegatedAccessToken, baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super(configuration);
        this.http = http ? http : <any>window;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "https://api.strongbox.link";
    }

    /**
     * Monitor a financial import
     * @param orgId An identifier for the organization for which financials are being imported.
     * @param id An identifier for the Financial Record representing the imported financials.
     * @return Ok
     */
    getImportStatus(orgId: string, id: string): Promise<StrongboxApiResponse<FinancialImportStatus>> {
        let url_ = this.baseUrl + "/Organizations/{orgId}/FinancialRecords/{id}/ImportStatus";
        if (orgId === undefined || orgId === null)
            throw new Error("The parameter 'orgId' must be defined.");
        url_ = url_.replace("{orgId}", encodeURIComponent("" + orgId));
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processGetImportStatus(_response);
        });
    }

    protected processGetImportStatus(response: Response): Promise<StrongboxApiResponse<FinancialImportStatus>> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = FinancialImportStatus.fromJS(resultData200);
                return new StrongboxApiResponse(status, _headers, result200);
            });
        } else if (status === 401) {
            return response.text().then((_responseText) => {
                return throwException("Authentication Required.", status, _responseText, _headers);
            });
        } else if (status === 403) {
            return response.text().then((_responseText) => {
                let result403: any = null;
                let resultData403 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result403 = Forbidden.fromJS(resultData403);
                return throwException("Forbidden. Not authorized to make this request.", status, _responseText, _headers, result403);
            });
        } else if (status === 404) {
            return response.text().then((_responseText) => {
                let result404: any = null;
                let resultData404 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result404 = NotFound.fromJS(resultData404);
                return throwException("Not Found", status, _responseText, _headers, result404);
            });
        } else if (status === 500) {
            return response.text().then((_responseText) => {
                return throwException("Internal Server Error. An unexpected error occured.", status, _responseText, _headers);
            });
        } else if (status === 503) {
            return response.text().then((_responseText) => {
                return throwException("Service Unavailable. The service is currently unavailable. Try again later.", status, _responseText, _headers);
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<StrongboxApiResponse<FinancialImportStatus>>(new StrongboxApiResponse(status, _headers, <any>null));
    }

    /**
     * Import financials on demand
     * @param orgId An identifier for the organization for which financials will be imported.
     * @param body (optional) 
     * @return Created
     */
    import(orgId: string, body?: FinancialImportParameters | undefined): Promise<StrongboxApiResponse<FinancialRecordReference>> {
        let url_ = this.baseUrl + "/Organizations/{orgId}/FinancialRecords/Import";
        if (orgId === undefined || orgId === null)
            throw new Error("The parameter 'orgId' must be defined.");
        url_ = url_.replace("{orgId}", encodeURIComponent("" + orgId));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processImport(_response);
        });
    }

    protected processImport(response: Response): Promise<StrongboxApiResponse<FinancialRecordReference>> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 201) {
            return response.text().then((_responseText) => {
                let result201: any = null;
                let resultData201 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result201 = FinancialRecordReference.fromJS(resultData201);
                return new StrongboxApiResponse(status, _headers, result201);
            });
        } else if (status === 400) {
            return response.text().then((_responseText) => {
                let result400: any = null;
                let resultData400 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result400 = BadRequest.fromJS(resultData400);
                return throwException("Bad Request. Invalid parameters.", status, _responseText, _headers, result400);
            });
        } else if (status === 401) {
            return response.text().then((_responseText) => {
                return throwException("Authentication Required.", status, _responseText, _headers);
            });
        } else if (status === 403) {
            return response.text().then((_responseText) => {
                let result403: any = null;
                let resultData403 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result403 = Forbidden.fromJS(resultData403);
                return throwException("Forbidden. Not authorized to make this request.", status, _responseText, _headers, result403);
            });
        } else if (status === 500) {
            return response.text().then((_responseText) => {
                return throwException("Internal Server Error. An unexpected error occured.", status, _responseText, _headers);
            });
        } else if (status === 501) {
            return response.text().then((_responseText) => {
                return throwException("Not Implemented. Importing financials from the requested datasource is not yet supported by this API.", status, _responseText, _headers);
            });
        } else if (status === 503) {
            return response.text().then((_responseText) => {
                return throwException("Service Unavailable. The service is currently unavailable. Try again later.", status, _responseText, _headers);
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<StrongboxApiResponse<FinancialRecordReference>>(new StrongboxApiResponse(status, _headers, <any>null));
    }
}

export interface IConnectionsClient {
    /**
     * Create a Connection Request
     * @param orgId An identifier for the organization for which the Connection Request will be created.
     * @param body (optional) Parameters for creating the Connection Request.
     * @return Created.
     */
    createRequest(orgId: string, body?: ConnectionRequestParameters | undefined): Promise<StrongboxApiResponse<ConnectionRequestDescriptor>>;

    /**
     * Get the status of a Connection Request
     * @param orgId An identifier for the organization for which the Connection Request was created.
     * @param id An identifier for the Connection Request.
     * @return Ok.
     */
    getRequest(orgId: string, id: string): Promise<StrongboxApiResponse<ConnectionRequest>>;
}

export class ConnectionsClient extends ClientBase implements IConnectionsClient {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(configuration: IDelegatedAccessToken, baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super(configuration);
        this.http = http ? http : <any>window;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "https://api.strongbox.link";
    }

    /**
     * Create a Connection Request
     * @param orgId An identifier for the organization for which the Connection Request will be created.
     * @param body (optional) Parameters for creating the Connection Request.
     * @return Created.
     */
    createRequest(orgId: string, body?: ConnectionRequestParameters | undefined): Promise<StrongboxApiResponse<ConnectionRequestDescriptor>> {
        let url_ = this.baseUrl + "/Organizations/{orgId}/ConnectionRequests";
        if (orgId === undefined || orgId === null)
            throw new Error("The parameter 'orgId' must be defined.");
        url_ = url_.replace("{orgId}", encodeURIComponent("" + orgId));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processCreateRequest(_response);
        });
    }

    protected processCreateRequest(response: Response): Promise<StrongboxApiResponse<ConnectionRequestDescriptor>> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 201) {
            return response.text().then((_responseText) => {
                let result201: any = null;
                let resultData201 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result201 = ConnectionRequestDescriptor.fromJS(resultData201);
                return new StrongboxApiResponse(status, _headers, result201);
            });
        } else if (status === 400) {
            return response.text().then((_responseText) => {
                let result400: any = null;
                let resultData400 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result400 = BadRequest.fromJS(resultData400);
                return throwException("Bad Request. Invalid or missing parameters.", status, _responseText, _headers, result400);
            });
        } else if (status === 401) {
            return response.text().then((_responseText) => {
                return throwException("Unauthorized - Authentication required or unauthorized.", status, _responseText, _headers);
            });
        } else if (status === 403) {
            return response.text().then((_responseText) => {
                let result403: any = null;
                let resultData403 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result403 = Forbidden.fromJS(resultData403);
                return throwException("Forbidden - Not authorized to make this request.", status, _responseText, _headers, result403);
            });
        } else if (status === 415) {
            return response.text().then((_responseText) => {
                return throwException("Unsupported Media Type - The request body did not contain content in a supported format.", status, _responseText, _headers);
            });
        } else if (status === 500) {
            return response.text().then((_responseText) => {
                return throwException("Internal Server Error - An unexpected error occured.", status, _responseText, _headers);
            });
        } else if (status === 503) {
            return response.text().then((_responseText) => {
                return throwException("Service Unavailable - The service is currently unavailable. Try again later.", status, _responseText, _headers);
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<StrongboxApiResponse<ConnectionRequestDescriptor>>(new StrongboxApiResponse(status, _headers, <any>null));
    }

    /**
     * Get the status of a Connection Request
     * @param orgId An identifier for the organization for which the Connection Request was created.
     * @param id An identifier for the Connection Request.
     * @return Ok.
     */
    getRequest(orgId: string, id: string): Promise<StrongboxApiResponse<ConnectionRequest>> {
        let url_ = this.baseUrl + "/Organizations/{orgId}/ConnectionRequests/{id}";
        if (orgId === undefined || orgId === null)
            throw new Error("The parameter 'orgId' must be defined.");
        url_ = url_.replace("{orgId}", encodeURIComponent("" + orgId));
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processGetRequest(_response);
        });
    }

    protected processGetRequest(response: Response): Promise<StrongboxApiResponse<ConnectionRequest>> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = ConnectionRequest.fromJS(resultData200);
                return new StrongboxApiResponse(status, _headers, result200);
            });
        } else if (status === 400) {
            return response.text().then((_responseText) => {
                let result400: any = null;
                let resultData400 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result400 = BadRequest.fromJS(resultData400);
                return throwException("Bad Request. Invalid or missing parameters.", status, _responseText, _headers, result400);
            });
        } else if (status === 401) {
            return response.text().then((_responseText) => {
                return throwException("Unauthorized - Authentication required or unauthorized.", status, _responseText, _headers);
            });
        } else if (status === 403) {
            return response.text().then((_responseText) => {
                let result403: any = null;
                let resultData403 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result403 = Forbidden.fromJS(resultData403);
                return throwException("Forbidden - Not authorized to make this request.", status, _responseText, _headers, result403);
            });
        } else if (status === 500) {
            return response.text().then((_responseText) => {
                return throwException("Internal Server Error - An unexpected error occured.", status, _responseText, _headers);
            });
        } else if (status === 503) {
            return response.text().then((_responseText) => {
                return throwException("Service Unavailable - The service is currently unavailable. Try again later.", status, _responseText, _headers);
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<StrongboxApiResponse<ConnectionRequest>>(new StrongboxApiResponse(status, _headers, <any>null));
    }
}

export interface IWebPortalClient {
    /**
     * Initialize a listed Organization
     * @param orgId An identifier for the Organization to initialize.
     * @param body (optional) The request to initialize the Organization.
     * @return Success
     */
    initializeOrganization(orgId: string, body?: InitializeOrganizationParameters | undefined): Promise<StrongboxApiResponse<void>>;
}

export class WebPortalClient extends ClientBase implements IWebPortalClient {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(configuration: IDelegatedAccessToken, baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super(configuration);
        this.http = http ? http : <any>window;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "https://api.strongbox.link";
    }

    /**
     * Initialize a listed Organization
     * @param orgId An identifier for the Organization to initialize.
     * @param body (optional) The request to initialize the Organization.
     * @return Success
     */
    initializeOrganization(orgId: string, body?: InitializeOrganizationParameters | undefined): Promise<StrongboxApiResponse<void>> {
        let url_ = this.baseUrl + "/WebPortal/Organizations/{orgId}/Initialize";
        if (orgId === undefined || orgId === null)
            throw new Error("The parameter 'orgId' must be defined.");
        url_ = url_.replace("{orgId}", encodeURIComponent("" + orgId));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processInitializeOrganization(_response);
        });
    }

    protected processInitializeOrganization(response: Response): Promise<StrongboxApiResponse<void>> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 204) {
            return response.text().then((_responseText) => {
                return new StrongboxApiResponse(status, _headers, <any>null);
            });
        } else if (status === 400) {
            return response.text().then((_responseText) => {
                let result400: any = null;
                let resultData400 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result400 = BadRequest.fromJS(resultData400);
                return throwException("Bad Request", status, _responseText, _headers, result400);
            });
        } else if (status === 401) {
            return response.text().then((_responseText) => {
                return throwException("Authentication Required.", status, _responseText, _headers);
            });
        } else if (status === 403) {
            return response.text().then((_responseText) => {
                let result403: any = null;
                let resultData403 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result403 = Forbidden.fromJS(resultData403);
                return throwException("Forbidden. Not authorized to make this request.", status, _responseText, _headers, result403);
            });
        } else if (status === 500) {
            return response.text().then((_responseText) => {
                return throwException("Internal Server Error. An unexpected error occured.", status, _responseText, _headers);
            });
        } else if (status === 503) {
            return response.text().then((_responseText) => {
                return throwException("Service Unavailable. The service is currently unavailable. Try again later.", status, _responseText, _headers);
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<StrongboxApiResponse<void>>(new StrongboxApiResponse(status, _headers, <any>null));
    }
}

export class StrongboxApiResponse<TResult> {
    status: number;
    headers: { [key: string]: any; };
    result: TResult;

    constructor(status: number, headers: { [key: string]: any; }, result: TResult) {
        this.status = status;
        this.headers = headers;
        this.result = result;
    }
}

export class StrongboxApiException extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isNexusApiException = true;

    static isNexusApiException(obj: any): obj is StrongboxApiException {
        return obj.isNexusApiException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
    if (result !== null && result !== undefined)
        throw result;
    else
        throw new StrongboxApiException(message, status, response, headers, null);
}