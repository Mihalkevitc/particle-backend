import { Test, TestingModule } from '@nestjs/testing';
import { PresetsService } from './presets.service';

describe('PresetsService', () => {
  let service: PresetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresetsService],
    }).compile();

    service = module.get<PresetsService>(PresetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
