/* eslint-disable @typescript-eslint/no-explicit-any */
import {act, renderHook, waitFor} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {useOnchainInscriptionFlow} from '../useOnchainInscriptionFlow';
import {Status} from '@/app/constants';
import * as sendEvmModule from '@/app/lib/onchain/sendMessageEvm';
import * as sendSvmModule from '@/app/lib/onchain/sendMessageSvm';

vi.mock('wagmi', async () => {
    const actual = await vi.importActual<any>('wagmi');
    return {
        ...actual,
        useWalletClient: () => ({
            data: {
                sendTransaction: vi.fn(),
                chain: {id: 11155111},
            },
        }),
        usePublicClient: () => ({
            waitForTransactionReceipt: vi.fn().mockResolvedValue({status: 'confirmed'}),
        }),
    };
});

vi.mock('@solana/wallet-adapter-react', async () => {
    const actual = await vi.importActual<any>('@solana/wallet-adapter-react');
    return {
        ...actual,
        useConnection: () => ({connection: {}}),
        useWallet: () => ({publicKey: true, signTransaction: vi.fn()}),
    };
});

describe('useOnchainInscriptionFlow (hook)', () => {
    it('transitions to success on EVM send success', async () => {
        const txHash = '0xMOCKHASH';
        vi.spyOn(sendEvmModule, 'sendMessageEvm').mockResolvedValue(txHash);

        const {result} = renderHook(() => useOnchainInscriptionFlow());

        await act(async () => {
            await result.current.start({
                address: '0xabc',
                chain: 'EVM',
                message: 'Balance: $1000',
            });
        });

        await waitFor(() => {
            expect(result.current.state).toBe(Status.SUCCESS);
        });

        expect(result.current.context.txHash).toBe(txHash);
    });

    it('transitions to success on SVM send success', async () => {
        const txId = 'mock-solana-tx-id';
        vi.spyOn(sendSvmModule, 'sendMessageSvm').mockResolvedValue(txId);

        const {result} = renderHook(() => useOnchainInscriptionFlow());

        await act(async () => {
            await result.current.start({
                address: 'wallet1',
                chain: 'SVM',
                message: 'USD snapshot: 2345.67',
            });
        });

        await waitFor(() => {
            expect(result.current.state).toBe(Status.SUCCESS);
        });

        expect(result.current.context.txHash).toBe(txId);
    });

    it('transitions to error on failure', async () => {
        vi.spyOn(sendEvmModule, 'sendMessageEvm').mockRejectedValue(new Error('fail test'));

        const {result} = renderHook(() => useOnchainInscriptionFlow());

        await act(async () => {
            await result.current.start({
                address: '0xabc',
                chain: 'EVM',
                message: 'fail!',
            });
        });

        await waitFor(() => {
            expect(result.current.state).toBe(Status.ERROR);
        });

        expect(result.current.context.error).toContain('fail test');
    });

    it('resets to idle', () => {
        const {result} = renderHook(() => useOnchainInscriptionFlow());

        act(() => {
            result.current.reset();
        });

        expect(result.current.state).toBe(Status.IDLE);
        expect(result.current.context.address).toBe('');
    });
});
