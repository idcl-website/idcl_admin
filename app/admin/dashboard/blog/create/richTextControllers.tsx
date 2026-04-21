import {
    AlignCenter, AlignJustify, AlignLeft, AlignRight,
    Bold, Eraser, Heading1, Heading2, Heading3,
    Italic, Link, List, ListOrdered, Quote,
    Redo, Strikethrough, Underline, Undo
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// execCommand is deprecated but remains the only cross-browser way to do
// inline rich-text editing without a third-party library.
const cmd = (command: string, value?: string) =>
    document.execCommand(command, false, value ?? undefined);

type ToolbarItem = {
    name: string;
    icon: React.ReactNode;
    shortcut?: string;
    onMouseDown: (e: React.MouseEvent) => void;
}

const formatting: ToolbarItem[] = [
    { name: "Bold",          icon: <Bold size={15} />,          shortcut: "Ctrl+B", onMouseDown: (e) => { e.preventDefault(); cmd('bold'); } },
    { name: "Italic",        icon: <Italic size={15} />,        shortcut: "Ctrl+I", onMouseDown: (e) => { e.preventDefault(); cmd('italic'); } },
    { name: "Underline",     icon: <Underline size={15} />,     shortcut: "Ctrl+U", onMouseDown: (e) => { e.preventDefault(); cmd('underline'); } },
    { name: "Strikethrough", icon: <Strikethrough size={15} />,                     onMouseDown: (e) => { e.preventDefault(); cmd('strikeThrough'); } },
]

const headings: ToolbarItem[] = [
    { name: "Heading 1", icon: <Heading1 size={15} />, onMouseDown: (e) => { e.preventDefault(); cmd('formatBlock', 'h1'); } },
    { name: "Heading 2", icon: <Heading2 size={15} />, onMouseDown: (e) => { e.preventDefault(); cmd('formatBlock', 'h2'); } },
    { name: "Heading 3", icon: <Heading3 size={15} />, onMouseDown: (e) => { e.preventDefault(); cmd('formatBlock', 'h3'); } },
]

const alignment: ToolbarItem[] = [
    { name: "Align Left",   icon: <AlignLeft size={15} />,    shortcut: "Ctrl+L", onMouseDown: (e) => { e.preventDefault(); cmd('justifyLeft'); } },
    { name: "Align Center", icon: <AlignCenter size={15} />,  shortcut: "Ctrl+E", onMouseDown: (e) => { e.preventDefault(); cmd('justifyCenter'); } },
    { name: "Align Right",  icon: <AlignRight size={15} />,   shortcut: "Ctrl+R", onMouseDown: (e) => { e.preventDefault(); cmd('justifyRight'); } },
    { name: "Justify",      icon: <AlignJustify size={15} />, shortcut: "Ctrl+J", onMouseDown: (e) => { e.preventDefault(); cmd('justifyFull'); } },
]

const listsGroup: ToolbarItem[] = [
    { name: "Bullet List",   icon: <List size={15} />,        onMouseDown: (e) => { e.preventDefault(); cmd('insertUnorderedList'); } },
    { name: "Numbered List", icon: <ListOrdered size={15} />, onMouseDown: (e) => { e.preventDefault(); cmd('insertOrderedList'); } },
]

const extras: ToolbarItem[] = [
    { name: "Quote", icon: <Quote size={15} />, onMouseDown: (e) => { e.preventDefault(); cmd('formatBlock', 'blockquote'); } },
    {
        name: "Link", icon: <Link size={15} />,
        onMouseDown: (e) => {
            e.preventDefault();
            const url = window.prompt('Enter URL:');
            if (url) cmd('createLink', url);
        }
    },
]

const history: ToolbarItem[] = [
    { name: "Undo",              icon: <Undo size={15} />,  shortcut: "Ctrl+Z", onMouseDown: (e) => { e.preventDefault(); cmd('undo'); } },
    { name: "Redo",              icon: <Redo size={15} />,  shortcut: "Ctrl+Y", onMouseDown: (e) => { e.preventDefault(); cmd('redo'); } },
    { name: "Clear Formatting",  icon: <Eraser size={15} />,                    onMouseDown: (e) => { e.preventDefault(); cmd('removeFormat'); } },
]

const groups = [formatting, headings, alignment, listsGroup, extras, history]

const ToolbarButton = ({ item }: { item: ToolbarItem }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <button
                type="button"
                className="p-1.5 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label={item.name}
                onMouseDown={item.onMouseDown}
            >
                {item.icon}
            </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
            {item.shortcut ? `${item.name} (${item.shortcut})` : item.name}
        </TooltipContent>
    </Tooltip>
)

export const RichTextControllers = () => {
    return (
        <div className="flex flex-wrap items-center gap-0.5">
            {groups.map((group, gi) => (
                <div key={gi} className="flex items-center">
                    {gi > 0 && (
                        <span className="w-px h-4 bg-gray-200 mx-1.5" />
                    )}
                    {group.map((item) => (
                        <ToolbarButton key={item.name} item={item} />
                    ))}
                </div>
            ))}
        </div>
    )
}
