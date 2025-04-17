import { useState, useCallback } from 'react'

export function useCopyToClipboard(
    text: string,
    timeout = 2000
): [boolean, () => void] {
    const [copied, setCopied] = useState(false)

    const copy = useCallback(() => {
        if (!text) return
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), timeout)
    }, [text, timeout])

    return [copied, copy]
}
