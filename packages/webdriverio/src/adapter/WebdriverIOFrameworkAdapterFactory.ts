import { Serenity } from '@serenity-js/core';
import { ModuleLoader, Path } from '@serenity-js/core/lib/io';
import type { Capabilities } from '@wdio/types';
import type { EventEmitter } from 'events';
import { WebdriverIOFrameworkAdapter } from './WebdriverIOFrameworkAdapter';
import { WebdriverIOConfig } from './WebdriverIOConfig';
import { InitialisesReporters, ProvidesWriteStream } from './reporter';

export class WebdriverIOFrameworkAdapterFactory {
    constructor(
        private readonly serenity: Serenity,
        private readonly loader: ModuleLoader,
        private readonly cwd: Path,
    ) {
    }

    public init(
            cid: string,
            config: WebdriverIOConfig,
            specs: string[],
            capabilities: Capabilities.RemoteCapability,
            reporter: EventEmitter & ProvidesWriteStream & InitialisesReporters
    ): Promise<WebdriverIOFrameworkAdapter> {
        return new WebdriverIOFrameworkAdapter(
            this.serenity,
            this.loader,
            this.cwd,
            cid,
            config,
            specs,
            capabilities,
            reporter,
        ).init()
    }
}
