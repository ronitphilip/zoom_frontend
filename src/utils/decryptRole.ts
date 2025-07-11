import { Crypto } from '@peculiar/webcrypto';

const cryptoImpl = typeof window === 'undefined' ? new Crypto() : crypto;

export interface Permissions {
    [key: string]: string[];
}

export interface RoleAttributes {
    id?: number;
    role: string;
    permissions: Permissions;
}

export async function decryptRole(encryptedHex: string, ivHex: string, base64Key: string): Promise<RoleAttributes> {
    try {
        console.log('cryptoImpl available:', !!cryptoImpl);
        console.log('cryptoImpl.subtle available:', !!cryptoImpl?.subtle);

        const encryptedData = hexToBytes(encryptedHex);
        const iv = hexToBytes(ivHex);

        const keyBytes = new TextEncoder().encode(base64Key);

        const cryptoKey = await cryptoImpl.subtle.importKey(
            'raw',
            keyBytes,
            { name: 'AES-CBC' },
            false,
            ['decrypt']
        );

        const decryptedBuffer = await cryptoImpl.subtle.decrypt(
            {
                name: 'AES-CBC',
                iv: iv,
            },
            cryptoKey,
            encryptedData
        );

        const decoder = new TextDecoder();
        const decryptedString = decoder.decode(decryptedBuffer);
        return JSON.parse(decryptedString) as RoleAttributes;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Decryption failed');
    }
}

function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
}