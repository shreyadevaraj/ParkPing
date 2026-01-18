import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ className, variant = 'primary', ...props }) {
    const variants = {
        primary: 'bg-black text-white hover:bg-neutral-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
        secondary: 'bg-white text-black border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
    };

    return (
        <button
            className={twMerge(
                'px-6 py-3 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 active:scale-95',
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
