/**
 * @desc
 *  Configuration object that will be passed to the JasmineRunner.
 *
 * @see https://jasmine.github.io/setup/nodejs.html
 */
import { JasmineReporter } from '../jasmine';

export interface JasmineConfig {

    /**
     * @desc
     *  A list of paths to helper files that should be loaded and executed before the `requires` and the `specs`.
     *  Accepts relative and absolute paths as well as glob expressions.
     *
     * @type {string[] | undefined}
     * @see https://jasmine.github.io/tutorials/react_with_npm
     */
    helpers?: string[];

    /**
     * @desc
     *  A list of paths to files that should be required after the `helpers`, but before the `specs`.
     *  The path need to be compatible with Node {@link require}.
     *
     * @type {string[] | undefined}
     */
    requires?: string[];

    /**
     * @desc
     *  Whether or not the tests should be executed in a pseudo-random order.
     *
     * @type {boolean | undefined}
     */
    random?: boolean;

    /**
     * @desc
     *  Used to exclude any test scenarios which name doesn't match the pattern from the run.
     *
     * @type {string | RegExp | undefined}
     */
    grep?: string | RegExp;

    /**
     * @desc
     *  Inverts 'grep' matches.
     *
     *  Defaults to `false`
     *
     * @type {boolean | undefined}
     */
    invertGrep?: boolean;

    /**
     * @desc
     *  Receives the full name of a test scenario and returns `true`
     *  for those that should be executed.
     *
     *  Takes precedence over `grep`
     *
     * @type {function(specName: string): boolean}
     */
    specFilter?: (specName: string) => boolean

    /**
     * @desc
     *  The randomisation seed that will be used to determine the pseudo-random order of execution,
     *  if `random` is set to `true`
     *
     * @type {string | undefined}
     * @see {@link JasmineConfig#random}
     */
    seed?: string;

    /**
     * @desc
     *  Sets the global `jasmine.DEFAULT_TIMEOUT_INTERVAL`,
     *  which defines the default number of milliseconds Jasmine will wait for an asynchronous spec to complete.
     *
     * @type {number | undefined}
     * @see https://jasmine.github.io/api/edge/jasmine#.DEFAULT_TIMEOUT_INTERVAL
     */
    defaultTimeoutInterval?: number;

    /**
     * @desc
     *  A list of Jasmine reporters to be added to the test runner.
     *
     *  Useful for situations like configuring ReportPortal, because you cannot use `jasmine.addReporter()` in the Protractor config.
     *
     *  Note: reporters must be instantiated before adding them to the configuration.
     *
     * @type {JasmineReporter[] | undefined}
     *
     * @example <caption>Using ReportPortal with Protractor and Jasmine</caption>
     *  // protractor.conf.js
     *  const AgentJasmine = require('@reportportal/agent-js-jasmine')
     *  const agent = new AgentJasmine(require('./reportportalConf'))
     *  // ...
     *  jasmineNodeOpts: {
     *    // ...
     *    reporters: [ agent.getJasmineReporter() ],
     *  }
     *
     *  afterLaunch:() => {
     *    return agent.getExitPromise();
     *  },
     */
    reporters?: JasmineReporter[];
}
