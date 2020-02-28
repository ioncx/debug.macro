/**
 * throw an error if condition is not met
 */
export function assert(condition: boolean, message: string): void;

/**
 * expose identifier on window
 * e.g. window.identifier = identifier
 */
export function expose(identifier: any, as?: string): void;
