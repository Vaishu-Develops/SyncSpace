import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import * as Y from 'yjs';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { SocketIOProvider } from '../utils/SocketIOProvider';
import ErrorBoundary from './ErrorBoundary';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Users
} from 'lucide-react';

const EditorComponent = ({ ydoc, provider, userInfo, userColor, workspaceId, projectId, onlineUsers, isProviderReady }) => {
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const saveDocument = useRef(null);
    
    useEffect(() => {
        saveDocument.current = async (content) => {
            setSaving(true);
            try {
                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const payload = { content };
                if (projectId) payload.projectId = projectId;

                await axios.put(`http://localhost:5000/api/documents/${workspaceId}`, payload, config);
                setLastSaved(new Date());
            } catch (error) {
                console.error('Error saving document:', error);
            } finally {
                setSaving(false);
            }
        };
    }, [workspaceId, projectId]);

    const saveTimeoutRef = useRef(null);
    const debouncedSave = useCallback((content) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            if (saveDocument.current) {
                saveDocument.current(content);
            }
        }, 1000);
    }, []);

    const extensions = useMemo(() => [
        StarterKit.configure({
            history: false,
            undoRedo: false,
        }),
        TextStyle,
        FontSize,
        Collaboration.configure({
            document: ydoc,
        }),
    ], [ydoc]);

    const editor = useEditor(
        provider && isProviderReady
            ? {
                extensions,
                editorProps: {
                    attributes: {
                        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] px-8 py-6',
                    },
                },
                onUpdate: ({ editor }) => {
                    debouncedSave(editor.getHTML());
                },
            }
            : null,
        [provider, isProviderReady, extensions]
    );

    // Always call useEffect for document fetching, but conditionally execute
    useEffect(() => {
        if (!editor) return;

        const fetchDocument = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                let url = `http://localhost:5000/api/documents/${workspaceId}`;
                if (projectId) {
                    url += `?projectId=${projectId}`;
                }

                const { data } = await axios.get(url, config);
                if (data.content && editor.isEmpty) {
                    editor.commands.setContent(data.content);
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        fetchDocument();
    }, [workspaceId, projectId, editor]);

    // Don't render anything if editor is not ready
    if (!editor) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p>Initializing editor...</p>
                </div>
            </div>
        );
    }

    const MenuButton = ({ onClick, isActive, children, title, disabled = false }) => (
        <button
            type="button"
            onClick={onClick}
            onMouseDown={(event) => event.preventDefault()}
            disabled={disabled}
            className={`p-2 rounded transition-colors ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-700'} ${isActive ? 'bg-slate-700 text-primary' : 'text-gray-400'}`}
            title={title}
            aria-label={title}
        >
            {children}
        </button>
    );

    return (
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-1 p-2 overflow-x-auto">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold"
                    >
                        <Bold className="h-4 w-4" />
                    </MenuButton>

                    <MenuButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic"
                    >
                        <Italic className="h-4 w-4" />
                    </MenuButton>

                    <MenuButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Strikethrough"
                    >
                        <Strikethrough className="h-4 w-4" />
                    </MenuButton>

                    <MenuButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive('code')}
                        title="Code"
                    >
                        <Code className="h-4 w-4" />
                    </MenuButton>

                    <div className="w-px h-6 bg-slate-700 mx-2"></div>

                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="Heading 1"
                    >
                        <Heading1 className="h-4 w-4" />
                    </MenuButton>

                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Heading 2"
                    >
                        <Heading2 className="h-4 w-4" />
                    </MenuButton>

                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        title="Heading 3"
                    >
                        <Heading3 className="h-4 w-4" />
                    </MenuButton>

                    <div className="w-px h-6 bg-slate-700 mx-2"></div>

                    <label className="relative">
                        <span className="sr-only">Font size</span>
                        <select
                            className="appearance-none bg-slate-700/60 text-gray-200 text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                            value={editor.getAttributes('textStyle')?.fontSize || 'default'}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (value === 'default') {
                                    editor.chain().focus().unsetMark('textStyle').run();
                                } else {
                                    editor.chain().focus().setMark('textStyle', { fontSize: value }).run();
                                }
                            }}
                            onMouseDown={(event) => event.preventDefault()}
                        >
                            <option value="default">Font</option>
                            <option value="12px">12</option>
                            <option value="14px">14</option>
                            <option value="16px">16</option>
                            <option value="18px">18</option>
                            <option value="20px">20</option>
                            <option value="24px">24</option>
                        </select>
                    </label>

                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </MenuButton>

                    <MenuButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Numbered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </MenuButton>

                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Quote"
                    >
                        <Quote className="h-4 w-4" />
                    </MenuButton>

                    <div className="w-px h-6 bg-slate-700 mx-2"></div>

                    <MenuButton
                        onClick={() => editor.chain().focus().undo().run()}
                        isActive={false}
                        disabled={!editor.can().undo()}
                        title="Undo"
                    >
                        <Undo className="h-4 w-4" />
                    </MenuButton>

                    <MenuButton
                        onClick={() => editor.chain().focus().redo().run()}
                        isActive={false}
                        disabled={!editor.can().redo()}
                        title="Redo"
                    >
                        <Redo className="h-4 w-4" />
                    </MenuButton>

                    <div className="ml-auto flex items-center gap-4 px-4">
                        <div className="flex -space-x-2">
                            {onlineUsers.map((state, i) => (
                                <div
                                    key={i}
                                    className="h-8 w-8 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs text-white font-bold"
                                    style={{ backgroundColor: state.user?.color || '#ccc' }}
                                    title={state.user?.name}
                                >
                                    {state.user?.name?.charAt(0).toUpperCase()}
                                </div>
                            ))}
                            {onlineUsers.length > 0 && (
                                <div className="h-8 w-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs text-gray-300">
                                    <Users className="h-4 w-4" />
                                </div>
                            )}
                        </div>

                        <div className="text-xs text-gray-400 flex items-center gap-1 border-l border-slate-700 pl-4">
                            {saving ? (
                                <>
                                    <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
                                    Saving...
                                </>
                            ) : lastSaved ? (
                                <>
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    Saved {lastSaved.toLocaleTimeString()}
                                </>
                            ) : (
                                <span>Ready</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-900">
                <div className="max-w-4xl mx-auto py-8">
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    );
};

