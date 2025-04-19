/* eslint-disable @typescript-eslint/no-explicit-any */
import {describe, expect, it, vi} from 'vitest';
import {sendMessageEvm} from '../sendMessageEvm';
import {Address, toHex} from 'viem';
import {sepolia} from 'viem/chains';
import {getMockAccount} from '@/app/utils/test-utils';

describe('sendMessageEvm (Sepolia)', () => {
    const mockAddress = getMockAccount().address as Address;

    const mockClient = {
        sendTransaction: vi.fn().mockResolvedValue('0xtesthash'),
    } as any;

    const mockPublicClient = {
        waitForTransactionReceipt: vi.fn().mockResolvedValue({status: 'success'}),
    } as any;

    const params = {
        client: mockClient,
        publicClient: mockPublicClient,
        message: 'Cumulative USD: $1234.56',
        address: mockAddress,
        chain: sepolia,
    };

    it('should encode the message, call sendTransaction, then wait for receipt', async () => {
        const result = await sendMessageEvm(params);

        expect(mockClient.sendTransaction).toHaveBeenCalledWith({
            account: mockAddress,
            to: mockAddress,
            data: toHex(params.message),
            value: BigInt(0),
            chain: sepolia,
        });

        expect(mockPublicClient.waitForTransactionReceipt).toHaveBeenCalledWith({
            hash: '0xtesthash',
        });

        expect(result).toBe('0xtesthash');
    });
});
