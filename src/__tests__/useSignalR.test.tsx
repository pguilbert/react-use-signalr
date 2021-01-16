import { useSignalR } from "../useSignalR";
import { renderHook, act } from '@testing-library/react-hooks'
import { HubConnectionState } from "@microsoft/signalr";

describe('useSignalR', () => {

    it('should render when the connection is undefined', () => {
        const { result } = renderHook(() => useSignalR());

        expect(result.current.hubConnectionState).toBe(HubConnectionState.Disconnected);
        expect(result.current.error).toBeUndefined();
    });

});