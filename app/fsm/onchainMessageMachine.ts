import {InscriptionContext, InscriptionEvent, InscriptionStatus} from './onchainMessageMachineTypes';
import {EventType, Status} from '@/app/constants';

export const transition = (
    state: InscriptionStatus,
    event: InscriptionEvent,
    context: InscriptionContext
): { state: InscriptionStatus; context: InscriptionContext } => {
    console.log('[FSM][TRANSITION] Current state:', state);
    console.log('[FSM][TRANSITION] Received event:', event);
    console.log('[FSM][TRANSITION] Current context:', context);

    switch (state) {
        case Status.IDLE:
            if (event.type === EventType.START) {
                console.log('[FSM][TRANSITION] Moving from IDLE to PREPARING');
                return {
                    state: Status.PREPARING,
                    context: {...event.payload},
                };
            }
            break;

        case Status.PREPARING:
            if (event.type === EventType.PREPARED) {
                console.log('[FSM][TRANSITION] Moving from PREPARING to SIGNING');
                return {
                    state: Status.SIGNING,
                    context,
                };
            }
            break;

        case Status.SIGNING:
            if (event.type === EventType.SIGNED) {
                console.log('[FSM][TRANSITION] Moving from SIGNING to SUCCESS');
                return {
                    state: Status.SUCCESS,
                    context: {...context, txHash: event.payload.txHash},
                };
            }
            if (event.type === EventType.FAIL) {
                console.log('[FSM][TRANSITION] Moving from SIGNING to ERROR');
                return {
                    state: Status.ERROR,
                    context: {...context, error: event.payload.error},
                };
            }
            break;

        case Status.ERROR:
            if (event.type === EventType.RESET) {
                console.log('[FSM][TRANSITION] RESET from ERROR to IDLE');
                return {
                    state: Status.IDLE,
                    context: {
                        address: '',
                        chain: 'EVM',
                        message: '',
                    },
                };
            }
            break;

        case Status.SUCCESS:
            if (event.type === EventType.RESET) {
                console.log('[FSM][TRANSITION] RESET from SUCCESS to IDLE');
                return {
                    state: Status.IDLE,
                    context: {
                        address: '',
                        chain: 'EVM',
                        message: '',
                    },
                };
            }
            break;
    }

    console.warn('[FSM][TRANSITION] No state change');
    return {state, context};
};
