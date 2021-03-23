import { HubConnection, IStreamSubscriber, ISubscription } from "@microsoft/signalr";
import { useCallback, useEffect, useRef, useState } from "react";

export enum HubStreamState {
    Standby, 
    Running,
    Completed
}

type UseHubStreamState = {
    state: HubStreamState
    error?: any
}

const initialeStreamState : UseHubStreamState = {
    state: HubStreamState.Standby,
}

export function useHubStream<TStreamItem>(connection: HubConnection, streamName: string, { next, complete, error }: IStreamSubscriber<TStreamItem>) {
    const [state, setState] = useState<UseHubStreamState>(initialeStreamState);
    const stream = useRef<ISubscription<any>>();
    
    const start = useCallback((...args: any[])=> {
        if(stream.current) {
            return;
        }

        stream.current = connection.stream<TStreamItem>(streamName, ...args).subscribe({
            next,
            complete: () => { setState({ ...state, state: HubStreamState.Completed}); complete(); },
            error: (err: any) => { setState({ error: err, state: HubStreamState.Completed}); error(err); },
        });

        setState({...state, state: HubStreamState.Running});
    }, [next, complete, error]);

    const stop = useCallback(() => {
        setState({...state, state: HubStreamState.Completed});
        stream.current?.dispose()
    }, []);

    useEffect(() => () => stop(), [stop]);

    return { start, stop, ...state }
}