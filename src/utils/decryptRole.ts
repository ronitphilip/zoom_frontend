export interface Permissions {
    [key: string]: string[];
}

export interface RoleAttributes {
    id?: number;
    role: string;
    permissions: Permissions;
}

export async function decryptRole(encryptedHex: string, ivHex: string, base64Key: string): Promise<RoleAttributes> {

    const encryptedData = hexToBytes(encryptedHex);
    const iv = hexToBytes(ivHex);

    const keyBytes = new TextEncoder().encode(base64Key);

    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-CBC" },
        false,
        ["decrypt"]
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
        {
            name: "AES-CBC",
            iv: iv
        },
        cryptoKey,
        encryptedData
    );

    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decryptedBuffer);
    return JSON.parse(decryptedString) as RoleAttributes;
}

function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
}

