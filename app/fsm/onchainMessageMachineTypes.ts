import {EventType, Status} from '@/app/constants';

export type InscriptionStatus = (typeof Status)[keyof typeof Status];

export interface InscriptionContext {
    address: string;
    chain: 'EVM' | 'SVM';
    message: string;
    txHash?: string;
    error?: string;
}

export type InscriptionEvent =
    | { type: typeof EventType.START; payload: { address: string; chain: 'EVM' | 'SVM'; message: string } }
    | { type: typeof EventType.PREPARED }
    | { type: typeof EventType.SIGNED; payload: { txHash: string } }
    | { type: typeof EventType.FAIL; payload: { error: string } }
    | { type: typeof EventType.RESET };
