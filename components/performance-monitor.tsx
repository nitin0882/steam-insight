"use client"

import { useEffect } from 'react'
import type { Metric } from 'web-vitals'

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void
    }
}

export function PerformanceMonitor() {
    useEffect(() => {
        // Monitor Core Web Vitals
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
                onCLS(sendToAnalytics)
                onINP(sendToAnalytics)
                onFCP(sendToAnalytics)
                onLCP(sendToAnalytics)
                onTTFB(sendToAnalytics)
            })
        }
    }, [])

    return null
}
function sendToAnalytics(metric: Metric) {
    // Send to your analytics service
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            metric_id: metric.id,
            metric_value: metric.value,
            metric_delta: metric.delta,
        })
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric)
    }
}   
