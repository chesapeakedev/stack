// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function for conditionally joining class names together.
 *
 * Combines the power of `clsx` (for conditional class joining) with
 * `tailwind-merge` (for resolving Tailwind CSS class conflicts).
 *
 * This function is used throughout the component library to handle
 * className merging with proper Tailwind CSS specificity resolution.
 *
 * @param inputs - Class values to be merged. Can be strings, objects, arrays, or falsy values.
 * @returns A merged and deduplicated className string with resolved Tailwind conflicts.
 *
 * @example
 * ```tsx
 * // Basic usage
 * cn('px-4 py-2', 'bg-blue-500')
 * // Result: 'px-4 py-2 bg-blue-500'
 *
 * // Conditional classes
 * cn('px-4', isActive && 'bg-blue-500', !isActive && 'bg-gray-200')
 * // Result when isActive=true: 'px-4 bg-blue-500'
 *
 * // Resolving Tailwind conflicts (tailwind-merge)
 * cn('px-4 py-2', 'px-6')
 * // Result: 'py-2 px-6' (px-6 wins over px-4)
 *
 * // Object syntax
 * cn('base-class', {
 *   'text-red-500': hasError,
 *   'text-green-500': isSuccess,
 *   'hidden': !isVisible
 * })
 *
 * // Array syntax
 * cn(['flex', 'items-center'], 'justify-between')
 *
 * // Combining all features
 * cn(
 *   'base-styles',
 *   isLarge && 'text-lg',
 *   {
 *     'bg-blue-500': variant === 'primary',
 *     'bg-gray-500': variant === 'secondary'
 *   },
 *   className // External className prop
 * )
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
