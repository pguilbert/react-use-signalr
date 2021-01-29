import { useHub } from "../useHub";
import { renderHook } from '@testing-library/react-hooks'
import { HubConnection, HubConnectionState } from "@microsoft/signalr";

describe('useHub', () => {
    const hubConnectionMock = { 
        state: HubConnectionState.Disconnected,
        start: jest.fn(() => Promise.reject()),
        stop: jest.fn(() => new Promise(() => {})),
        onclose: jest.fn((callback: (error?: Error) => void) => {}),
        onreconnected: jest.fn((callback: (error?: Error) => void) => {}),
        onreconnecting: jest.fn((callback: (error?: Error) => void) => {}),
    } as unknown as HubConnection;

    it('should render when the connection is undefined.', async () => {
        let mock : HubConnection | undefined = undefined;

        //the connection is undefined on the first render. Ok?
        const { result, rerender } = renderHook(() => useHub(mock));
        expect(result.current.hubConnectionState).toBe(HubConnectionState.Disconnected);
        expect(result.current.error).toBeUndefined();

        //the connection change from defined to undefined. Ok?
        mock = {... hubConnectionMock, state: HubConnectionState.Connected} as unknown as HubConnection;;
        rerender();
        expect(result.current.hubConnectionState).toBe(HubConnectionState.Connected);
        mock = undefined;
        rerender();
        expect(result.current.hubConnectionState).toBe(HubConnectionState.Disconnected);
        expect(result.current.error).toBeUndefined();
    });

    it("should provide the error when start() fail.", async () => {
        const error = new Error("Test");
        const mock = { ... hubConnectionMock, start: jest.fn(() => new Promise(() => { throw error; })) } as unknown as HubConnection;
        const { start: startFn } = mock;
        
        const { result, waitForNextUpdate } = renderHook(() => useHub(mock));
        await waitForNextUpdate();
        expect(startFn).toBeCalled();
        expect(result.current.error).toBe(error);
    });

    it("should start/stop on component mount/unmount", async () => {
        const { start: startFn, stop: stopFn } = hubConnectionMock;

        const { result, unmount } = renderHook(() => useHub(hubConnectionMock));
        expect(startFn).toBeCalled();
        unmount();
        expect(stopFn).toBeCalled();
    });
});