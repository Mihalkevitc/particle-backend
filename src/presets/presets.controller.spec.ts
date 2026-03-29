import { Test, TestingModule } from '@nestjs/testing';
import { PresetsController } from './presets.controller';

describe('PresetsController', () => {
  let controller: PresetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresetsController],
    }).compile();

    controller = module.get<PresetsController>(PresetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
