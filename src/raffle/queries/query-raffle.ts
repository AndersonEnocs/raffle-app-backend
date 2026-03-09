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
}

