// test/index.spec.ts
import {env, createExecutionContext, waitOnExecutionContext, SELF} from 'cloudflare:test'
import {describe, it, expect} from 'vitest'
import worker from '../src/index'

// !!! it seems that something is wrong with the testing framework, so the code here is nothing.

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>

describe("Test worker", () => {
	it("Redirect with given callback url", async () => {
		const callbackUrl = Buffer.from("http://localhost:8080/callback", "utf-8").toString("base64")

		const request = new IncomingRequest(`https://some.workers.dev/callback?code=123&state=${callbackUrl}`)
		const ctx = createExecutionContext()
		const response = await worker.fetch(request, env, ctx)
		await waitOnExecutionContext(ctx)

		const responseRedirectUrl = response.headers.get("Location")
		console.log(responseRedirectUrl)
		expect(responseRedirectUrl).toBe(`http://localhost:8080/callback?code=123&state=${callbackUrl}`)
	})
})

// describe('Hello World worker', () => {
// 	it('responds with Hello World! (unit style)', async () => {
// 		const request = new IncomingRequest('http://example.com')
// 		// Create an empty context to pass to `worker.fetch()`.
// 		const ctx = createExecutionContext()
// 		const response = await worker.fetch(request, env, ctx)
// 		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
// 		await waitOnExecutionContext(ctx)
// 		expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`)
// 	})
//
// 	it('responds with Hello World! (integration style)', async () => {
// 		const response = await SELF.fetch('https://example.com')
// 		expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`)
// 	})
// })
