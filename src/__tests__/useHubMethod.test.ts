import { renderHook } from "@testing-library/react-hooks";
import { useHubMethod } from "../useHubMethod";

describe('useHubMethod', () => {
    const methodName = "TestMethod";
    it('should render when the connection is undefined.', () => {
        renderHook(() => useHubMethod(undefined, methodName));
    });
});