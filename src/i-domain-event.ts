/** Marker contract for domain events (classification and occurrence time). */
export interface IDomainEvent {
  readonly eventType: string;
  readonly occurredAt: Date;
}
