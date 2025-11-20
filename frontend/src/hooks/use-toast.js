// Forward compatible shim: re-export TypeScript implementation
// so imports that reference the .js file still resolve.
import * as React from "react";

// Minimal JS implementation of the toast system (mirrors the TS version).
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

let count = 0;
function genId() {
	count = (count + 1) % Number.MAX_SAFE_INTEGER;
	return count.toString();
}

const listeners = [];
let memoryState = { toasts: [] };
const toastTimeouts = new Map();

function dispatch(action) {
	// very small reducer inline to avoid duplication with TS
	if (action.type === 'ADD_TOAST') {
		memoryState = { ...memoryState, toasts: [action.toast, ...memoryState.toasts].slice(0, TOAST_LIMIT) };
	} else if (action.type === 'UPDATE_TOAST') {
		memoryState = { ...memoryState, toasts: memoryState.toasts.map(t => (t.id === action.toast.id ? { ...t, ...action.toast } : t)) };
	} else if (action.type === 'DISMISS_TOAST') {
		const { toastId } = action;
		if (toastId) {
			if (!toastTimeouts.has(toastId)) {
				const timeout = setTimeout(() => {
					toastTimeouts.delete(toastId);
					dispatch({ type: 'REMOVE_TOAST', toastId });
				}, TOAST_REMOVE_DELAY);
				toastTimeouts.set(toastId, timeout);
			}
		} else {
			memoryState.toasts.forEach(t => {
				if (!toastTimeouts.has(t.id)) {
					const timeout = setTimeout(() => {
						toastTimeouts.delete(t.id);
						dispatch({ type: 'REMOVE_TOAST', toastId: t.id });
					}, TOAST_REMOVE_DELAY);
					toastTimeouts.set(t.id, timeout);
				}
			});
		}
		memoryState = { ...memoryState, toasts: memoryState.toasts.map(t => ({ ...t, open: t.id === action.toastId || action.toastId === undefined ? false : t.open })) };
	} else if (action.type === 'REMOVE_TOAST') {
		if (action.toastId === undefined) {
			memoryState = { ...memoryState, toasts: [] };
		} else {
			memoryState = { ...memoryState, toasts: memoryState.toasts.filter(t => t.id !== action.toastId) };
		}
	}

	listeners.forEach(l => l(memoryState));
}

function toast(props) {
	const id = genId();
	const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });
	const update = (p) => dispatch({ type: 'UPDATE_TOAST', toast: { ...p, id } });

	dispatch({
		type: 'ADD_TOAST',
		toast: {
			...props,
			id,
			open: true,
			onOpenChange: (open) => {
				if (!open) dismiss();
			},
		},
	});

	return { id, dismiss, update };
}

function useToast() {
	const [state, setState] = React.useState(memoryState);
	React.useEffect(() => {
		listeners.push(setState);
		return () => {
			const i = listeners.indexOf(setState);
			if (i > -1) listeners.splice(i, 1);
		};
	}, []);

	return {
		...state,
		toast,
		dismiss: (toastId) => dispatch({ type: 'DISMISS_TOAST', toastId }),
	};
}

export { useToast, toast };