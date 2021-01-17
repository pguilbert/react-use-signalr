import { useSignalR } from "../useSignalR";
import { renderHook, act } from '@testing-library/react-hooks'
import { HubConnection, HubConnectionState } from "@microsoft/signalr";

describe('useSignalR', () => {
    const hubConnectionMock = { 
        state: HubConnectionState.Disconnected,
        start: jest.fn(() => new Promise(() => {})),
        stop: jest.fn(() => new Promise(() => {})),
        onclose: jest.fn((callback: (error?: Error) => void) => {}),
        onreconnected: jest.fn((callback: (error?: Error) => void) => {}),
        onreconnecting: jest.fn((callback: (error?: Error) => void) => {}),
    } as unknown as HubConnection;

    it('should render when the connection is undefined.', () => {
        const { result } = renderHook(() => useSignalR());

        expect(result.current.hubConnectionState).toBe(HubConnectionState.Disconnected);
        expect(result.current.error).toBeUndefined();
    });

    it("should provide the error when start() fail.", async () => {
        const error = new Error("Test");
        const mock = { ... hubConnectionMock, start: jest.fn(() => new Promise(() => { throw error; })) } as unknown as HubConnection;
        const { start: startFn } = mock;
        
        const { result, waitForNextUpdate } = renderHook(() => useSignalR(mock));
        await waitForNextUpdate();
        expect(startFn).toBeCalled();
        expect(result.current.error).toBe(error);
    });

    it("should start/stop on component mount/unmount", async () => {
        const { start: startFn, stop: stopFn } = hubConnectionMock;

        const { result, unmount } = renderHook(() => useSignalR(hubConnectionMock));
        expect(startFn).toBeCalled();
        unmount();
        expect(stopFn).toBeCalled();
    })
});