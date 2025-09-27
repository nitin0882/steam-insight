import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface StyledTextProps {
    children: string
    className?: string
    variant?: "default" | "review" | "description"
    maxLength?: number
    expandable?: boolean
}

export function StyledText({
    children,
    className,
    variant = "default",
    maxLength = 300,
    expandable = true
}: StyledTextProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    // Check if content is long enough to need expansion
    const needsExpansion = expandable && children.length > maxLength
    const displayText = needsExpansion && !isExpanded
        ? children.substring(0, maxLength) + "..."
        : children

    // Split text into paragraphs and handle formatting
    const formatText = (text: string) => {
        if (!text) return []

        // First, detect if this is BBCode (Steam format) or Markdown
        const isBBCode = /\[(?:b|i|u|url|h1|h2|h3|table|tr|td|th|list|\*|hr)\]/i.test(text)

        let processedText = text
        const codeBlocks: { [key: string]: string } = {}

        if (isBBCode) {
            // Handle BBCode formatting
            processedText = formatBBCode(text)
        } else {
            // Handle code blocks first for markdown (```code```)
            const codeBlockRegex = /```([\s\S]*?)```/g
            let codeBlockIndex = 0

            processedText = text.replace(codeBlockRegex, (match, code) => {
                const placeholder = `__CODE_BLOCK_${codeBlockIndex}__`
                codeBlocks[placeholder] = code.trim()
                codeBlockIndex++
                return placeholder
            })
        }

        // Split by double newlines for paragraphs, but preserve single newlines
        const paragraphs = processedText.split(/\n\s*\n/).filter(p => p.trim())

        return paragraphs.map((paragraph, index) => {
            // Check if this is a code block placeholder (only for markdown)
            if (!isBBCode && paragraph.trim().startsWith('__CODE_BLOCK_') && paragraph.trim().endsWith('__')) {
                const codeContent = codeBlocks[paragraph.trim()]
                if (codeContent) {
                    return (
                        <div key={index} className="mb-4">
                            <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm font-mono">
                                <code>{codeContent}</code>
                            </pre>
                        </div>
                    )
                }
            }

            // For BBCode, render as HTML directly
            if (isBBCode) {
                return (
                    <div
                        key={index}
                        className="mb-3 last:mb-0"
                        dangerouslySetInnerHTML={{ __html: paragraph }}
                    />
                )
            }

            // Handle different types of content within paragraphs
            const lines = paragraph.split('\n').map(line => line.trim()).filter(line => line)

            return (
                <div key={index} className="mb-3 last:mb-0">
                    {lines.map((line, lineIndex) => {
                        // Check for headers (# ## ###)
                        const headerMatch = line.match(/^(#{1,6})\s+(.*)/)
                        if (headerMatch) {
                            const level = headerMatch[1].length
                            const text = headerMatch[2]
                            const HeaderTag = `h${Math.min(level + 2, 6)}` as keyof JSX.IntrinsicElements
                            const headerClasses = {
                                1: "text-lg font-bold text-foreground mt-4 mb-2",
                                2: "text-base font-bold text-foreground mt-3 mb-2",
                                3: "text-sm font-semibold text-foreground mt-2 mb-1"
                            }
                            return (
                                <HeaderTag
                                    key={lineIndex}
                                    className={headerClasses[Math.min(level, 3) as keyof typeof headerClasses] || "font-medium text-foreground"}
                                >
                                    {text}
                                </HeaderTag>
                            )
                        }

                        // Check for blockquotes (> text)
                        if (line.startsWith('> ')) {
                            return (
                                <blockquote key={lineIndex} className="border-l-2 border-primary/50 pl-4 my-2 italic text-muted-foreground">
                                    {line.substring(2)}
                                </blockquote>
                            )
                        }

                        // Check if line starts with bullet points
                        if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
                            const content = line.substring(2)
                            return (
                                <div key={lineIndex} className="flex items-start gap-2 mb-1">
                                    <span className="text-primary mt-1 text-xs">•</span>
                                    <span className="flex-1" dangerouslySetInnerHTML={{ __html: isBBCode ? content : formatInlineMarkdown(content) }} />
                                </div>
                            )
                        }

                        // Check for numbered lists
                        if (/^\d+\.\s/.test(line)) {
                            const match = line.match(/^(\d+)\.\s(.*)/)
                            if (match) {
                                return (
                                    <div key={lineIndex} className="flex items-start gap-2 mb-1">
                                        <span className="text-primary font-medium text-sm">{match[1]}.</span>
                                        <span className="flex-1" dangerouslySetInnerHTML={{ __html: isBBCode ? match[2] : formatInlineMarkdown(match[2]) }} />
                                    </div>
                                )
                            }
                        }

                        // Check for horizontal rules (--- or ***)
                        if (line.match(/^(-{3,}|\*{3,})$/)) {
                            return (
                                <hr key={lineIndex} className="my-4 border-border" />
                            )
                        }

                        // Regular paragraph text with inline formatting
                        return (
                            <div
                                key={lineIndex}
                                className="mb-1 last:mb-0"
                                dangerouslySetInnerHTML={{ __html: isBBCode ? line : formatInlineMarkdown(line) }}
                            />
                        )
                    })}
                </div>
            )
        })
    }

    // Handle BBCode formatting for Steam reviews
    const formatBBCode = (text: string) => {
        let formatted = text

        // Handle tables first (complex structure)
        formatted = formatted.replace(/\[table\]([\s\S]*?)\[\/table\]/gi, (match: string, content: string) => {
            let tableContent = content

            // Convert table rows and cells
            tableContent = tableContent.replace(/\[tr\]([\s\S]*?)\[\/tr\]/gi, (trMatch: string, trContent: string) => {
                let rowContent = trContent
                rowContent = rowContent.replace(/\[th\]([\s\S]*?)\[\/th\]/gi, '<th class="p-2 font-semibold text-left border-b border-border">$1</th>')
                rowContent = rowContent.replace(/\[td\]([\s\S]*?)\[\/td\]/gi, '<td class="p-2 border-b border-border/50">$1</td>')
                return `<tr>${rowContent}</tr>`
            })

            return `<div class="overflow-x-auto my-4"><table class="w-full border-collapse bg-muted/20 rounded-lg overflow-hidden">${tableContent}</table></div>`
        })

        // Handle lists
        formatted = formatted.replace(/\[list\]([\s\S]*?)\[\/list\]/gi, (match, content) => {
            let listContent = content
            listContent = listContent.replace(/\[\*\](.*?)(?=\[\*\]|$)/gi, '<li class="flex items-start gap-2 mb-1"><span class="text-primary mt-1 text-xs">•</span><span class="flex-1">$1</span></li>')
            return `<ul class="my-2">${listContent}</ul>`
        })

        // Handle headers
        formatted = formatted.replace(/\[h1\]([\s\S]*?)\[\/h1\]/gi, '<h3 class="text-lg font-bold text-foreground mt-4 mb-2">$1</h3>')
        formatted = formatted.replace(/\[h2\]([\s\S]*?)\[\/h2\]/gi, '<h4 class="text-base font-bold text-foreground mt-3 mb-2">$1</h4>')
        formatted = formatted.replace(/\[h3\]([\s\S]*?)\[\/h3\]/gi, '<h5 class="text-sm font-semibold text-foreground mt-2 mb-1">$1</h5>')

        // Handle horizontal rules
        formatted = formatted.replace(/\[hr\]/gi, '<hr class="my-4 border-border" />')

        // Handle URLs
        formatted = formatted.replace(/\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi, '<a href="$1" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$2</a>')
        formatted = formatted.replace(/\[url\]([\s\S]*?)\[\/url\]/gi, '<a href="$1" class="text-primary hover:underline break-all" target="_blank" rel="noopener noreferrer">$1</a>')

        // Handle basic formatting
        formatted = formatted.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '<strong class="font-semibold text-foreground">$1</strong>')
        formatted = formatted.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, '<em class="italic">$1</em>')
        formatted = formatted.replace(/\[u\]([\s\S]*?)\[\/u\]/gi, '<u class="underline">$1</u>')
        formatted = formatted.replace(/\[s\]([\s\S]*?)\[\/s\]/gi, '<del class="line-through text-muted-foreground">$1</del>')

        // Handle colors (simplified)
        formatted = formatted.replace(/\[color=([^\]]+)\]([\s\S]*?)\[\/color\]/gi, '<span style="color: $1">$2</span>')

        // Handle code
        formatted = formatted.replace(/\[code\]([\s\S]*?)\[\/code\]/gi, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">$1</code>')

        // Apply gaming-specific highlighting after all other formatting
        formatted = formatted.replace(/\b(FPS|RPG|MMO|MMORPG|PvP|PvE|DLC|EA|Early Access|VR|AR|AI|NPC|GPU|CPU|RTX|DLSS)\b/gi, '<span class="text-primary font-medium">$1</span>')
        formatted = formatted.replace(/\b(Steam|Valve|Half-Life|Portal|Counter-Strike|CS:GO|CS2|Dota|TF2)\b/g, '<span class="text-blue-400 font-medium">$1</span>')

        return formatted
    }

    // Handle inline markdown formatting
    const formatInlineMarkdown = (text: string) => {
        let formattedText = text

        // Bold text (**text** or __text__)
        formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
        formattedText = formattedText.replace(/__(.*?)__/g, '<strong class="font-semibold text-foreground">$1</strong>')

        // Italic text (*text* or _text_) - but avoid conflicts with bold
        formattedText = formattedText.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="italic">$1</em>')
        formattedText = formattedText.replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em class="italic">$1</em>')

        // Strikethrough (~~text~~)
        formattedText = formattedText.replace(/~~(.*?)~~/g, '<del class="line-through text-muted-foreground">$1</del>')

        // Code inline (`code`)
        formattedText = formattedText.replace(/`([^`]+?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">$1</code>')

        // Links [text](url)
        formattedText = formattedText.replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')

        // Auto-detect URLs
        formattedText = formattedText.replace(/(?<!href="|href=')https?:\/\/[^\s<>]+/g, '<a href="$&" class="text-primary hover:underline break-all" target="_blank" rel="noopener noreferrer">$&</a>')

        // Gaming-specific terms highlighting
        formattedText = formattedText.replace(/\b(FPS|RPG|MMO|MMORPG|PvP|PvE|DLC|EA|Early Access|VR|AR|AI|NPC|GPU|CPU|RTX|DLSS)\b/gi, '<span class="text-primary font-medium">$1</span>')

        // Steam-specific terms
        formattedText = formattedText.replace(/\b(Steam|Valve|Half-Life|Portal|Counter-Strike|CS:GO|CS2|Dota|TF2)\b/g, '<span class="text-blue-400 font-medium">$1</span>')

        return formattedText
    }

    const baseStyles = "text-sm leading-relaxed"

    const variantStyles = {
        default: "text-muted-foreground",
        review: "text-muted-foreground",
        description: "text-foreground"
    }

    return (
        <div className={cn(baseStyles, variantStyles[variant], className)}>
            {formatText(displayText)}
            {needsExpansion && (
                <div className="mt-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-primary hover:text-primary/80 text-sm font-medium p-0 h-auto hover:bg-transparent"
                    >
                        {isExpanded ? (
                            <>
                                <span>Show Less</span>
                                <ChevronUp className="h-4 w-4 ml-1" />
                            </>
                        ) : (
                            <>
                                <span>Read More</span>
                                <ChevronDown className="h-4 w-4 ml-1" />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}