import {InscriptionContext, InscriptionEvent, InscriptionStatus} from './onchainMessageMachineTypes'
import {EventType, Status} from '@/app/constants'

export const transition = (
    state: InscriptionStatus,
    event: InscriptionEvent,
    context: InscriptionContext
): { state: InscriptionStatus; context: InscriptionContext } => {
    switch (state) {
        case Status.IDLE:
            if (event.type === EventType.START) {
                return {
                    state: Status.PREPARING,
                    context: {...event.payload},
                }
            }
            break

        case Status.PREPARING:
            if (event.type === EventType.PREPARED) {
                return {
                    state: Status.SIGNING,
                    context,
                }
            }
            break

        case Status.SIGNING:
            if (event.type === EventType.SIGNED) {
                return {
                    state: Status.SUCCESS,
                    context: {...context, txHash: event.payload.txHash},
                }
            }
            if (event.type === EventType.FAIL) {
                return {
                    state: Status.ERROR,
                    context: {...context, error: event.payload.error},
                }
            }
            break

        case Status.ERROR:
        case Status.SUCCESS:
            if (event.type === EventType.RESET) {
                return {
                    state: Status.IDLE,
                    context: {
                        address: '',
                        chain: 'EVM',
                        message: '',
                    },
                }
            }
            break
    }

    return {state, context}
}
