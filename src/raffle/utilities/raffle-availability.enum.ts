export enum RaffleAvailabilityField {
  TICKETS_AVAILABLE = 'ticketsAvailable',
  TICKETS_SOLD = 'ticketsSold',
  TOTAL_TICKETS = 'totalTickets',
  TAKEN_NUMBERS = 'takenNumbers',
}

export interface RaffleAvailability {
  [RaffleAvailabilityField.TICKETS_AVAILABLE]: number;
  [RaffleAvailabilityField.TICKETS_SOLD]: number;
  [RaffleAvailabilityField.TOTAL_TICKETS]: number;
}

