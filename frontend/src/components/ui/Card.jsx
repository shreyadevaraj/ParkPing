import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }) {
    return (
        <div
            className={twMerge(
                'bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