const DocumentEditor = ({ projectId, workspaceId: propWorkspaceId }) => {
    const params = useParams();
    const workspaceId = propWorkspaceId || params.workspaceId;

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [provider, setProvider] = useState(null);
    const [isProviderReady, setIsProviderReady] = useState(false);

    // Create a stable Y.js document - use useMemo to ensure it's only created once
    const ydoc = useMemo(() => new Y.Doc(), []);

    const userInfo = useMemo(() => JSON.parse(localStorage.getItem('userInfo')), []);
    const userColor = useMemo(() => '#' + Math.floor(Math.random() * 16777215).toString(16), []);

    // Cleanup Y.js document on unmount
    useEffect(() => {
        return () => {
            if (ydoc) {
                ydoc.destroy();
            }
        };
    }, [ydoc]);

    useEffect(() => {
        const socket = io('http://localhost:5000', {
            forceNew: true,
            transports: ['polling', 'websocket'],
            upgrade: true,
            rememberUpgrade: false,
            timeout: 20000,
        });
        
        const room = `document-${workspaceId}${projectId ? `-${projectId}` : ''}`;
        let newProvider = null;

        const handleSocketConnect = () => {
            console.log('DocumentEditor socket connected');
            socket.emit('join-room', room);
            
            // Create provider after socket connection
            newProvider = new SocketIOProvider(socket, ydoc, room);

            // Wait a moment for provider to initialize and ensure all properties are available
            setTimeout(() => {
                const updateUsers = () => {
                    if (newProvider && newProvider.awareness) {
                        const states = Array.from(newProvider.awareness.getStates().values());
                        setOnlineUsers(states);
                    }
                };

                // Check if provider is fully ready with all required properties
                const isProviderComplete = newProvider && 
                                         newProvider.awareness && 
                                         newProvider.doc && 
                                         newProvider.doc === ydoc;

                if (isProviderComplete) {
                    newProvider.awareness.on('change', updateUsers);
                    
                    newProvider.awareness.setLocalStateField('user', {
                        name: userInfo?.name || 'Anonymous',
                        color: userColor
                    });

                    setProvider(newProvider);
                    setIsProviderReady(true);
                    console.log('Provider fully initialized');
                } else {
                    console.warn('Provider not completely ready, waiting...');
                    // Fallback polling with stricter checks
                    let attempts = 0;
                    const maxAttempts = 30; // 3 seconds with 100ms intervals
                    
                    const checkProviderComplete = setInterval(() => {
                        attempts++;
                        const isComplete = newProvider && 
                                         newProvider.awareness && 
                                         newProvider.doc && 
                                         newProvider.doc === ydoc;
                                         
                        if (isComplete) {
                            newProvider.awareness.on('change', updateUsers);
                            newProvider.awareness.setLocalStateField('user', {
                                name: userInfo?.name || 'Anonymous',
                                color: userColor
                            });
                            setProvider(newProvider);
                            setIsProviderReady(true);
                            clearInterval(checkProviderComplete);
                            console.log('Provider initialized after', attempts, 'attempts');
                        } else if (attempts >= maxAttempts) {
                            console.error('Provider failed to initialize properly after', maxAttempts, 'attempts');
                            clearInterval(checkProviderComplete);
                        }
                    }, 100);
                }
            }, 200); // Increased timeout to 200ms for more stable initialization
        };

        const handleSocketError = (error) => {
            console.error('Socket connection error:', error);
        };

        const handleSocketDisconnect = () => {
            console.log('Socket disconnected');
            setIsProviderReady(false);
        };

        socket.on('connect', handleSocketConnect);
        socket.on('connect_error', handleSocketError);
        socket.on('disconnect', handleSocketDisconnect);

        return () => {
            if (newProvider) {
                if (newProvider.awareness) {
                    newProvider.awareness.off('change', () => {});
                }
                newProvider.destroy();
            }
            socket.off('connect', handleSocketConnect);
            socket.off('connect_error', handleSocketError);
            socket.off('disconnect', handleSocketDisconnect);
            socket.disconnect();
        };
    }, [workspaceId, projectId, userInfo?.name, userColor]);

    // Don't render the editor until the provider is ready
    if (!provider || !isProviderReady) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p>Loading editor...</p>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <EditorComponent
                ydoc={ydoc}
                provider={provider}
                userInfo={userInfo}
                userColor={userColor}
                workspaceId={workspaceId}
                projectId={projectId}
                onlineUsers={onlineUsers}
                isProviderReady={isProviderReady}
            />
        </ErrorBoundary>
    );
};

export default DocumentEditor;
