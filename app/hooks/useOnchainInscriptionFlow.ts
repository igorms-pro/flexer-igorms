/* eslint-disable @typescript-eslint/no-explicit-any */

import {useCallback, useReducer} from 'react';
import {sendMessageEvm} from '@/app/lib/onchain/sendMessageEvm';
import {sendMessageSvm} from '@/app/lib/onchain/sendMessageSvm';
import {usePublicClient, useWalletClient} from 'wagmi';
import {useConnection, useWallet} from '@solana/wallet-adapter-react';
import {transition} from '@/app/fsm/onchainMessageMachine';
import {InscriptionContext, InscriptionEvent, InscriptionStatus} from '@/app/fsm/onchainMessageMachineTypes';
import {EventType, Status} from '@/app/constants';

const initialContext: InscriptionContext = {
    address: '',
    chain: 'EVM',
    message: '',
};

const initialState = {
    state: Status.IDLE as InscriptionStatus,
    context: initialContext,
};

function reducer(
    state: { state: InscriptionStatus; context: InscriptionContext },
    event: InscriptionEvent
) {
    console.log('[FSM][REDUCER] Received event:', event);
    const result = transition(state.state, event, state.context);
    console.log('[FSM][REDUCER] New state:', result.state);
    console.log('[FSM][REDUCER] New context:', result.context);
    return result;
}

export const useOnchainInscriptionFlow = () => {
    const [{state, context}, dispatch] = useReducer(reducer, initialState);

    const {data: evmClient} = useWalletClient();
    const publicClient = usePublicClient();
    const {connection} = useConnection();
    const solanaWallet = useWallet();

    const start = useCallback(
        async ({
                   address,
                   chain,
                   message,
               }: {
            address: string;
            chain: 'EVM' | 'SVM';
            message: string;
        }) => {
            console.log('[FSM][HOOK] start() called');
            dispatch({type: EventType.START, payload: {address, chain, message}});
            dispatch({type: EventType.PREPARED});

            try {
                let txHash: string;

                if (chain === 'EVM') {
                    if (!evmClient || !publicClient) {
                        throw new Error('EVM wallet or public client not connected');
                    }

                    txHash = await sendMessageEvm({
                        client: evmClient,
                        publicClient,
                        address: address as `0x${string}`,
                        message,
                        chain: evmClient.chain!,
                    });
                } else {
                    txHash = await sendMessageSvm({
                        wallet: solanaWallet,
                        message,
                        connection,
                    });
                }

                dispatch({type: EventType.SIGNED, payload: {txHash}});
            } catch (e: any) {
                dispatch({type: EventType.FAIL, payload: {error: e.message}});
            }
        },
        [evmClient, publicClient, solanaWallet, connection]
    );

    const reset = () => {
        console.log('[FSM][HOOK] reset() called');
        dispatch({type: EventType.RESET});
    };

    return {
        state,
        context,
        start,
        reset,
    };
};
