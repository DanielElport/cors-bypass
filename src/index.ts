import express, { Application, Request, Response } from 'express'
import fetch, { Headers } from 'node-fetch'

const app: Application = express()

app.get('/', async (req: Request, res: Response) => {
    // verify user api key
    const apiKey = req.query.apiKey as string
    if (apiKey !== process.env.API_KEY) {
        res.status(401).send('Unauthorized')
        return
    }

    // get the url from the query parameters
    const url = req.query.path as string

    // set request headers
    const headers = Object.assign(new Headers(), req.headers)

    // forward the request to the url
    const httpResponse = await fetch(url, {
        method: 'GET',
        headers,
    })

    // set response headers
    res.set({
        ...httpResponse.headers,
        'Content-disposition': 'inline',
    })

    // send the response back to the client depending on the content type
    if (
        httpResponse.headers.get('content-type')?.includes('application/json')
    ) {
        return res.json(await httpResponse.json())
    }
    if (httpResponse.headers.get('content-type')?.includes('text/html')) {
        return res.end(await httpResponse.text())
    }
    return res.end(await httpResponse.buffer())
})

// Start server
const port: number = 8080
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
