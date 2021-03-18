import { HubConnection, IStreamSubscriber, ISubscription } from "@microsoft/signalr";
import { useCallback, useEffect, useRef } from "react";

export function useHubStream<TStreamItem>(connection: HubConnection, streamName: string, { next, complete, error }: IStreamSubscriber<TStreamItem>) {
    const stream = useRef<ISubscription<any>>();
    
    const start = useCallback((...args: any[])=> {
        if(stream.current) {
            return;
        }
        stream.current = connection.stream<TStreamItem>(streamName, ...args).subscribe({
            next,
            complete,
            error
        });
    }, [next, complete, error]);

    const stop = useCallback(() => stream.current?.dispose(), []);
    useEffect(() => () => stop(), [stop]);

    return { start, stop }
}