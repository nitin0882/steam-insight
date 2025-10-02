"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error)
    }, [error])

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-2xl mx-auto">
                    {/* Error Icon */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center">
                            <div className="rounded-full bg-red-500/10 p-6">
                                <AlertTriangle className="h-16 w-16 text-red-500" />
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        Oops! Something went wrong
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                        We encountered an unexpected error while loading this page. Don&apos;t worry,
                        it&apos;s not your fault - we&apos;re working to fix it!
                    </p>

                    {/* Error Details (in development) */}
                    {process.env.NODE_ENV === "development" && (
                        <div className="mb-8 p-4 bg-muted/50 rounded-lg text-left">
                            <p className="text-sm font-mono text-muted-foreground">
                                <strong>Error:</strong> {error.message || "Unknown error"}
                            </p>
                            {error.digest && (
                                <p className="text-sm font-mono text-muted-foreground mt-2">
                                    <strong>Digest:</strong> {error.digest}
                                </p>
                            )}
                            {error.stack && (
                                <details className="mt-2">
                                    <summary className="text-sm font-mono text-muted-foreground cursor-pointer">
                                        Stack Trace
                                    </summary>
                                    <pre className="text-xs font-mono text-muted-foreground mt-2 whitespace-pre-wrap overflow-auto max-h-40">
                                        {error.stack}
                                    </pre>
                                </details>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button onClick={reset} size="lg" className="min-w-48">
                            <RefreshCw className="mr-2 h-5 w-5" />
                            Try Again
                        </Button>

                        <Button asChild variant="outline" size="lg" className="min-w-48">
                            <Link href="/">
                                <Home className="mr-2 h-5 w-5" />
                                Go Home
                            </Link>
                        </Button>
                    </div>

                    {/* Additional Information */}
                    <div className="mt-12 p-6 rounded-lg border border-border/50 bg-muted/30">
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                            What happened?
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            This error has been automatically reported to our team. We&apos;re constantly
                            working to improve SteamInsight and prevent issues like this from happening again.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}