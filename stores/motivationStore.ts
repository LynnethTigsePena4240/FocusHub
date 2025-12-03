import { useEffect, useState } from 'react';
const API_URL = 'https://dummyjson.com/quotes/random';

export type Quote = {
    content: string;
    author: string;
};

type MotivationState = {
    quote: Quote | null;
    isLoading: boolean;
    error: string | null;
};

// shared store object for this hook
let motivationState: MotivationState = {
    quote: { content: "Loading daily motivation...", author: "" },
    isLoading: false,
    error: null,
};

// subscribers for manual state updates
let listeners: (() => void)[] = [];

// notify all listeners when state changes
const emitChange = () => {
    listeners.forEach(listener => listener());
};

// merges new values into the store and updates subscribers
const updateState = (newState: Partial<MotivationState>) => {
    motivationState = { ...motivationState, ...newState };
    emitChange();
};

export const useMotivation = () => {
    const [state, setState] = useState<MotivationState>(motivationState);

    // register listener on mount
    useEffect(() => {
        const listener = () => {
            setState(motivationState);
        };

        listeners.push(listener);

        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }, []);

    // fetch a new quote from the API
    const fetchNewQuote = async () => {
        if (motivationState.isLoading) return;

        updateState({ isLoading: true, error: null });

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}.`);
            }

            const data = await response.json();
            console.log('Quotable response:', data);

            // expect backend to return "quote" and "author"
            if (data && data.quote) {
                updateState({
                    quote: {
                        content: data.quote.trim(),
                        author: (data.author || 'Unknown').trim(),
                    },
                    isLoading: false
                });
            } else {
                throw new Error("Received invalid response from quote API.");
            }

        } catch (e: any) {
            console.log('Quote fetch error:', e);
            updateState({
                error: `Failed to fetch quote. ${e?.message ?? 'Unknown error'}`,
                isLoading: false
            });
        }
    };

    // load a quote on first use
    useEffect(() => {
        if (!motivationState.quote || motivationState.quote.content === "Loading daily motivation...") {
            fetchNewQuote();
        }
    }, []);

    // expose current state + reload function
    return {
        quote: state.quote,
        isLoading: state.isLoading,
        error: state.error,
        fetchNewQuote,
    };
};
