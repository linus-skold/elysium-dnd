

declare namespace socketlib {
    function registerModule(moduleName: string): SocketlibSocket;
    function registerSystem(systemId: string): SocketlibSocket;
}

declare class SocketlibSocket {
    register(eventStr: string, callback: any): void;

    executeAsUser(handler: any, userId: string, ...args: any)
    executeForEveryone(handler: any, ...args: any)
    executeForOthers(handler: any, ...args: any)
    executeForUsers(handler: any, recipients: string[], ...args: any)
    
    executeAsGM(handler: any, ...args: any)
    executeForAllGMs(handler: any, ...args: any)
    executeForOtherGMs(handler: any, ...args: any)
}

