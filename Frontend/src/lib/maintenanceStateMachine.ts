/**
 * Maintenance State Machine — State Pattern
 * Enforces forward-only ticket status transitions.
 */
import type { TicketStatus } from '../types';

const TRANSITIONS: Record<TicketStatus, TicketStatus | null> = {
  OPEN: 'IN_PROGRESS',
  IN_PROGRESS: 'RESOLVED',
  RESOLVED: null,
};

/**
 * Returns true only if moving from `current` to `next` is a valid forward step.
 */
export function canTransition(current: TicketStatus, next: TicketStatus): boolean {
  return TRANSITIONS[current] === next;
}

export function nextStatus(current: TicketStatus): TicketStatus | null {
  return TRANSITIONS[current];
}
