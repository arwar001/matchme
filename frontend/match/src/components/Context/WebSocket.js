import {useContext, useEffect, useState, createContext, useCallback, useRef} from "react";
import {AuthContext} from "./AuthProvider";
import {Client} from "@stomp/stompjs";
import {Outlet} from "react-router-dom";
const wssUrl = process.env.REACT_APP_API_BASE_URL_WS;

export const WebSocketContext = createContext(null);

function WebSocket() {
    const {user} = useContext(AuthContext);

    const stompClient = useRef(null);
    const subscriptions = useRef({});
    const [isConnected, setIsConnected] = useState(false);


    useEffect(() => {
        const newStompClient = new Client({
            brokerURL: `${wssUrl}wss`,
            connectHeaders: {
                userId: user.id
            },
            debug: (str) => console.log(str),
            onConnect: () => {
                setIsConnected(true);
            },
            onDisconnect: () => {
                setIsConnected(false);
            }
        });

        newStompClient.activate();
        stompClient.current = newStompClient;

        return () => {
            console.log("Bye bye...");
            newStompClient.deactivate().then();
        }; // eslint-disable-next-line
    }, [user]);


    const subscribeToPath = useCallback((path, callback) => {
        if (!stompClient.current || !isConnected) {
            return;
        }

        if (subscriptions.current[path]) {
            console.warn(`Already subscribed to ${path}`);
            return;
        }

        const newSub = stompClient.current.subscribe(path, (message) => {
            callback(JSON.parse(message.body));
        });

        console.log(`Subscribed to ${path}`);

        subscriptions.current[path] = newSub;
    }, [isConnected]);

    const unsubscribeFromPath = useCallback((path) => {
        if (subscriptions.current[path]) {
            subscriptions.current[path].unsubscribe();
            delete subscriptions.current[path];
            console.log(`Unsubscribed from ${path}`);
        }
    }, []);


    return (
        <WebSocketContext.Provider value={{isConnected, subscribeToPath, unsubscribeFromPath}}>
            <Outlet />
        </WebSocketContext.Provider>
    )
}

export default WebSocket;