import { PipelineStage, Types } from 'mongoose';
import { TicketStatus } from '../schemas/ticket.schema';

export class QueryTicket {
  static paidByRaffle(raffleId: string): PipelineStage[] {
    return [
      { $match: { raffleId: new Types.ObjectId(raffleId), status: TicketStatus.PAID } },
      {
        $project: {
          _id: 1,
          name: 1,
          phone: 1,
          numbers: 1,
          totalAmount: 1,
          currency: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ];
  }
}
