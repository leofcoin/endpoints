export declare const networkStats: (chain: any, networkVersion: any) => Promise<{
    version: any;
    peers: any;
    accounts: any;
    accountsHolding: number;
    accountsHoldingAmount: string;
    topHolders: any[];
}>;
declare const _default: {
    networkStats: (chain: any, networkVersion: any) => Promise<{
        version: any;
        peers: any;
        accounts: any;
        accountsHolding: number;
        accountsHoldingAmount: string;
        topHolders: any[];
    }>;
    bootstrap: () => Promise<any>;
};
export default _default;
