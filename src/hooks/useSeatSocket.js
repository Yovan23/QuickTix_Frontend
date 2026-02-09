import { useState, useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// Environment Configuration
const WS_BASE_URL = import.meta.env.VITE_WS_URL;
const REALTIME_ENABLED = import.meta.env.VITE_REALTIME_ENABLED === 'true';

// Retry Configuration
const MAX_RETRY_COUNT = 5;
const INITIAL_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 30000;

/**
 * Hook for real-time seat updates via WebSocket
 * Features:
 * - Safety checks: won't connect if disabled or missing URL
 * - Bounded retries: stops after MAX_RETRY_COUNT
 * - Graceful degradation: isDisabled becomes true on failure
 * - Component-scoped: cleans up on unmount
 * 
 * @param {string} showId - Show ID to subscribe to
 * @param {number|string} currentUserId - Current user's ID
 * @returns {Object} { socketSeats, isConnected, error, isDisabled }
 */
export function useSeatSocket(showId, currentUserId) {
    const [socketSeats, setSocketSeats] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [error, setError] = useState(null);

    const stompClientRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const retryCountRef = useRef(0);
    const mountedRef = useRef(true);

    // Initial validation check
    useEffect(() => {
        if (!REALTIME_ENABLED) {
            console.log('[useSeatSocket] Real-time updates disabled by config');
            setIsDisabled(true);
        } else if (!WS_BASE_URL) {
            console.warn('[useSeatSocket] VITE_WS_URL not defined. Real-time updates disabled.');
            setIsDisabled(true);
        }
    }, []);

    // Conditional logger
    const debugLog = (...args) => {
        if (import.meta.env.DEV) {
            console.log(...args);
        }
    };

    const connect = useCallback(() => {
        // Safety guards
        if (!REALTIME_ENABLED || !WS_BASE_URL || isDisabled || !showId || !mountedRef.current) {
            return;
        }

        // Prevent duplicate connection attempts
        if (stompClientRef.current?.connected) {
            return;
        }

        try {
            debugLog(`[useSeatSocket] Connecting to ${WS_BASE_URL} (attempt ${retryCountRef.current + 1}/${MAX_RETRY_COUNT})`);

            const socket = new SockJS(WS_BASE_URL);
            const stompClient = Stomp.over(socket);

            // Disable debug logs in production
            stompClient.debug = import.meta.env.DEV ? console.log : () => { };

            stompClient.connect(
                {},
                () => { // On Success
                    if (!mountedRef.current) {
                        try { stompClient.disconnect(); } catch (e) { /* ignore */ }
                        return;
                    }

                    debugLog('[useSeatSocket] Connected successfully');
                    setIsConnected(true);
                    setError(null);
                    retryCountRef.current = 0; // Reset retries

                    // Subscribe to topic
                    try {
                        stompClient.subscribe(`/topic/show/${showId}`, (message) => {
                            if (!mountedRef.current) return;

                            try {
                                const payload = JSON.parse(message.body);
                                const { seats, status, userId } = payload;

                                // Skip updates from self to avoid flicker (optional, depending on UX preference)
                                // if (userId == currentUserId) return;

                                if (seats && Array.isArray(seats)) {
                                    setSocketSeats(prev => {
                                        const updated = { ...prev };
                                        seats.forEach(seatNo => {
                                            updated[seatNo] = {
                                                status,
                                                userId,
                                                timestamp: Date.now()
                                            };
                                        });
                                        return updated;
                                    });
                                }
                            } catch (parseError) {
                                console.error('[useSeatSocket] Message parse error:', parseError);
                            }
                        });
                    } catch (subError) {
                        console.error('[useSeatSocket] Subscription error:', subError);
                    }
                },
                (err) => { // On Failure
                    if (!mountedRef.current) return;

                    // Downgrade to warn or debug
                    if (import.meta.env.DEV) {
                        console.warn('[useSeatSocket] Connection error/closed:', err);
                    }

                    setIsConnected(false);
                    stompClientRef.current = null; // Clear client ref

                    // Handle Retries
                    retryCountRef.current++;

                    if (retryCountRef.current >= MAX_RETRY_COUNT) {
                        console.warn('[useSeatSocket] Max retries reached. Disabling real-time updates.');
                        setError('Real-time updates unavailable. Using manual refresh.');
                        setIsDisabled(true);
                        return;
                    }

                    // Exponential Backoff
                    const delay = Math.min(
                        INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCountRef.current - 1),
                        MAX_RETRY_DELAY_MS
                    );

                    debugLog(`[useSeatSocket] Retrying in ${delay}ms...`);

                    reconnectTimeoutRef.current = setTimeout(() => {
                        if (mountedRef.current && !isDisabled) {
                            connect();
                        }
                    }, delay);
                }
            );

            stompClientRef.current = stompClient;

        } catch (err) {
            console.error('[useSeatSocket] Initialization error:', err);
            if (mountedRef.current) {
                setError('Failed to initialize WebSocket');
                // Don't retry on initialization crash (e.g. SockJS missing)
                setIsDisabled(true);
            }
        }
    }, [showId, isDisabled]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (stompClientRef.current) {
            try {
                if (stompClientRef.current.connected) {
                    stompClientRef.current.disconnect(() => {
                        console.log('[useSeatSocket] Disconnected');
                    });
                }
            } catch (ignore) { /* safe ignore */ }
            stompClientRef.current = null;
        }

        setIsConnected(false);
    }, []);

    // Lifecycle Management
    useEffect(() => {
        mountedRef.current = true;

        // Reset state on new showId
        setSocketSeats({});
        retryCountRef.current = 0;
        setIsDisabled(false); // Reset disabled state for new show (unless globally disabled)

        // Check config again strictly
        if (!REALTIME_ENABLED || !WS_BASE_URL) {
            setIsDisabled(true);
            return;
        }

        connect();

        return () => {
            mountedRef.current = false;
            disconnect();
        };
    }, [showId, connect, disconnect]);

    return {
        socketSeats,
        isConnected,
        isDisabled,
        error
    };
}
