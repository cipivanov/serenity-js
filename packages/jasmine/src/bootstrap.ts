import { RuntimeError, serenity } from '@serenity-js/core';

import { monkeyPatched } from './monkeyPatched';
import { SerenityReporterForJasmine } from './SerenityReporterForJasmine';

/**
 * @desc
 *  Monkey-patches Jasmine's Suite and Spec so that they provide more accurate information and
 *  returns a bootstrapped instance of the {@link SerenityReporterForJasmine} to be registered with Jasmine.
 *
 * @example <caption>Registering the reporter from the command line</caption>
 * jasmine --reporter=@serenity-js/jasmine
 *
 * @example <caption>Registering the reporter programmatically</caption>
 * import serenityReporterForJasmine = require('@serenity-js/jasmine');
 *
 * jasmine.getEnv().addReporter(serenityReporterForJasmine);
 *
 * @see {@link monkeyPatched}
 * @see {@link SerenityReporterForJasmine}
 *
 * @param {jasmine} jasmine - the global.jasmine instance
 * @returns {SerenityReporterForJasmine}
 */
export function bootstrap(jasmine = (global as any).jasmine): SerenityReporterForJasmine {
    const wrappers = {
        expectationResultFactory: originalExpectationResultFactory => ((attributes: { passed: boolean, error: Error }) => {
            const result = originalExpectationResultFactory(attributes);

            if (! attributes.passed && attributes.error instanceof RuntimeError) {
                result.stack = attributes.error.stack;
            }

            return result;
        }),
    };

    jasmine.Suite = monkeyPatched(jasmine.Suite, wrappers);
    jasmine.Spec = monkeyPatched(jasmine.Spec, wrappers);

    return new SerenityReporterForJasmine(serenity);
}
