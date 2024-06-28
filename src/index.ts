import { Buffer } from 'node:buffer';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url)
		if(url.pathname === "/callback") {
			const params = url.searchParams
			const code = params.get("code")
			const state = params.get("state")

			if(code === null) {
				return Response.json({
					"error": "The code is not present!"
				}, {
					status: 400,
				})
			}

			if(state !== null) {
				// try to redirect to the "real" callback url for testing, which is not secured by TLS.
				// the real callback url is encoded in "state" params using Base64 encoding.
				try {
					const callbackUrl = new URL(Buffer.from(state, "base64").toString("utf-8"))
					callbackUrl.searchParams.set("code", code)
					callbackUrl.searchParams.set("state", state)
					// temporary redirect to the real callback url with code and state in the query parameters.
					return Response.redirect(callbackUrl.toString(), 307)
				} catch(e) {
					// if something is wrong when doing the redirect, we'll respond with the details.
					return Response.json({
						"error": "The callback url is invalid!",
						"error_msg": e,
						"code": code,
						"state": state,
					}, {
						status: 400
					})
				}
			} else {
				// if the state is not present, we just respond with these data
				return Response.json({
					"code": code,
					"state": state,
				})
			}
		} else {
			return new Response('Hello World!')
		}
	},
} satisfies ExportedHandler<Env>
