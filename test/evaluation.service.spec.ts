import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationService } from '../src/evaluation/evaluation.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { Category, Device, Type } from '@prisma/client';

describe('EvaluationService', () => {
  let service: EvaluationService;
  let prismaService: PrismaService;
  const mockEvaluationFindMany = jest.fn() as jest.Mock;
  const mockEvaluationFindFirst = jest.fn() as jest.Mock;
  const mockEvaluationCreate = jest.fn() as jest.Mock;
  const mockEvaluationDelete = jest.fn() as jest.Mock;
  const mockEvaluationUpdate = jest.fn() as jest.Mock;
  const mockDeviceFindUnique = jest.fn() as jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluationService,
        {
          provide: PrismaService,
          useValue: {
            evaluation: {
              findMany: mockEvaluationFindMany,
              findFirst: mockEvaluationFindFirst,
              create: mockEvaluationCreate,
              delete: mockEvaluationDelete,
              update: mockEvaluationUpdate,
            },
            device: {
              findUnique: mockDeviceFindUnique,
            },
          },
        },
      ],
    }).compile();

    service = module.get<EvaluationService>(EvaluationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEvaluations', () => {
    it('should fetch evaluations for a valid page query', async () => {
      const mockEvaluations = [
        { id: 1, user: 'user1' },
        { id: 2, user: 'user2' },
      ];
      mockEvaluationFindMany.mockResolvedValue(mockEvaluations);

      const result = await service.getEvaluations('1');
      expect(result).toEqual(mockEvaluations);
    });

    it('should handle an invalid page query by returning an empty array', async () => {
      mockEvaluationFindMany.mockResolvedValue([]);

      const result = await service.getEvaluations('invalid');
      expect(result).toEqual([]);
    });
  });

  describe('getEvaluation', () => {
    it('should fetch a single evaluation by ID', async () => {
      const mockEvaluation = { id: 1, user: 'user1' };
      mockEvaluationFindFirst.mockResolvedValue(mockEvaluation);

      const result = await service.getEvaluation(1);
      expect(result).toEqual(mockEvaluation);
    });

    it('should return null for a non-existing evaluation', async () => {
      mockEvaluationFindFirst.mockResolvedValue(null);

      const result = await service.getEvaluation(999);
      expect(result).toBeNull();
    });
  });

  describe('createEvaluation', () => {
    it('should create an evaluation with valid data', async () => {
      const mockDevice: Device = {
        id: 1,
        createdAt: new Date(),
        name: 'Device1',
        brand: 'BrandName',
        category: Category.LAPTOP,
        description: 'Device description',
      };
      mockDeviceFindUnique.mockResolvedValue(mockDevice);

      const mockEvaluation = { id: 1, user: 'user1', deviceId: 1 };
      mockEvaluationCreate.mockResolvedValue(mockEvaluation);

      const result = await service.createEvaluation(
        1,
        'user1',
        Type.LOW_LIGHT_NOISE,
      );
      expect(result).toEqual(mockEvaluation);
    });
  });

  describe('deleteEvaluation', () => {
    it('should delete an evaluation by ID', async () => {
      const mockDeleteResponse = { id: 1, user: 'user1' };
      mockEvaluationDelete.mockResolvedValue(mockDeleteResponse);

      const result = await service.deleteEvaluation(1);
      expect(result).toEqual(mockDeleteResponse);
    });
  });

  describe('deleteEvaluation', () => {
    it('should delete an evaluation by ID', async () => {
      const mockDeleteResponse = { id: 1, user: 'user1' };
      mockEvaluationDelete.mockResolvedValue(mockDeleteResponse);

      const result = await service.deleteEvaluation(1);
      expect(result).toEqual(mockDeleteResponse);
    });
  });

  describe('updateEvaluation', () => {
    it('should update an evaluation', async () => {
      const updatedEvaluation = { id: 1, user: 'user1', newData: 'newData' };
      mockEvaluationUpdate.mockResolvedValue(updatedEvaluation);

      const result = await service.updateEvaluation(1, { newData: 'newData' });
      expect(result).toEqual(updatedEvaluation);
    });
  });
});
