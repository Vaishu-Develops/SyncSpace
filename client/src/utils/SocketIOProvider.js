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
        this.socket = socket;
        this.doc = doc;  // Make sure doc is accessible for TipTap
        this.room = room;
        this.awareness = new SimpleAwareness(doc);
        
        // Add properties that TipTap's CollaborationCursor expects
        this.awareness.doc = doc;  // Ensure awareness has doc reference
        this.awareness.clientID = doc.clientID;

        this.onUpdate = (update, origin) => {
            if (origin !== this) {
                this.socket.emit('yjs-update', {
                    room: this.room,
                    update: update
                });
            }
        };

        this.onSocketUpdate = (update) => {
            const updateArray = new Uint8Array(update);
            Y.applyUpdate(this.doc, updateArray, this);
        };

        this.onSyncRequest = ({ requestorId }) => {
            const state = Y.encodeStateAsUpdate(this.doc);
            this.socket.emit('yjs-sync-response', {
                room: this.room,
                update: state,
                targetId: requestorId
            });
        };

        this.onAwarenessUpdate = ({ clientID, state }) => {
            this.socket.emit('yjs-awareness', {
                room: this.room,
                update: { clientID, state }
            });
        };

        this.onSocketAwareness = ({ update }) => {
            const { clientID, state } = update;
            if (clientID !== this.doc.clientID) {
                this.awareness.applyRemoteUpdate(clientID, state);
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
    }

    destroy() {
        this.doc.off('update', this.onUpdate);
        this.socket.off('yjs-update', this.onSocketUpdate);
        this.socket.off('yjs-sync-request', this.onSyncRequest);

        this.awareness.off('update', this.onAwarenessUpdate);
        this.socket.off('yjs-awareness', this.onSocketAwareness);
        this.awareness.destroy();
    }
}
