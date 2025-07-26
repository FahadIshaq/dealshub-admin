import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards,
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserRole } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { JwtAuthGuard } from '../../middleware/jwt.guard';
import { RolesGuard } from '../../middleware/roles.guard';
import { Roles } from '../../middleware/roles.decorator';
import { formatDateForAPI } from '../../utils/helpers';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('administrator')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return {
      message: 'User created successfully. Verification email sent.',
      user: {
        id: user._id,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        roles: user.roles,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: formatDateForAPI(user.createdAt),
      },
    };
  }

  @Get()
  @Roles('administrator')
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return {
      users: users.map(user => ({
        id: user._id,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        roles: user.roles,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: formatDateForAPI(user.createdAt),
      })),
    };
  }

  @Get('role/:role')
  @Roles('administrator')
  async getUsersByRole(@Param('role') role: UserRole) {
    const users = await this.usersService.getUsersByRole(role);
    return {
      users: users.map(user => ({
        id: user._id,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        roles: user.roles,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: formatDateForAPI(user.createdAt),
      })),
    };
  }

  @Get(':id')
  @Roles('administrator')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      return { message: 'User not found' };
    }
    return {
      user: {
        id: user._id,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        roles: user.roles,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: formatDateForAPI(user.createdAt),
      },
    };
  }

  @Put(':id')
  @Roles('administrator')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.updateUser(id, updateUserDto);
    if (!user) {
      return { message: 'User not found' };
    }
    return {
      message: 'User updated successfully',
      user: {
        id: user._id,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        roles: user.roles,
        isActive: user.isActive,
        isVerified: user.isVerified,
        updatedAt: formatDateForAPI(user.updatedAt),
      },
    };
  }

  @Delete(':id')
  @Roles('administrator')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }

  @Put(':id/toggle-status')
  @Roles('administrator')
  async toggleUserStatus(@Param('id') id: string) {
    const user = await this.usersService.toggleUserStatus(id);
    if (!user) {
      return { message: 'User not found' };
    }
    return {
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        roles: user.roles,
        isActive: user.isActive,
        isVerified: user.isVerified,
        updatedAt: formatDateForAPI(user.updatedAt),
      },
    };
  }
} 