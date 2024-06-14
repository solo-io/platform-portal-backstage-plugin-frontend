export interface Config {
  glooPlatformPortal: {
    /**
     * @visibility frontend
     */
    portalServerUrl: string;

    /**
     * @visibility frontend
     */
    swaggerConfigUrl: string;

    /**
     * The oauth client id.
     * In keycloak, this is shown in the client settings
     * of your keycloak instances UI: <your-keycloak-url>/auth
     * @visibility frontend
     */
    clientId: string;

    /**
     * This is the endpoint to get the oauth token.
     * In keycloak, this is the `token_endpoint` property from:
     * <your-keycloak-url>/auth/realms/<your-realm>/.well-known/openid-configuration
     * @visibility frontend
     */
    tokenEndpoint: string;

    /**
     * This is the endpoint to get PKCE authorization code.
     * In keycloak, this is the `authorization_endpoint` property from:
     * <your-keycloak-url>/auth/realms/<your-realm>/.well-known/openid-configuration
     * @visibility frontend
     */
    authEndpoint: string;

    /**
     * This is the endpoint to end your session.
     * In keycloak, this is the `end_session_endpoint` property from:
     * <your-keycloak-url>/auth/realms/<your-realm>/.well-known/openid-configuration
     * @visibility frontend
     */
    logoutEndpoint: string;
  };
}
