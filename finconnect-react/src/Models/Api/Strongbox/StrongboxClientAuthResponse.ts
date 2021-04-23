import { IAuthToken, NexusApiClient } from 'strongbox-nexus-client';

/*
 * A simple wrapper response around a Strongbox Nexus <see cref="Strongbox.Nexus.ApiClient.AuthToken"/> and <see cref="Strongbox.Nexus.ApiClient.Connection"/>.
 */
export interface IStrongboxClientAuthResponse {
    /*
     * An authorization token that can be used safely from the user's web browser to trigger a Job.
     */
    authToken: IAuthToken;

    /*
     * The Strongbox Connection for the entity associated with the <see cref="AuthToken"/>.
     */

    connection: NexusApiClient.IConnection;
}
