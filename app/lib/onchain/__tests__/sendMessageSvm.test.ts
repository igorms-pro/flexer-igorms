/* eslint-disable @typescript-eslint/no-explicit-any */
import {describe, expect, it, vi} from 'vitest';
import {sendMessageSvm} from '../sendMessageSvm';
import {Connection, PublicKey} from '@solana/web3.js';

const mockPublicKey = new PublicKey('8fj9wF4gq9r2k2r5S7o7vQh5vQh5vQh5vQh5vQh5vQh5');

describe('sendMessageSvm (Devnet)', () => {
    const mockConnection = new Connection('https://api.devnet.solana.com');

    const mockWallet = {
        connected: true,
        publicKey: mockPublicKey,
        signTransaction: vi.fn().mockImplementation(async (tx) => tx),
    };

    // TODO
    it.skip('should create and send a transaction with memo', async () => {
        const sendSpy = vi
            .spyOn(mockConnection, 'sendRawTransaction')
            .mockResolvedValue('mockTxId');

        const blockhashSpy = vi
            .spyOn(mockConnection, 'getLatestBlockhash')
            .mockResolvedValue({
                blockhash: 'mock-blockhash',
                lastValidBlockHeight: 123456,
            });
        const confirmSpy = vi
            .spyOn(mockConnection, 'confirmTransaction')
            .mockResolvedValue({
                context: {slot: 123},
                value: {err: null},
            });

        expect(mockWallet.publicKey instanceof PublicKey).toBe(true);

        const message = 'Hello Memo';
        const txId = await sendMessageSvm({
            wallet: mockWallet as any,
            message,
            connection: mockConnection,
        });

        expect(mockWallet.signTransaction).toHaveBeenCalled();
        expect(sendSpy).toHaveBeenCalled();
        expect(blockhashSpy).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalledWith({
            signature: 'mockTxId',
            blockhash: 'mock-blockhash',
            lastValidBlockHeight: 123456,
        });

        expect(txId).toBe('mockTxId');
    });

    it('should throw if wallet not connected', async () => {
        const disconnectedWallet = {
            connected: false,
            publicKey: null,
            signTransaction: undefined,
        };

        await expect(
            sendMessageSvm({
                wallet: disconnectedWallet as any,
                message: 'Fail',
                connection: mockConnection,
            })
        ).rejects.toThrow('Wallet not connected');
    });
});
