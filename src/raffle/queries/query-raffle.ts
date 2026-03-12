import { PipelineStage, Types } from 'mongoose';

export class QueryRaffle {
  static byId(id: string) {
    return { _id: new Types.ObjectId(id) };
  }

  static paginateList(skip = 0, limit = 20): PipelineStage[] {
    return [
      { $sort: { createdAt: -1 } },
      { $skip: Math.max(0, skip) },
      { $limit: Math.max(1, Math.min(limit, 100)) },
    ];
  }

  
  static withPlayers(raffleId: string): PipelineStage[] {
    return [
      { $match: { _id: new Types.ObjectId(raffleId) } },
      {
        $lookup: {
          from: 'tickets',
          let: { rid: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [ { $eq: ['$raffleId', '$$rid'] }, { $eq: ['$status', 'PAID'] } ] } } },
            { $project: { name: 1, phone: 1, numbers: 1, totalAmount: 1, currency: 1, createdAt: 1 } },
          ],
          as: 'players',
        },
      },
    ];
  }
}

