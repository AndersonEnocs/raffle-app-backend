import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TicketService } from '../services/ticket.service';
import { PurchaseTicketsDto } from '../dtos/purchase-tickets.dto';
import { AdminJwtGuard } from 'src/admin/guards/admin-jwt.guard';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post(':id/purchase')
  @UsePipes(new ValidationPipe())
  async purchase(
    @Param('id') raffleId: string,
    @Body() dto: PurchaseTicketsDto,
  ) {
    return this.ticketService.purchaseTickets(raffleId, dto);
  }

  @Get(':id/tickets-info')
  async getTicketsInfo(@Param('id') raffleId: string) {
    return this.ticketService.getRaffleTicketsInfo(raffleId);
  }

  @UseGuards(AdminJwtGuard)
  @Get(':id/players')
  async getPaidPlayers(@Param('id') raffleId: string) {
    return this.ticketService.getPaidPlayers(raffleId);
  }
}

