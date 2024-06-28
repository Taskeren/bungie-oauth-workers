# Bungie OAuth Workers

This subproject is used to test the Bungie apis where these endpoints require OAuth login (access tokens).

You can deploy the script on CloudFlare workers to receive the codes.

## Deployment

### 1. Set up the Worker

You can directly run `npm run deploy` to start the deployment sequence using the Wrangler.

*Thanks to CloudFlare who developed the Wrangler CLI, so that we can save a lot of time from preparing the environment.*

### 2. Configure your Bungie Application

Set the **Callback URL** to the workers **Callback URL**.

You are recommended to create an Application for testing only because it changes the **Callback URL** of the
Application, which you'll never want your product users to access somewhere not secure!

For example, I've deployed this worker in <https://bungie-oauth-workers.nitu2003.workers.dev/>, so I'll need to set
the **Callback URL** to `https://bungie-oauth-workers.nitu2003.workers.dev/callback`, then whenever we successfully
logged in at the authorize page, it redirects the "User" to the worker, and the worker can once again
redirect to our testing url, for example `http://localhost:3000/api/callback`.

### 3. Make a "Valid" Authorizing URL

Add additional "state" parameter in the authorizing URL, whose value is base64-encoded local address, to tell the worker
where to redirect.

For example, I'm running frontend website locally at `http://localhost:3000` that it receives the callback from Bungie
at `http://localhost:3000/api/callback`. I need to set the value of *state* parameter
to `aHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9jYWxsYmFjaw`. So the final URL
is `https://www.bungie.net/en/oauth/authorize?client_id=[[CLIENT_ID]]&response_type=code&state=aHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9jYWxsYmFjaw`.
