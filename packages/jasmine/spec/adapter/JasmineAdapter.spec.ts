import { expect } from '@integration/testing-tools';
import { ModuleLoader } from '@serenity-js/core/lib/io';
import * as sinon from 'sinon';

import { JasmineAdapter } from '../../src/adapter';
import { JasmineReporter } from '../../src/jasmine';
import { FakeJasmineRunner } from './FakeJasmineRunner';

/** @test JasmineAdapter */
describe('JasmineAdapter', () => {

    const emptySuite = { getFullTitle: () => 'Top suite' };
    function specCalled(fullName: string) {                 // eslint-disable-line unicorn/consistent-function-scoping
        return {
            getFullName() {
                return fullName;
            }
        }
    }

    let loader: sinon.SinonStubbedInstance<ModuleLoader>;

    beforeEach(() => {
        loader = sinon.createStubInstance(ModuleLoader);

        loader.require.withArgs('jasmine').returns(FakeJasmineRunner);
    });

    afterEach(() => {
        FakeJasmineRunner.topSuite.reset();
        FakeJasmineRunner.instance = undefined;
    });

    /** @test JasmineAdapter#run */
    it('defaults to running tests sequentially rather than in a random order', async () => {

        const
            config = {},
            specs  = [];

        const adapter = new JasmineAdapter(config, loader);

        FakeJasmineRunner.topSuite.returns(emptySuite)

        await adapter.load(specs);

        const result = adapter.run();

        FakeJasmineRunner.instance.complete(true);

        expect(FakeJasmineRunner.instance.loadConfig).to.have.been.calledWithMatch({
            random: false,
        });

        return result;
    });

    /** @test JasmineAdapter#load */
    it('loads configured requires and helpers', async () => {

        const
            helpers     = ['some-helper.js'],
            requires    = ['ts-node/register'],
            config      = {
                helpers,
                requires,
            },
            specs       = [];

        const adapter = new JasmineAdapter(config, loader);

        FakeJasmineRunner.topSuite.returns(emptySuite)

        await adapter.load(specs);

        expect(FakeJasmineRunner.instance.loadConfig).to.have.been.calledWithMatch({
            ... config,
            random: false,
        });

        expect(FakeJasmineRunner.instance.loadRequires).to.have.been.called;
        expect(FakeJasmineRunner.instance.loadHelpers).to.have.been.called;
    });

    /** @test JasmineAdapter#run */
    it('configures the default timeout interval if required', async () => {

        const
            defaultTimeoutInterval = 5000,
            config = {
                defaultTimeoutInterval,
            },
            specs  = [];

        const adapter = new JasmineAdapter(config, loader);

        FakeJasmineRunner.topSuite.returns(emptySuite)

        await adapter.load(specs)
        const result = adapter.run();

        FakeJasmineRunner.instance.complete(true);

        expect(FakeJasmineRunner.instance.jasmine.DEFAULT_TIMEOUT_INTERVAL).to.equal(defaultTimeoutInterval);

        return result;
    });

    /** @test JasmineAdapter#run */
    it('registers a Serenity/JS reporter by default', async () => {

        const
            specs  = [];

        const adapter = new JasmineAdapter({}, loader);

        FakeJasmineRunner.topSuite.returns(emptySuite)

        await adapter.load(specs)
        const result = adapter.run();

        FakeJasmineRunner.instance.complete(true);

        expect(FakeJasmineRunner.instance.addReporter).to.have.been.calledOnce

        return result;
    });

    /** @test JasmineAdapter#run */
    it('registers configured custom reporters', async () => {

        const
            additionalReporter: JasmineReporter = {},
            config = {
                reporters: [ additionalReporter ],
            },
            specs  = [];

        const adapter = new JasmineAdapter(config, loader);

        FakeJasmineRunner.topSuite.returns(emptySuite)

        await adapter.load(specs)
        const result = adapter.run();

        FakeJasmineRunner.instance.complete(true);

        expect(FakeJasmineRunner.instance.addReporter).to.have.been.calledTwice

        expect(FakeJasmineRunner.instance.addReporter).to.have.been.calledWith(additionalReporter)

        return result;
    });

    describe('when counting the number of scenarios to be executed', () => {

        /** @test JasmineAdapter#scenarioCount */
        it('recognises when there are no scenarios', () => {

            const
                defaultTimeoutInterval = 5000,
                config = {
                    defaultTimeoutInterval,
                };

            const adapter = new JasmineAdapter(config, loader);

            FakeJasmineRunner.topSuite.returns(emptySuite)

            expect(adapter.scenarioCount()).to.equal(0);
        });

        /** @test JasmineAdapter#scenarioCount */
        it('recognises when there is a single spec', async () => {

            const
                defaultTimeoutInterval = 5000,
                config = {
                    defaultTimeoutInterval,
                },
                specs  = [ 'fake.spec.ts' ];

            const adapter = new JasmineAdapter(config, loader);

            FakeJasmineRunner.topSuite.returns({ children: [ specCalled('first spec') ] })

            await adapter.load(specs)

            expect(adapter.scenarioCount()).to.equal(1);
        });

        /** @test JasmineAdapter#scenarioCount */
        it('recognises when there are multiple nested specs', async () => {

            const
                defaultTimeoutInterval = 5000,
                config = {
                    defaultTimeoutInterval,
                },
                specs  = [ 'fake.spec.ts' ];

            const adapter = new JasmineAdapter(config, loader);

            FakeJasmineRunner.topSuite.returns({
                children: [
                    specCalled('first spec'),
                    {
                        getFullName() {
                            return 'nested describe';
                        },
                        children: specCalled('nested spec')
                    }
                ],
            })

            await adapter.load(specs)

            expect(adapter.scenarioCount()).to.equal(2);
        });
    });
});
