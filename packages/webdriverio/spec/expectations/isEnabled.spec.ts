import 'mocha';

import { expect } from '@integration/testing-tools';
import { Ensure } from '@serenity-js/assertions';
import { actorCalled, AssertionError } from '@serenity-js/core';

import { by, isEnabled, Navigate, Target, Wait } from '../../src';

describe('isEnabled', function () {

    const Page = {
        Enabled_Button:     Target.the('enabled button').located(by.id('enabled')),
        Disabled_Button:    Target.the('disabled button').located(by.id('disabled')),
        Hidden_Button:      Target.the('hidden button').located(by.id('hidden')),
    };

    beforeEach(() =>
        actorCalled('Wendy').attemptsTo(
            Navigate.to('/expectations/is-enabled/buttons.html'),
        ));

    /** @test {isEnabled} */
    it('allows the actor flow to continue when the element is enabled', () =>
        expect(actorCalled('Wendy').attemptsTo(
            Wait.until(Page.Enabled_Button, isEnabled()),
            Ensure.that(Page.Enabled_Button, isEnabled()),
        )).to.be.fulfilled);

    /** @test {isEnabled} */
    it('breaks the actor flow when element is disabled', () =>
        expect(actorCalled('Wendy').attemptsTo(
            Ensure.that(Page.Disabled_Button, isEnabled()),
        )).to.be.rejectedWith(AssertionError, `Expected the disabled button to become enabled`));

    /** @test {isEnabled} */
    it('contributes to a human-readable description of an assertion', () => {
        expect(Ensure.that(Page.Enabled_Button, isEnabled()).toString())
            .to.equal(`#actor ensures that the enabled button does become enabled`);
    });

    /** @test {isEnabled} */
    it('contributes to a human-readable description of a wait', () => {
        expect(Wait.until(Page.Enabled_Button, isEnabled()).toString())
            .to.equal(`#actor waits up to 5s until the enabled button does become enabled`);
    });
});
