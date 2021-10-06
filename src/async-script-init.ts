export interface AsyncScriptConfig<Aliases extends string> {
    scripts: Record<Aliases,string>
    handlers: Array<{
        requires: Aliases[]
        callback: () => void
        handled?: boolean
    }>
}

class Handler<Sources extends string> {
    initialised: Record<string,boolean>
    constructor(private config: AsyncScriptConfig<Sources>) {
        this.initialised = {}
        for(const [key] of Object.entries(config.scripts)) {
            this.initialised[key] = false
        }
        for(const [key] of Object.entries(config.scripts)) {
            this.initialised[key] = false
        }
    }
    handle(alias: string) {
        this.initialised[alias] = true
        this.config.handlers.forEach(config => {
            if (!config.handled && config.requires.every(alias => this.initialised[alias as unknown as string])) {
                config.handled = true
                config.callback()
            }
        })
    }
}

export function init<Sources extends string>(config: AsyncScriptConfig<Sources>) {
    if(typeof window !== 'undefined') {
        const handler = new Handler(config)
        ;(window as any).asyncScriptHandler = handler.handle.bind(handler)
    }
}

export function getIncludes<Sources extends string>(config: AsyncScriptConfig<Sources>) {
    var template = ''
    for(const [key,value] of Object.entries(config.scripts)) {
        template += `<script async src="${value}" onload="asyncScriptHandler('${key}')"></script>`
    }
    return template
}