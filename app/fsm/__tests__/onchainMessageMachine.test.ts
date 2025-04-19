/* eslint-disable @typescript-eslint/no-explicit-any */

import {describe, expect, it} from 'vitest';
import {InscriptionContext, InscriptionEvent} from '../onchainMessageMachineTypes';
import {transition} from '../onchainMessageMachine';
import {EventType, Status} from '@/app/constants';

describe('onchainMessageMachine FSM', () => {
    const baseContext: InscriptionContext = {
        address: '',
        chain: 'EVM',
        message: '',
    };

    it('transitions from idle to preparing on START', () => {
        const event: InscriptionEvent = {
            type: EventType.START,
            payload: {
                address: '0x123',
                chain: 'SVM',
                message: 'Balance: $1000.00',
            },
        };

        const result = transition(Status.IDLE, event, baseContext);

        expect(result.state).toBe(Status.PREPARING);
        expect(result.context).toEqual(event.payload);
    });

    it('transitions from preparing to signing on PREPARED', () => {
        const result = transition(Status.PREPARING, {type: EventType.PREPARED}, baseContext);

        expect(result.state).toBe(Status.SIGNING);
        expect(result.context).toEqual(baseContext);
    });

    it('transitions from signing to success on SIGNED', () => {
        const context: InscriptionContext = {
            address: '0xabc',
            chain: 'EVM',
            message: 'Hello world',
        };

        const event: InscriptionEvent = {
            type: EventType.SIGNED,
            payload: {txHash: '0xtxabc'},
        };

        const result = transition(Status.SIGNING, event, context);

        expect(result.state).toBe(Status.SUCCESS);
        expect(result.context.txHash).toBe('0xtxabc');
        expect(result.context.message).toBe('Hello world');
    });

    it('transitions from signing to error on FAIL', () => {
        const event: InscriptionEvent = {
            type: EventType.FAIL,
            payload: {error: 'User rejected the transaction'},
        };

        const result = transition(Status.SIGNING, event, baseContext);

        expect(result.state).toBe(Status.ERROR);
        expect(result.context.error).toBe('User rejected the transaction');
    });

    it('resets from error to idle on RESET', () => {
        const errorContext: InscriptionContext = {
            address: '0xdead',
            chain: 'SVM',
            message: 'fail test',
            error: 'Boom',
        };

        const result = transition(Status.ERROR, {type: EventType.RESET}, errorContext);

        expect(result.state).toBe(Status.IDLE);
        expect(result.context).toEqual({
            address: '',
            chain: 'EVM',
            message: '',
        });
    });

    it('returns same state/context for unknown event in current state', () => {
        const currentContext: InscriptionContext = {
            address: '0xexisting',
            chain: 'EVM',
            message: 'no change',
        };


        const result = transition(Status.IDLE, {type: 'UNKNOWN'} as any, currentContext);

        expect(result.state).toBe(Status.IDLE);
        expect(result.context).toEqual(currentContext);
    });
});
