import * as chai from 'chai';
import * as sinon from 'sinon';

const assert = chai.assert;

describe('Yang', () => {
    describe('#test()', () => {
        it('should log a message', () => {

            let spy = sinon.spy(console, 'log');

            let log = console.log;
            log('I am being tested!');

            assert(spy.calledWith('I am being tested!'));

            spy.restore();

        });
    });
});
