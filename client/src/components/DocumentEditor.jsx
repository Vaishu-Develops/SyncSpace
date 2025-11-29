import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontSize } from '../extensions/FontSize';
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
            // Enable history but let Collaboration handle the sync
            history: {
                depth: 10,
                newGroupDelay: 500,
            },
            heading: {
                levels: [1, 2, 3, 4, 5, 6],
                HTMLAttributes: {
                    class: 'heading',
                },
            },
            paragraph: {
                HTMLAttributes: {
                    class: 'paragraph',
                },
            },
            bulletList: {
                itemTypeName: 'listItem',
                keepMarks: true,
                keepAttributes: false,
            },
            orderedList: {
                itemTypeName: 'listItem', 
                keepMarks: true,
                keepAttributes: false,
            },
            listItem: {
                keepMarks: true,
                keepAttributes: false,
            },
        }),
        TextStyle,
        FontSize,
        Collaboration.configure({
            document: ydoc,
        }),
    ], [ydoc]);

    const editor = useEditor({
        extensions,
        editable: true,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] px-8 py-6',
            },
        },
        onUpdate: ({ editor }) => {
            debouncedSave(editor.getHTML());
        },
        onCreate: ({ editor }) => {
            console.log('Editor created successfully');
            console.log('Editor commands available:', Object.keys(editor.commands));
            console.log('Editor extensions:', editor.extensionManager.extensions.map(ext => ext.name));
        },
        onSelectionUpdate: ({ editor }) => {
            // Force update to refresh toolbar state
            if (editor) {
                setTimeout(() => {
                    // Trigger re-render by checking active states
                }, 0);
            }
        },
    }, [extensions]);

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
            onClick={(e) => {
                e.preventDefault();
                try {
                    if (onClick && !disabled) {
                        onClick();
                    }
                } catch (error) {
                    console.error(`Error in ${title} button:`, error);
                }
            }}
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
                        onClick={() => {
                            if (!editor || !editor.isEditable) {
                                console.log('Editor not ready');
                                return;
                            }
                            try {
                                console.log('Clicking H1 button');
                                editor.chain().focus().toggleHeading({ level: 1 }).run();
                                console.log('H1 command executed');
                            } catch (error) {
                                console.error('Heading 1 error:', error);
                            }
                        }}
                        isActive={editor?.isActive('heading', { level: 1 }) || false}
                        title="Heading 1"
                    >
                        <Heading1 className="h-4 w-4" />
                    </MenuButton>

                    <MenuButton
                        onClick={() => {
                            if (!editor || !editor.isEditable) {
                                console.log('Editor not ready');
                                return;
                            }
                            try {
                                console.log('Clicking H2 button');
                                editor.chain().focus().toggleHeading({ level: 2 }).run();
                                console.log('H2 command executed');
                            } catch (error) {
                                console.error('Heading 2 error:', error);
                            }
                        }}
                        isActive={editor?.isActive('heading', { level: 2 }) || false}
                        title="Heading 2"
                    >
                        <Heading2 className="h-4 w-4" />
                    </MenuButton>

                    <MenuButton
                        onClick={() => {
                            if (!editor || !editor.isEditable) {
                                console.log('Editor not ready');
                                return;
                            }
                            try {
                                console.log('Clicking H3 button');
                                editor.chain().focus().toggleHeading({ level: 3 }).run();
                                console.log('H3 command executed');
                            } catch (error) {
                                console.error('Heading 3 error:', error);
                            }
                        }}
                        isActive={editor?.isActive('heading', { level: 3 }) || false}
                        title="Heading 3"
                    >
                        <Heading3 className="h-4 w-4" />
                    </MenuButton>

                    <MenuButton
                        onClick={() => {
                            if (!editor || !editor.isEditable) {
                                console.log('Editor not ready');
                                return;
                            }
                            try {
                                console.log('Clicking H4 button');
                                editor.chain().focus().toggleHeading({ level: 4 }).run();
                                console.log('H4 command executed');
                            } catch (error) {
                                console.error('Heading 4 error:', error);
                            }
                        }}
                        isActive={editor?.isActive('heading', { level: 4 }) || false}
                        title="Heading 4"
                    >
                        <span className="text-xs font-bold">H4</span>
                    </MenuButton>

                    <MenuButton
                        onClick={() => {
                            if (!editor || !editor.isEditable) {
                                console.log('Editor not ready');
                                return;
                            }
                            try {
                                console.log('Clicking H5 button');
                                editor.chain().focus().toggleHeading({ level: 5 }).run();
                                console.log('H5 command executed');
                            } catch (error) {
                                console.error('Heading 5 error:', error);
                            }
                        }}
                        isActive={editor?.isActive('heading', { level: 5 }) || false}
                        title="Heading 5"
                    >
                        <span className="text-xs font-bold">H5</span>
                    </MenuButton>

                    <MenuButton
                        onClick={() => {
                            if (!editor || !editor.isEditable) {
                                console.log('Editor not ready');
                                return;
                            }
                            try {
                                console.log('Clicking H6 button');
                                editor.chain().focus().toggleHeading({ level: 6 }).run();
                                console.log('H6 command executed');
                            } catch (error) {
                                console.error('Heading 6 error:', error);
                            }
                        }}
                        isActive={editor?.isActive('heading', { level: 6 }) || false}
                        title="Heading 6"
                    >
                        <span className="text-xs font-bold">H6</span>
                    </MenuButton>

                    <div className="w-px h-6 bg-slate-700 mx-2"></div>

                    <div className="flex items-center gap-2 px-2 border-l border-slate-700 ml-2">
                        <select
                            className="bg-slate-700 text-white text-xs rounded px-2 py-1 border border-slate-600 focus:outline-none focus:border-primary cursor-pointer"
                            value={editor.getAttributes('textStyle')?.fontSize || ''}
                            onChange={(event) => {
                                event.preventDefault();
                                const value = event.target.value;
                                try {
                                    if (value) {
                                        console.log('Setting font size to:', value);
                                        editor.chain().focus().setFontSize(value).run();
                                    } else {
                                        console.log('Unsetting font size');
                                        editor.chain().focus().unsetFontSize().run();
                                    }
                                } catch (error) {
                                    console.error('Font size error:', error);
                                }
                            }}
                        >
                            <option value="">Size</option>
                            <option value="12px">12</option>
                            <option value="14px">14</option>
                            <option value="16px">16</option>
                            <option value="18px">18</option>
                            <option value="20px">20</option>
                            <option value="24px">24</option>
                            <option value="30px">30</option>
                            <option value="36px">36</option>
                            <option value="48px">48</option>
                            <option value="60px">60</option>
                            <option value="72px">72</option>
                        </select>
                    </div>

                    <MenuButton
                        onClick={() => {
                            try {
                                editor.chain().focus().toggleBulletList().run();
                            } catch (error) {
                                console.error('Bullet list error:', error);
                            }
                        }}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </MenuButton>

                    <MenuButton
                        onClick={() => {
                            try {
                                editor.chain().focus().toggleOrderedList().run();
                            } catch (error) {
                                console.error('Ordered list error:', error);
                            }
                        }}
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
                        onClick={() => {
                            try {
                                editor.chain().focus().undo().run();
                            } catch (error) {
                                console.error('Undo error:', error);
                            }
                        }}
                        isActive={false}
                        disabled={!editor?.can().undo()}
                        title="Undo"
                    >
                        <Undo className="h-4 w-4" />
                    </MenuButton>

                    <MenuButton
                        onClick={() => {
                            try {
                                editor.chain().focus().redo().run();
                            } catch (error) {
                                console.error('Redo error:', error);
                            }
                        }}
                        isActive={false}
                        disabled={!editor?.can().redo()}
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

            // Create provider after socket connection with simple setup
            newProvider = new SocketIOProvider(socket, ydoc, room);

            // Just set the provider without complex checks
            setProvider(newProvider);
            setIsProviderReady(true);
            console.log('Provider ready');
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
                    newProvider.awareness.off('change', () => { });
                }
                newProvider.destroy();
            }
            socket.off('connect', handleSocketConnect);
            socket.off('connect_error', handleSocketError);
            socket.off('disconnect', handleSocketDisconnect);
            socket.disconnect();
        };
    }, [workspaceId, projectId, userInfo?.name, userColor]);

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
