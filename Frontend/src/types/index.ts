/** Core domain types for SafeStay */

export type UserRole = 'STUDENT' | 'OWNER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export type RoomStatus = 'AVAILABLE' | 'PENDING_LOCK' | 'BOOKED';

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Room {
  id: string;
  name: string;
  location: string;
  basePrice: number;
  images: string[];
  amenities: string[];
  status: RoomStatus;
  version: number;
  rating?: number;
  distance?: string;
}

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
export type TicketPriority = 'URGENT' | 'STANDARD' | 'LOW';

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  location: string;
  assignee?: string;
  createdAt: string;
}

export interface Property {
  id: string;
  name: string;
  type: string;
  occupancy: number;
  monthlyRevenue: number;
  status: 'HEALTHY' | 'PENDING' | 'FULL';
  address: string;
  image?: string;
}

export interface ActivityFeedItem {
  id: string;
  type: 'booking' | 'security' | 'maintenance' | 'payment';
  title: string;
  description: string;
  time: string;
  actions?: string[];
}

export interface AddPropertyForm {
  name: string;
  description: string;
  city: string;
  postcode: string;
  amenities: string[];
}
