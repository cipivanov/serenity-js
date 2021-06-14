import 'mocha';

import { expect } from '@integration/testing-tools';
import { Ensure, not } from '@serenity-js/assertions';
import { actorCalled, AssertionError } from '@serenity-js/core';

import { by, Click, isActive, Navigate, Target, Wait } from '../../src';

describe('isActive', function () {

    const Page = {
        Active_Input:       Target.the('active input').located(by.id('active')),
        Inactive_Input:     Target.the('inactive input').located(by.id('inactive')),
    };

    beforeEach(() =>
        actorCalled('Wendy').attemptsTo(
            Navigate.to('/expectations/is-active/active_inactive_inputs.html'),
        ));

    /** @test {isActive} */
    it('allows the actor flow to continue when the element is active', () =>
        expect(actorCalled('Wendy').attemptsTo(
            Wait.until(Page.Active_Input, not(isActive())),
            Ensure.that(Page.Active_Input, not(isActive())),
            Click.on(Page.Active_Input),
            Wait.until(Page.Active_Input, isActive()),
            Ensure.that(Page.Active_Input, isActive()),
        )).to.be.fulfilled);

    /** @test {isActive} */
    it('breaks the actor flow when element is inactive', () =>
        expect(actorCalled('Wendy').attemptsTo(
            Ensure.that(Page.Inactive_Input, isActive()),
        )).to.be.rejectedWith(AssertionError, `Expected the inactive input to become active`));

    /** @test {isActive} */
    it('contributes to a human-readable description of an assertion', () => {
        expect(Ensure.that(Page.Active_Input, isActive()).toString())
            .to.equal(`#actor ensures that the active input does become active`);
    });

    /** @test {isActive} */
    it('contributes to a human-readable description of a wait', () => {
        expect(Wait.until(Page.Active_Input, isActive()).toString())
            .to.equal(`#actor waits up to 5s until the active input does become active`);
    });
});
