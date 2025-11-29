import * as Y from 'yjs';

class EventEmitter {
    constructor() {
        this.listeners = new Map();
    }
    on(event, callback) {
        if (!this.listeners.has(event)) this.listeners.set(event, new Set());
        this.listeners.get(event).add(callback);
    }
    off(event, callback) {
        if (this.listeners.has(event)) this.listeners.get(event).delete(callback);
    }
    emit(event, ...args) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(cb => cb(...args));
        }
    }
    destroy() {
        this.listeners.clear();
    }
}

class SimpleAwareness extends EventEmitter {
    constructor(doc) {
        super();
        this.doc = doc;
        this.clientID = doc.clientID;
        this.states = new Map();
    }

    getStates() {
        return this.states;
    }

    setLocalState(state) {
        this.states.set(this.clientID, state);
        this.emit('update', { clientID: this.clientID, state });
        this.emit('change', { added: [], updated: [this.clientID], removed: [] });
    }

    setLocalStateField(field, value) {
        const state = { ...(this.states.get(this.clientID) || {}) };
        state[field] = value;
        this.setLocalState(state);
    }

    applyRemoteUpdate(clientID, state) {
        if (state === null) {
            if (this.states.has(clientID)) {
                this.states.delete(clientID);
                this.emit('change', { added: [], updated: [], removed: [clientID] });
            }
        } else {
            const isNew = !this.states.has(clientID);
            this.states.set(clientID, state);
            if (isNew) {
                this.emit('change', { added: [clientID], updated: [], removed: [] });
            } else {
                this.emit('change', { added: [], updated: [clientID], removed: [] });
            }
        }
    }
}

export class SocketIOProvider {
    constructor(socket, doc, room) {
        if (!socket || !doc || !room) {
            throw new Error('SocketIOProvider requires socket, doc, and room parameters');
        }

        this.socket = socket;
        this.doc = doc;  // Make sure doc is accessible for TipTap
        this.document = doc; // Alias for compatibility
        this.room = room;
        this.awareness = new SimpleAwareness(doc);

        // Add properties that TipTap's CollaborationCursor expects
        this.awareness.doc = doc;  // Ensure awareness has doc reference
        this.awareness.document = doc; // Alias for compatibility
        this.awareness.clientID = doc.clientID;

        // Flag to indicate if provider is fully ready
        this._isReady = false;

        this.onUpdate = (update, origin) => {
            if (origin !== this) {
                this.socket.emit('yjs-update', {
                    room: this.room,
                    update: update
                });
            }
        };

        this.onSocketUpdate = (update) => {
            try {
                const updateArray = new Uint8Array(update);
                Y.applyUpdate(this.doc, updateArray, this);
            } catch (error) {
                console.error('Error applying Y.js update:', error);
            }
        };

        this.onSyncRequest = ({ requestorId }) => {
            try {
                const state = Y.encodeStateAsUpdate(this.doc);
                this.socket.emit('yjs-sync-response', {
                    room: this.room,
                    update: state,
                    targetId: requestorId
                });
            } catch (error) {
                console.error('Error handling sync request:', error);
            }
        };

        this.onAwarenessUpdate = ({ clientID, state }) => {
            this.socket.emit('yjs-awareness', {
                room: this.room,
                update: { clientID, state }
            });
        };

        this.onSocketAwareness = ({ update }) => {
            try {
                const { clientID, state } = update;
                if (clientID !== this.doc.clientID) {
                    this.awareness.applyRemoteUpdate(clientID, state);
                }
            } catch (error) {
                console.error('Error applying awareness update:', error);
            }
        };

        // Setup listeners
        this.doc.on('update', this.onUpdate);
        this.socket.on('yjs-update', this.onSocketUpdate);
        this.socket.on('yjs-sync-request', this.onSyncRequest);

        // Awareness listeners
        this.awareness.on('update', this.onAwarenessUpdate);
        this.socket.on('yjs-awareness', this.onSocketAwareness);

        // Request initial sync
        this.socket.emit('yjs-sync-request', { room: this.room });

        // Mark as ready after setup
        this._isReady = true;
    }

    // Getter to check if provider is ready
    get isReady() {
        return this._isReady && this.doc && this.awareness;
    }

    destroy() {
        this._isReady = false;
        
        if (this.doc) {
            this.doc.off('update', this.onUpdate);
        }
        
        if (this.socket) {
            this.socket.off('yjs-update', this.onSocketUpdate);
            this.socket.off('yjs-sync-request', this.onSyncRequest);
            this.socket.off('yjs-awareness', this.onSocketAwareness);
        }

        if (this.awareness) {
            this.awareness.off('update', this.onAwarenessUpdate);
            this.awareness.destroy();
        }
    }
}
