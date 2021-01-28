import {  useHubReceiver } from "../useHubReceiver";
import { renderHook } from "@testing-library/react-hooks";
import { HubConnection } from "@microsoft/signalr";


describe('useHubReceiver', () => {
    const hubConnectionMock = {
        on: jest.fn((methodName: string, newMethod: (...args: any[]) => {}) => {}),
        off: jest.fn((methodName: string, newMethod: (...args: any[]) => {}) => {})
    } as unknown as HubConnection;
    const methodName = "TestMethod";
    const methodMock = () => {};

    it('should render when the connection is undefined.', () => {
        renderHook(() => useHubReceiver(undefined, methodName, methodMock));
    });

    it('should register/unregister the method handler', async () => {
        const { rerender } = renderHook((mName: string) => useHubReceiver(hubConnectionMock, mName, (methodMock)), { initialProps: methodName});
        expect(hubConnectionMock.on).toBeCalledWith(methodName, methodMock);
        rerender("TEST2");
        expect(hubConnectionMock.off).toBeCalledWith(methodName, methodMock);
    });
});