// Base calendar interfaces
export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: EventDateTime;
  end: EventDateTime;
  attendees?: Attendee[];
  status?: EventStatus;
  created?: string;
  updated?: string;
  timeZone?: string;
}

export interface EventDateTime {
  dateTime: string;  // ISO 8601 format
  timeZone?: string; // IANA timezone format
}

export interface Attendee {
  email: string;
  displayName?: string;
  optional?: boolean;
  responseStatus?: AttendeeStatus;
}

// List events arguments
export interface ListEventsArgs {
  maxResults?: number;
  timeMin?: string;   // ISO 8601
  timeMax?: string;   // ISO 8601
  query?: string;     // Free text search
  timeZone?: string;  // IANA timezone
}

// Read event arguments
export interface ReadEventArgs {
  eventId: string;
  timeZone?: string;  // IANA timezone
}

// Create/Update event arguments
export interface CreateEventArgs extends Omit<CalendarEvent, 'id' | 'created' | 'updated'> {
  sendNotifications?: boolean;
}

export interface UpdateEventArgs extends Partial<CreateEventArgs> {
  eventId: string;
  sendNotifications?: boolean;
}

// Enums
export enum EventStatus {
  CONFIRMED = 'confirmed',
  TENTATIVE = 'tentative',
  CANCELLED = 'cancelled'
}

export enum AttendeeStatus {
  NEEDS_ACTION = 'needsAction',
  DECLINED = 'declined',
  TENTATIVE = 'tentative',
  ACCEPTED = 'accepted'
}

// Response type (matching Gmail pattern)
export interface CalendarResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

// Type guards
export function isCreateEventArgs(args: Record<string, unknown>): args is CreateEventArgs {
  const a = args as Partial<CreateEventArgs>;
  return (
    typeof a.summary === 'string' &&
    a.start !== undefined &&
    typeof a.start.dateTime === 'string' &&
    a.end !== undefined &&
    typeof a.end.dateTime === 'string' &&
    (a.description === undefined || typeof a.description === 'string') &&
    (a.location === undefined || typeof a.location === 'string') &&
    (a.attendees === undefined || Array.isArray(a.attendees)) &&
    (a.timeZone === undefined || typeof a.timeZone === 'string')
  );
}

export function isUpdateEventArgs(args: Record<string, unknown>): args is UpdateEventArgs {
  return (
    typeof args.eventId === 'string' &&
    (args.summary === undefined || typeof args.summary === 'string') &&
    (args.description === undefined || typeof args.description === 'string') &&
    (args.location === undefined || typeof args.location === 'string') &&
    (args.start === undefined || (typeof args.start.dateTime === 'string')) &&
    (args.end === undefined || (typeof args.end.dateTime === 'string')) &&
    (args.attendees === undefined || Array.isArray(args.attendees)) &&
    (args.timeZone === undefined || typeof args.timeZone === 'string')
  );
}