import { expect, ifExitCodeIsOtherThan, logOutput, PickEvent } from '@integration/testing-tools';
import { FeatureNarrativeDetected, SceneDescriptionDetected, SceneStarts } from '@serenity-js/core/lib/events';
import { Description, Name } from '@serenity-js/core/lib/model';

import 'mocha';
import { given } from 'mocha-testdata';
import { CucumberRunner, cucumberVersions } from '../../src';

describe('@serenity-js/cucumber', function () {

    this.timeout(5000);

    given([
        ...cucumberVersions(1, 2)
            .thatRequires(
                'node_modules/@serenity-js/cucumber/lib/index.js',
                'lib/support/configure_serenity.js',
            )
            .withStepDefsIn('promise')
            .toRun('features/descriptions.feature'),

        ...cucumberVersions(3, 4, 5, 6)
            .thatRequires('lib/support/configure_serenity.js')
            .withStepDefsIn('promise')
            .withArgs(
                '--format', 'node_modules/@serenity-js/cucumber',
            )
            .toRun('features/descriptions.feature'),
    ]).
    it('recognises scenario descriptions', (runner: CucumberRunner) => runner.run().
        then(ifExitCodeIsOtherThan(0, logOutput)).
        then(res => {
            expect(res.exitCode).to.equal(0);

            PickEvent.from(res.events)
                .next(SceneStarts,              event => expect(event.details.name).to.equal(new Name('First scenario')))
                .next(FeatureNarrativeDetected, event => {
                    expect(event.description).to.equal(new Description(
                        'In order to accurately report the scenario\n' +
                        'Serenity/JS should recognise all of its important parts',
                    ));
                })
                .next(SceneDescriptionDetected, event => {
                    expect(event.description).to.equal(new Description(
                        'A scenario where all the steps pass\nIs reported as passing',
                    ));
                })
            ;
        }));
});
