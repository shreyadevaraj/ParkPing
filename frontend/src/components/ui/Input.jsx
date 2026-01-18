import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Input({ className, ...props }) {
    return (
        <input
            className={twMerge(
                'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all',
                className
            )}
            {...props}
        />
    );
}
