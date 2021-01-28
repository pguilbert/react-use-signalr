import { renderHook } from "@testing-library/react-hooks";
import { useHubSender } from "../useHubSender";

describe('useHubSender', () => {
    const methodName = "TestMethod";
    it('should render when the connection is undefined.', () => {
        renderHook(() => useHubSender(undefined, methodName));
    });
});