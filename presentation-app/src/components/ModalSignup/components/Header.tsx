import React from 'react'

export function Header({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">{title}</h3>
            <p className="text-l text-zinc-400 max-w-md">
                {subtitle}
            </p>
        </div>
    )
}
