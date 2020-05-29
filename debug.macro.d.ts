/**
 * throw an error if condition is not met
 */
export function assert(condition: boolean, message?: string): void;

/**
 * throw an error if val is a falsy value
 */
export function assertIsDefined<T>(val: T, message?: string): asserts val is NonNullable<T>

/**
 * expose identifier on window
 * e.g. window.identifier = identifier
 */
export function expose(identifier: any, as?: string): void;
