import { AsyncScriptConfig, init } from "./async-script-init";

declare var fast1: Record<string, any>
declare var fast2: Record<string, any>
declare var slow1: Record<string, any>
declare var slow2: Record<string, any>

type Sources = 'slow1' | 'slow2' | 'fast1' | 'fast2'

export const asyncScriptConfig: AsyncScriptConfig<Sources> = {
    scripts: {
        slow1: '/slow-lib.js?n=1',
        slow2: '/slow-lib.js?n=2',
        fast1: '/fast-lib.js?n=1',
        fast2: '/fast-lib.js?n=2',
    },
    handlers: [
        {
            requires: ['slow1', 'fast1'],
            callback: () => console.log('slow + fast', slow1, fast1)
        },
        {
            requires: ['fast1', 'fast2'],
            callback:  () => console.log('fast', fast1, fast2)
        },
        {
            requires: ['slow1', 'slow2'],
            callback:  () => console.log('slow', slow1, slow2)
        }
    ]
}

init(asyncScriptConfig)