import express, { Request, Response } from 'express'
import { readFileSync } from 'fs'
import { getIncludes } from './async-script-init'
import { asyncScriptConfig } from '.'

const app = express()
const port = 3000

app.get('/', (_: Request, res: Response) => {

    const initialiser = getIncludes(asyncScriptConfig)
    const template = `
        <html>
            <head>
                <script src="main.js"></script>
                ${initialiser}
            </head>
            <body>
                <p>Hi</p>
            </body>
        </html>
    `
    res.send(template);
})

app.get('/slow-lib.js', async (req: Request, res: Response) => {
    const n = req.query.n
    const lib = new Promise<string>((resolve) => 
        setTimeout(() => {
            const template = `
                console.debug('slow${n} script loaded');
                var slow${n} = {name: "slow${n}"};
            `
            resolve(template);
        }, 5_000)
    )
    res.setHeader('ContentType', 'application/js')
    res.send(await lib)
})

app.get('/fast-lib.js', async (req: Request, res: Response) => {
    const n = req.query.n
    const lib = new Promise<string>((resolve) => 
        setTimeout(() => {
            const template = `
                console.debug('fast${n} script loaded');
                var fast${n} = {name: "fast${n}"};
            `
            resolve(template);
        }, 2_000)
    )
    res.setHeader('ContentType', 'application/js')
    res.send(await lib);
})

app.get('/main.js', async (_: Request, res: Response) => {
    res.setHeader('ContentType', 'application/js')
    res.send(readFileSync('./dist/main.js'))
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})